import * as api from "../api";

export class Layout {

  constructor(data = {}) {
    this.name = data.name;
    this.type = data.type;
    this.id = data.id;
    this.formId = data.formId;
    this.form = data.form;
  }

  isNew() {
    return !this?.databean?.rootId
  }

  async saveUpdate() {
    const layout = this;
    const {form} = layout;
    const formId = form.id;
    await api.saveLayout({formId});
    const layoutDatabean = await api.getLayout({formId});
    layout.fromDatabean(layoutDatabean);
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
