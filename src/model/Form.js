import {Model} from "./Model";

export class Form extends Model {

  static BEAN_TYPE = 'crm.config.common.Form';

  layoutTemplate = null;
  fields = [];

  get name() {
    return this.databean.values.name
  }
  set name(value) {
    this.databean.values.name = value;
  }
}
