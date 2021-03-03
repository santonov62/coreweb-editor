import {Databean} from './Databean';

export class Form extends Databean{
  constructor({values, ...data}) {
    super(data);
    this.values = values;
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
