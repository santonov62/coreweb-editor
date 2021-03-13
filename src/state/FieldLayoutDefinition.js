import databeanTypesEnum from "../api/DatabeanTypesEnum";

export class FieldLayoutDefinition {

  constructor(data = {}) {
    this.name = data.name;
    this.type = databeanTypesEnum.FieldLayoutDefinition;
    this.id = data.id;

    this.access = data.access || 'optional';
    this.layoutContainerId = data.layoutContainerId;
    this.layoutId = data.layoutId;
    this.order = data.order;
    this.fieldId = data.fieldId;
  }

  fromDatabean(databean) {
    this.name = databean.values.name;
    this.id = databean.rootId;
    this.type = databean.type;

    this.access = databean.values.access;
    this.layoutContainerId = databean.values.container;  //crm.config.common.LayoutContainer
    this.layoutId = databean.values.layout;  // crm.config.common.Layout
    this.order = databean.values.order;
    this.fieldId = databean.values.target;  // crm.config.widget.Field
    this.databean = databean;
    return this;
  }
}
