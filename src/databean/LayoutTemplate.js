import {Databean} from './Databean';

//         "(databean)beantype": "crm.config.common.LayoutTemplate",
export class LayoutTemplate extends Databean{
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
