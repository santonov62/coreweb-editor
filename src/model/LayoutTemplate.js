import {Model} from "./Model";

export class LayoutTemplate extends Model{

  static BEAN_TYPE = 'crm.config.common.LayoutTemplate';

  constructor(data) {
    super(data);
    this.template = data.values.template;
    this.content = data.values.template.content;
  }
}
