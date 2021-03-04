import {Databean} from './Databean';
import {Model} from "./Model";

export class Field extends Model {

  static #DESCRIPTION_FIELD = "(databean)description";
  static #LABEL_FIELD = "(databean)name";
  static BEAN_TYPE = "crm.config.widget.Field";

  get dataType() {
    return this.databean.values.dataType;
  }
  set dataType(value) {
    this.databean.values.dataType = value;
  }
  get fieldName() {
    return this.databean.values.fieldName;
  }
  set fieldName(value) {
    this.databean.values.fieldName = value;
  }
  get placeholder() {
    return this.databean.values.placeholder;
  }
  set placeholder(value) {
    this.databean.values.placeholder = value;
  }
  get description() {
    return this.databean.values[Field.#DESCRIPTION_FIELD];
  }
  set description(value) {
    this.databean.values[Field.#DESCRIPTION_FIELD] = value;
  }
  get label() {
    return this.databean.values[Field.#LABEL_FIELD];
  }
  set label(value) {
    this.databean.values[Field.#LABEL_FIELD] = value;
  }
}
