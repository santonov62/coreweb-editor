import {makeAutoObservable, runInAction} from "mobx";
import {getFormDependencies} from "../api";
import {LayoutTemplate} from "./LayoutTemplate";
import {Field} from "./Field";
import databeanTypesEnum from "../api/DatbeanTypeEnum";

export class Form {

  layoutTemplate;
  fields = [];
  name
  id
  type

  constructor(data = {}) {
    makeAutoObservable(this);
    this.name = data.name;
    this.id = data.id;
    this.type = data.type;
  }

  removeField(fieldId) {
    const index = this.fields.findIndex(({id}) => id === fieldId);
    this.fields.splice(index, 1);
  }

  addField({id = Date.now(), fieldName = '', dataType = ''}) {
    const field = new Field({id, fieldName, dataType});
    this.fields.push(field);
  }

  async loadFormDependencies() {
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
    });
  }

  fromDatabean(databean) {
    this.name = databean.values.name;
    this.id = databean.rootId;
    this.type = databean.type;
    this.databean = databean;
    return this;
  }
}
