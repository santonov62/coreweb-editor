import {makeAutoObservable, runInAction} from "mobx";
import * as api from '../api';
import {LayoutTemplate} from "./LayoutTemplate";
import {Field} from "./Field";
import databeanTypesEnum from "../api/DatabeanTypesEnum";
import {Layout} from "./Layout";
import {LayoutContainer} from "./LayoutContainer";
import {FieldLayoutDefinition} from "./FieldLayoutDefinition";

export class Form {

  isLoading = false
  layout
  layoutContainer
  layoutTemplate
  fields
  // fieldLayoutDefinitions
  name
  id
  type
  selectedLayout

  constructor(data = {}) {
    makeAutoObservable(this, {
      // deletedFields: false,
      // deletedFieldLayoutDefinitions: false,
      isNew: false,
      saveNew: false
    });
    this.name = data.name;
    this.id = data.id;
    this.type = data.type;
    // this.fieldLayoutDefinitions = new Map();
    this.layoutTemplate = new LayoutTemplate({form: this});
    this.layoutContainer = new LayoutContainer({form: this});
    this.layout = new Layout({form: this});
    this.state = data.state;
    this.fields = [];
  }

  newField({id = Date.now(), fieldName = '', dataType = ''}, area) {
    const field = new Field({id, fieldName, dataType});
    this.fields.push(field);
    return field;
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
      const fieldLayoutDefinitions = fieldLayoutDefinitionBeans.map((bean, index) => {
        const layout = new FieldLayoutDefinition().fromDatabean(bean);
        layout.field = fields.find(field => field.id === layout.fieldId);
        return layout;
      });

      // const fieldLayoutDefinitionsMap = form.layoutTemplate.mapLayoutDefinitionsToAreas(fieldLayoutDefinitions)
      //   || form.layoutTemplate.mapDefaultLayoutDefinitionsToAreas(fieldLayoutDefinitions)
      form.layoutTemplate.mapLayoutDefinitionsToAreas(fieldLayoutDefinitions)
      || form.layoutTemplate.mapDefaultLayoutDefinitionsToAreas(fieldLayoutDefinitions)

      runInAction(() => {
        this.fields = fields;
        // this.fieldLayoutDefinitions = fieldLayoutDefinitionsMap;
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

      const formId = form.id;
      form.layoutTemplate.makeTemplateContent();
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
    const {layoutTemplate} = form;
    const areas = [...new Set(layoutTemplate.templateAreas.flat())];
    const fieldLayoutDefinitions = [];
    const deleteFiledLayoutDefinitions = [];
    for (const [area, layout] of layoutTemplate.fieldLayoutDefinitions) {
      if (areas.includes(area)) {
        fieldLayoutDefinitions.push(layout);
      } else if (layout.databean?.instanceId) {
        deleteFiledLayoutDefinitions.push(layout);
      }
    }
    if (deleteFiledLayoutDefinitions.length > 0) {
      await api.deleteFieldLayoutDefinitions(deleteFiledLayoutDefinitions.map(({databean}) => databean.instanceId));
    }

    const fields = new Set();
    const fieldsWithLayout = fieldLayoutDefinitions.map(({field}) => field);
    for (const field of fieldsWithLayout.concat(form.fields)) {
      fields.add(field);
    }
    console.log(`Save fields: `, fields);
    await api.saveFormFields({formId, fields: [...fields]});

    const fieldBeans = await api.getFromFields({formId});
    fields.forEach(field => {
      const fieldBean = fieldBeans.find(({values:{fieldName}}) => fieldName === field.fieldName);
      field.fromDatabean(fieldBean);
    })

    await api.saveFieldLayoutDefinitions({
      formId,
      layoutId: form.layout.id,
      layoutContainerId: form.layoutContainer.id,
      fieldsLayoutDefinitions: fieldLayoutDefinitions,
    });
  }

  setName(name) {
    this.name = name;
  }

  isNew() {
    return !this.databean || !this.databean.rootId;
  }

  setSelectedLayoutDefinition(layout) {
    this.selectedLayout = layout;
  }
  //
  // newFieldLayoutDefinition(area) {
  //   const fieldLayoutDefinition = new FieldLayoutDefinition();
  //   runInAction(() =>
  //     this.fieldLayoutDefinitions.set(area, fieldLayoutDefinition)
  //   )
  //   return fieldLayoutDefinition;
  // }

  fromDatabean(databean) {
    this.name = databean.values.name;
    this.id = databean.rootId;
    this.type = databean.type;
    this.databean = databean;
    return this;
  }
}
