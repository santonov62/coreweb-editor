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
  layoutDefinition

  constructor(data = {}) {
    makeAutoObservable(this, {
      isNew: false
    });
    this.id = data.id || '';
    this.dataType = data.dataType || '';
    this.fieldName = data.fieldName || `fieldName${data.id}`;
    this.placeholder = data.placeholder;
    this.description = data.description;
    this.label = data.label;
    // this.layoutDefinition.fieldId = data.id;
  }

  update(props = {}) {
    for (const [key, value] of Object.entries(props)) {
      // if (!!value)
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
    // this.layoutDefinition.fieldId = databean.rootId;
    this.databean = databean;
    return this;
  }
}
