import {makeAutoObservable} from "mobx";

export class LayoutTemplate {

  content
  templateAreas

  constructor(data = {}) {
    makeAutoObservable(this);
    this.id = data.id;
    this.template = data.template;
    this.content = data.content;
    this.templateAreas = [['x1x1']];
  }

  parseFieldAreas() {
    const content = this.content;
    const template = document.createElement('template');
    template.innerHTML = content.toString();
    const container = template.content.querySelector('[data-container-id]');
    console.log(`container: `, container);
    return container.style.gridTemplateAreas.split('" "')
      .map(area => area.replaceAll('"', '').split(' '));
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
