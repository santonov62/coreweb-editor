import {makeAutoObservable} from "mobx";

export class Field {

  static #DESCRIPTION_FIELD = "(databean)description";
  static #LABEL_FIELD = "(databean)name";

  dataType
  fieldName
  placeholder
  description
  label
  id

  constructor(data = {}) {
    makeAutoObservable(this, {
      isNew: false
    });
    this.dataType = data.dataType || '';
    this.fieldName = data.fieldName || '';
    this.placeholder = data.placeholder || '';
    this.description = data.description || '';
    this.label = data.label || '';
    this.id = data.id || '';
  }

  update({dataType}) {
    if (!this.fieldName && dataType)
      this.fieldName = this.id;

    this.dataType = dataType;
  }

  isNew() {
    return !this.databean || !this.databean.rootId;
  }

  fromDatabean(databean) {
    this.id = databean.rootId;
    this.type = databean.type;
    this.dataType = databean.values.dataType;
    this.fieldName = databean.values.fieldName;
    this.placeholder = databean.values.placeholder;
    this.description = databean.values[Field.#DESCRIPTION_FIELD];
    this.label = databean.values[Field.#LABEL_FIELD];
    this.databean = databean;
    return this;
  }
}
