import databeanTypesEnum from "../api/DatabeanTypesEnum";
import {makeAutoObservable} from "mobx";

export class FieldLayoutDefinition {

  id
  name
  access
  order
  layoutId
  fieldId
  layoutContainerId

  constructor(data = {}) {
    makeAutoObservable(this);
    this.name = data.name;
    this.type = databeanTypesEnum.FieldLayoutDefinition;
    this.id = data.id;

    this.access = data.access || 'optional';
    this.layoutContainerId = data.layoutContainerId;
    this.layoutId = data.layoutId;
    this.order = data.order;
    this.fieldId = data.fieldId;
  }

  update(props = {}) {
    for (const [key, value] of Object.entries(props)) {
      if (!!value)
        this[key] = value;
    }
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
