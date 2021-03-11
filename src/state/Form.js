import {makeAutoObservable, runInAction} from "mobx";
import {deleteFormFields, getForm, getLayoutTemplate, getFormDependencies, saveForm, saveFormFields, saveFormTemplate} from "../api";
import {LayoutTemplate} from "./LayoutTemplate";
import {Field} from "./Field";
import databeanTypesEnum from "../api/DatabeanTypesEnum";

export class Form {

  isLoading = false
  fieldsForDelete
  layoutTemplate = new LayoutTemplate()
  fields = []
  name
  id
  type

  constructor(data = {}) {
    makeAutoObservable(this, {
      deletedFields: false,
      isNew: false,
    });
    this.name = data.name;
    this.id = data.id;
    this.type = data.type;
  }

  updateField({id, dataType}) {
    const fields = this.fields;
    const index = fields.findIndex(field => id === field.id);
    const field = fields[index];
    if (!field.fieldName)
      field.fieldName = field.id;

    field.dataType = dataType;
    fields.splice(index, 1, field);
  }

  removeField(fieldId) {
    const index = this.fields.findIndex(({id}) => id === fieldId);
    const deletedFields = this.fields.splice(index, 1);
    this.fieldsForDelete = deletedFields
      .filter(({databean}) => databean && !!databean.instanceId)
      .concat(this.fieldsForDelete);
  }

  addField({id = Date.now(), fieldName = '', dataType = ''}) {
    const field = new Field({id, fieldName, dataType});
    this.fields.push(field);
  }

  async loadDependencies() {
    this.isLoading = true;
    const beans = await getFormDependencies({formId: this.id});
    const items = beans.map(bean => {
      const {beanType} = bean;
      if (beanType === databeanTypesEnum.LayoutTemplate)
        return new LayoutTemplate().fromDatabean(bean);
      if (beanType === databeanTypesEnum.Field)
        return new Field().fromDatabean(bean);
      return bean;
    });
    runInAction(() => {
      this.layoutTemplate = items.find(({type}) => type === databeanTypesEnum.LayoutTemplate);
      this.fields = items.filter(({type}) => type === databeanTypesEnum.Field);
      this.fieldsForDelete = [];
      this.isLoading = false;
    });
  }

  async save() {
    this.isLoading = true;
    const fields = this.fields.slice();
    const forDelete = this.fieldsForDelete;

    if (this.isNew()) {
      const name = this.name;
      await saveForm({name});
      const formDatabean = await getForm({name});
      this.fromDatabean(formDatabean);
    } else {
      if (forDelete && forDelete.length > 0)
        await deleteFormFields(forDelete.map(({databean}) => databean.instanceId));
    }

    const formId = this.id;
    const {content, databean: {rootId = '', instanceId: id = ''} = {}} = this.layoutTemplate;
    await Promise.all([
      saveFormTemplate({ content, formId, rootId, id }),
      saveFormFields({formId, fields})
    ]);
    await this.loadDependencies();

    runInAction(() => this.isLoading = false);
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
