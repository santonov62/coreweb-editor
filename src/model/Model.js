export class Model {
  constructor(data) {
    this.databean = data;
  }
  get beanType() {
    return this.databean.beanType;
  }
  get type() {
    return this.databean.beanType;
  }
  get id() {
    return this.databean.rootId;
  }
}
