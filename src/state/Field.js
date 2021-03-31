import {makeAutoObservable} from "mobx";
import {FieldLayoutDefinition} from "./FieldLayoutDefinition";

export class Field {

  static #DESCRIPTION_FIELD = "(databean)description";
  static #LABEL_FIELD = "(databean)name";

  dataType
  fieldName
  placeholder
  description
  label
  id
  layoutDefinition = new FieldLayoutDefinition();

  constructor(data = {}) {
    makeAutoObservable(this, {
      isNew: false
    });
    this.id = data.id || '';
    this.dataType = data.dataType || '';
    this.fieldName = data.fieldName || `fieldName${data.id}`;
    this.placeholder = data.placeholder || this.fieldName;
    this.description = data.description || this.fieldName;
    this.label = data.label || this.fieldName;
    this.layoutDefinition.fieldId = data.id;
    if (data.access)
      this.layoutDefinition.access = data.access;
  }

  update(props = {}) {
    for (const [key, value] of Object.entries(props)) {
      if (!!value)
        this[key] = value;
    }
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
    this.layoutDefinition.fieldId = databean.rootId;
    this.databean = databean;
    return this;
  }
}
