import {Databean} from './Databean';

export class Form extends Databean{

  static BEAN_TYPE = 'crm.config.common.Form';

  constructor(data) {
    super(data);
  }
  get name() {
    return this.values.name
  }
  set name(value) {
    this.values.name = value;
  }
  get isStandard() {
    return this.values.isStandard;
  }
  set isStandard(value) {
    this.values.isStandard = value;
  }
}
