import {makeAutoObservable} from "mobx";

export class LayoutTemplate {

  content

  constructor(data = {}) {
    makeAutoObservable(this);
    this.id = data.id;
    this.template = data.template;
    this.content = data.content;
  }

  fromDatabean(databean) {
    this.id = databean.rootId;
    this.type = databean.type;
    this.template = databean.values?.template;
    this.content = databean.values?.template?.content;
    this.databean = databean;
    return this;
  }
}
