import {Databean} from './Databean';

// "values": {
//   "(databean)beantype": "crm.config.widget.Field",
//     "(databean)code": "28511575.extension.textfield1",
//     "(databean)description": null,
//     "(databean)name": "textfield1",
//     "(databean)rootid": "28511777",
//     "dataType": "textfield",
//     "fieldName": "textfield1",
//     "placeholder": "textfield1",
//     "standardObject": 28511575
// },

export class Field extends Databean {

  static DESCRIPTION_KEY = "(databean)description";

  constructor(data) {
    super(data);
  }
  get dataType() {
    return this.values.dataType;
  }
  set dataType(value) {
    this.values.dataType = value;
  }
  get fieldName() {
    return this.values.fieldName;
  }
  set fieldName(value) {
    this.values.fieldName = value;
  }
  get placeholder() {
    return this.values.placeholder;
  }
  set placeholder(value) {
    this.values.placeholder = value;
  }
  get description() {
    return this.values[Field.DESCRIPTION_KEY];
  }
  set description(value) {
    this.values[Field.DESCRIPTION_KEY] = value;
  }
}
