
export class LayoutTemplate {

  constructor(data = {}) {
    this.id = data.id;
    this.template = data.template;
    this.content = data.content;
  }

  fromDatabean(databean) {
    this.id = databean.rootId;
    this.type = databean.type;
    this.template = databean.values.template;
    this.content = databean.values.template.content;
    this.databean = databean;
    return this;
  }
}
