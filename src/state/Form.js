import {makeAutoObservable, observable, runInAction} from "mobx";
import * as api from '../api';
import {LayoutTemplate} from "./LayoutTemplate";
import {Field} from "./Field";
import databeanTypesEnum from "../api/DatabeanTypesEnum";
import {Layout} from "./Layout";
import {LayoutContainer} from "./LayoutContainer";
import {FieldLayoutDefinition} from "./FieldLayoutDefinition";

export class Form {

  isLoading = false
  fieldsForDelete
  layout
  layoutContainer
  layoutTemplate
  fields = []
  fieldLayoutDefinitions = []
  name
  id
  type

  constructor(data = {}) {
    makeAutoObservable(this, {
      deletedFields: false,
      isNew: false,
      saveNew: false
    });
    this.name = data.name;
    this.id = data.id;
    this.type = data.type;
    this.layoutTemplate = new LayoutTemplate({form: this});
    this.layoutContainer = new LayoutContainer({form: this});
    this.layout = new Layout({form: this});
    this.state = data.state;
  }

  removeField(fieldId) {
    const index = this.fields.findIndex(({id}) => id === fieldId);
    const deletedFields = this.fields.splice(index, 1);
    this.fieldsForDelete = deletedFields
      .filter(({databean}) => databean && !!databean.instanceId)
      .concat(this.fieldsForDelete);
  }

  addField({id = Date.now(), fieldName = '', dataType = ''}) {
    const form = this;
    const field = new Field({id, fieldName, dataType});
    const fieldLayoutDefinition = new FieldLayoutDefinition({
      fieldId: field.id,
      layoutId: form.layout.id,
      layoutContainerId: form.layoutContainer.id,
      order: form.fields.length
    });
    field.layoutDefinition = fieldLayoutDefinition;
    fieldLayoutDefinition.field = field;
    this.fieldLayoutDefinitions.push(fieldLayoutDefinition);
  }

  async loadDependencies() {
    this.isLoading = true;
    try {
      const form = this;
      const formDefinitionsBeans = await api.getFormDependencies({formId: form.id});

      const fields = [];
      for (const bean of formDefinitionsBeans) {
        const {beanType} = bean;
        if (beanType === databeanTypesEnum.LayoutTemplate) form.layoutTemplate.fromDatabean(bean);
        if (beanType === databeanTypesEnum.Field) fields.push(new Field().fromDatabean(bean));
        if (beanType === databeanTypesEnum.Layout) form.layout.fromDatabean(bean);
        if (beanType === databeanTypesEnum.LayoutContainer) form.layoutContainer.fromDatabean(bean);
      }

      const fieldLayoutDefinitionBeans = await api.getFieldLayoutDefinitions({layoutId: form.layout.id});
      const fieldLayoutDefinitions = fieldLayoutDefinitionBeans.map(bean => {
        const fieldLayoutDefinition = new FieldLayoutDefinition().fromDatabean(bean);
        const field = fields.find(field => field.id === fieldLayoutDefinition.fieldId);
        field.layoutDefinition = fieldLayoutDefinition;
        fieldLayoutDefinition.field = field;
        return fieldLayoutDefinition;
      });
      // for (const bean of fieldLayoutDefinitionBeans) {
      //   const fieldLayoutDefinition = new FieldLayoutDefinition().fromDatabean(bean);
      //   fieldLayoutDefinition.field = fields.find(field => field.id === fieldLayoutDefinition.fieldId);
      //   fieldLayoutDefinitions.push(fieldLayoutDefinition);
      // }

      // fields.forEach((field, index) => {
      //   const bean = fieldLayoutDefinitionBeans.find(({values: {target: fieldId}}) => fieldId === field.id);
      //   if (bean)
      //     field.layoutDefinition.fromDatabean(bean);
      //   else
      //     field.layoutDefinition = new FieldLayoutDefinition({
      //       fieldId: field.id,
      //       layoutId: form.layout.id,
      //       layoutContainerId: form.layoutContainer.id,
      //       order: index,
      //     });
      // });

      runInAction(() => {
        this.fields = fields;
        this.fieldLayoutDefinitions = fieldLayoutDefinitions;
        this.fieldsForDelete = [];
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async save() {
    const form = this;
    try {
      this.isLoading = true;
      const {state} = form;

      if (!form.name)
        throw Error(`Form name required`);
      if (this.isNew() && state?.formsList.find(({name}) => name === form.name))
        throw Error(`From name already exists`);

      if (form.isNew()) {
        await form.saveUpdate(form);
      }

      const layoutsPromises = [];
      form.layout.isNew() && layoutsPromises.push(form.layout.saveUpdate());
      form.layoutContainer.isNew() && layoutsPromises.push(form.layoutContainer.saveUpdate());
      await Promise.all(layoutsPromises);

      const forDelete = form.fieldsForDelete?.slice();
      if (forDelete && forDelete.length > 0) {
        await Promise.all([
          api.deleteFormFields(forDelete.map(({databean}) => databean.instanceId)),
          api.deleteFieldLayoutDefinitions(forDelete.map(field => field.layoutDefinition.databean.instanceId)),
        ]);
      }

      const formId = form.id;
      const {content, databean: {rootId = '', instanceId: id = ''} = {}} = form.layoutTemplate;
      await Promise.all([
        api.saveFormTemplate({content, formId, rootId, id}),
        form.saveUpdateFormFields()
      ]);

      await form.loadDependencies();
    } finally {
      runInAction(() => form.isLoading = false);
    }
  }

  async saveUpdate() {
    const form = this;
    const name = form.name;
    await api.saveForm({name, id: form.id});
    const formDatabean = await api.getForm({name});
    form.fromDatabean(formDatabean);
  }

  async saveUpdateFormFields() {
    const form = this;
    const formId = form.id;
    const fieldsLayoutDefinitions = form.fieldLayoutDefinitions;

    const fields = fieldsLayoutDefinitions.map(fieldLayoutDefinition => fieldLayoutDefinition.field);
    await api.saveFormFields({formId, fields: fields.slice()});

    const fieldBeans = await api.getFromFields({formId});
    fields.forEach(field => {
      const fieldBean = fieldBeans.find(({values:{fieldName}}) => fieldName === field.fieldName);
      field.fromDatabean(fieldBean);
    })

    // const fieldsLayoutDefinitions = form.fields.map(field => ({...field.layoutDefinition}));
    await api.saveFieldLayoutDefinitions({
      formId,
      layoutId: form.layout.id,
      layoutContainerId: form.layoutContainer.id,
      fieldsLayoutDefinitions,
    });
  }

  setName(name) {
    this.name = name;
  }

  isNew() {
    return !this.databean || !this.databean.rootId;
  }

  setTemplateContent(content) {
    this.layoutTemplate.content = content;
  }

  fromDatabean(databean) {
    this.name = databean.values.name;
    this.id = databean.rootId;
    this.type = databean.type;
    this.databean = databean;
    return this;
  }
}
