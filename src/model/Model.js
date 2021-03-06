export class Model {
  constructor(data) {
    this.id = data.rootId;
    this.type = data.beanType;
    this.raw = data;
  }
  get beanType() {
    return this.raw.beanType;
  }
  // get type() {
  //   return this.databean.beanType;
  // }
  // get id() {
  //   return this.rootId;
  // }
}
