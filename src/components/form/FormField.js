import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {state} from '../../state';
import {MobxLitElement} from "@adobe/lit-mobx";
import {Field} from "../../state/Field";
import {nothing} from "lit-html";

export class FormField extends MobxLitElement {

  static get properties() {
    return {
      id: {type: Number},
      isEditEnabled: {type: Boolean},
      field: {type: Object},
      layoutDefinition: {type: Object}
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
        background: #3273dc;
        color: white;
        padding: 20px;
        border-radius: 5px;
      }
      select {
        margin: 10px 0 10px 0;
      }
      .controls {

      }
      .component {
        align-self: stretch
      }
      `
    ]
  }

  constructor() {
    super();
    this.isEditEnabled = false;
    this.field = new Field();
    // this.addEventListener('focus', (event) =>  this.isEditEnabled = true );
    // this.addEventListener('blur', (event) =>  this.isEditEnabled = false );
  }

  render() {
    const {isEditEnabled, field, layoutDefinition} = this;
    if (!field)
      return nothing;

    console.log('FormField render', field);
    const {fieldName, label, dataType, placeholder, id} = field;
    // const {access} = layoutDefinition;
    const editUrl = `${location.origin}/webadmin/rulesui2.crm-customer-fields.ct?formName=notStandardFields&filter_(databean)rootId=${id}`;

    // return html`
    //   <div class="controls">
    //     <a href=${editUrl} target="_blank">Open field</a>
    //   </div>
    return html`
      <div class="controls">
        <a href=${editUrl} target="_blank">Open field</a>
      </div>
      <h2>${dataType}</h2>
      <div class="component">
        ${renderFieldComponent(field)}
      </div>
      <div style="word-break: break-all;">Field: ${JSON.stringify({dataType, label, fieldName, placeholder})}</div>
      ${layoutDefinition ? html`
        <div style="word-break: break-all;">FieldLayoutDefinition: ${JSON.stringify({access: layoutDefinition.access})}</div>` : ''}
    `;
  }
}

function renderFieldComponent({dataType}) {
  switch (dataType) {
    case FieldDataTypeEnum.textfield:
      return html`
        <div>xtextfield widget</div>`;
    case FieldDataTypeEnum.cwTextField:
      return html`
        <cw-text-field label="cwTextField"/>`;
    default:
      return html`empty cell`;
  }
}

customElements.define('form-field', FormField);
