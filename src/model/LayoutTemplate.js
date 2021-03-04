import {Model} from "./Model";

export class LayoutTemplate extends Model{

  static BEAN_TYPE = 'crm.config.common.LayoutTemplate';

  get template() {
    return this.databean.values.template;
  }
  set template(value) {
    this.databean.values.template = value;
  }
  get content() {
    return this.databean.values.template.content;
  }
  set content(value) {
    this.databean.values.template.content = value;
  }
}
