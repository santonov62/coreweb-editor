import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {MobxLitElement} from "@adobe/lit-mobx";
import {Field} from "../../state/Field";

export class FormField extends MobxLitElement {

  static get properties() {
    return {
      id: {type: Number},
      isEditEnabled: {type: Boolean},
      field: {attribute: false}
      // dataType: {type: String},
      // fieldName: {type: String},
      // label: {type: String},
      // placeholder: {type: String}
    }
  }

  static get styles() {
    return [
      css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;
      }
      select {
        margin: 10px 0 10px 0;
      }
      .controls {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .component {
        align-self: stretch
      }
      `
    ]
  }

  constructor() {
    super();
    this.field = new Field();
    // this.addEventListener('focus', (event) =>  this.isEditEnabled = true );
    // this.addEventListener('blur', (event) =>  this.isEditEnabled = false );
  }

  render() {
    if (!this.field)
      return;
    const field = this.field
    console.log('FormField render', field);
    const {fieldName, label, dataType, placeholder, id} = field;
    const {access} = field.layoutDefinition;
    const editUrl = `${location.origin}/webadmin/rulesui2.crm-customer-fields.ct?formName=notStandardFields&filter_(databean)rootId=${id}`;

    return html`
      <div class="controls">
        <a href=${editUrl} target="_blank">Field</a> |
      </div>
      <h2>${dataType}</h2>
      <div class="component">
        ${renderFieldComponent(field)}
      </div>
      <div>Field: ${JSON.stringify({dataType, label, fieldName, placeholder})}</div>
      <div>FieldLayoutDefinition: ${JSON.stringify({access})}</div>
    `;
  }
}

function renderFieldComponent({dataType, label, placeholder, layoutDefinition:{access}=''}) {
  if (FieldDataTypeEnum[dataType] && customElements.get(dataType)) {
    return html`<${dataType} label="${label}" placeholder="${placeholder}" ${access}/>`;
  }
  switch (dataType) {
    case FieldDataTypeEnum.textfield:
      return html`
        <div>xtextfield widget</div>`;
    default:
      return html`this widget can't be displayed`;
  }
}

customElements.define('form-field', FormField);
