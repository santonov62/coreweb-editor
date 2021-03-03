import {Databean} from './Databean';

export class LayoutTemplate extends Databean {

  static BEAN_TYPE = 'crm.config.common.LayoutTemplate';

  constructor(data) {
    super(data);
  }
  get template() {
    return this.values.template;
  }
  set template(value) {
    this.values.template = value;
  }
  get content() {
    return this.values.template.content;
  }
  set content(value) {
    this.values.template.content = value;
  }
  get path() {
    return this.values.template.path;
  }
  set path(value) {
    this.values.template.path = value;
  }
}
