import {Model} from "./Model";

export class Field extends Model {

  static #DESCRIPTION_FIELD = "(databean)description";
  static #LABEL_FIELD = "(databean)name";
  static BEAN_TYPE = "crm.config.widget.Field";

  constructor(data) {
    super(data);
    this.dataType = data.values.dataType;
    this.fieldName = data.values.fieldName;
    this.placeholder = data.values.placeholder;
    this.description = data.values[Field.#DESCRIPTION_FIELD];
    this.label = data.values[Field.#LABEL_FIELD];
  }
}
