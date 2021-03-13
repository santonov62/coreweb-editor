import * as api from "../api";

export class LayoutContainer {

  constructor(data = {}) {
    this.name = data.name;
    this.type = data.type;
    this.id = data.id;
    this.formId = data.formId;
    this.form = data.form;
  }

  async saveUpdate() {
    const layoutContainer = this;
    const {form} = this;
    const formId = form.id;
    await api.saveLayoutContainer({formId});
    const layoutContainerDatabean = await api.getLayoutContainer({formId});
    layoutContainer.fromDatabean(layoutContainerDatabean);
  }

  isNew() {
    return !this?.databean?.rootId;
  }

  fromDatabean(databean) {
    this.name = databean.values.name;
    this.id = databean.rootId;
    this.type = databean.type;
    this.formId = databean.values.standardObject;
    this.databean = databean;
    return this;
  }
}
