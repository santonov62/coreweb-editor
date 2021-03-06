import {Model} from "./Model";

export class Form extends Model {

  static BEAN_TYPE = 'crm.config.common.Form';

  layoutTemplate = null;
  fields = [];

  constructor(data) {
    super(data);
    this.name = data.values.name;
  }
}
