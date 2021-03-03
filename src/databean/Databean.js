export class Databean {
  constructor({id, rootId, code, validFromDate, validToDate, beanType, createdWhen, createdByLastName, values}) {
    this.id = id;
    this.rootId = rootId;
    this.code = code;
    this.beanType = beanType;
    this.validFromDate = validFromDate;
    this.validToDate = validToDate;
    this.createdWhen = createdWhen;
    this.createdByLastName = createdByLastName;
    this.values = values;
  }
}
