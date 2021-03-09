import {makeAutoObservable, runInAction} from "mobx";
import {getFormDependencies, saveFormFields} from "../api";
import {LayoutTemplate} from "./LayoutTemplate";
import {Field} from "./Field";
import databeanTypesEnum from "../api/DatbeanTypeEnum";

export class Form {

  layoutTemplate
  fields
  name
  id
  type
  isLoading = false

  constructor(data = {}) {
    makeAutoObservable(this);
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
    this.fields.splice(index, 1);
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
      this.isLoading = false;
    });
  }

  async save() {
    this.isLoading = true;
    const fields = this.fields.slice();
    const formId = this.id;
    const params = {
      fields,
      formId
    }
    console.log(params);
    await saveFormFields({formId, fields});
    await this.loadDependencies();
    runInAction(() => this.isLoading = false);
  }

  fromDatabean(databean) {
    this.name = databean.values.name;
    this.id = databean.rootId;
    this.type = databean.type;
    this.databean = databean;
    return this;
  }
}
