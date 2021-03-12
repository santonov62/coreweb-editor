import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {state} from '../../state';
import {MobxLitElement} from "@adobe/lit-mobx";
import {Field} from "../../state/Field";

export class FormField extends MobxLitElement {

  field = new Field()

  static get properties() {
    return {
      id: {type: Number},
      isEditEnabled: {type: Boolean},
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
    this.isEditEnabled = false;
    // this.addEventListener('focus', (event) =>  this.isEditEnabled = true );
    this.addEventListener('blur', (event) =>  this.isEditEnabled = false );
  }

  set id(value) {
    const oldValue = this._id;
    this._id = value;
    this.field = state.form.fields.find(({id}) => id === value);
    this.requestUpdate('id', oldValue);
  }

  get id() {
    return this._id;
  }

  render() {
    const {isEditEnabled} = this;
    const {fieldName, label, dataType, placeholder, id} = this.field;
    const editUrl = `${location.origin}/webadmin/rulesui2.crm-customer-fields.ct?formName=notStandardFields&filter_(databean)rootId=${id}`;

    return html`
      ${isEditEnabled ? html`<edit-field id=${id}></edit-field>` : ''}
      <div class="controls">
        <button @click=${() => this.isEditEnabled = !this.isEditEnabled}>edit</button> |
        <a href=${editUrl} target="_blank">open</a> |
        <button href="#" @click=${() => state.form.removeField(id)}>delete</button>
      </div>
      <h2>${dataType}</h2>
      <div class="component">
        ${renderFieldComponent(dataType)}
      </div>
      <div>${JSON.stringify({dataType, label, fieldName, placeholder})}</div>
    `;
  }
}

function renderFieldComponent(dataType) {
  switch (dataType) {
    case FieldDataTypeEnum.textfield:
      return html`
        <div>xtextfield widget</div>`;
    case FieldDataTypeEnum.cwTextField:
      return html`
        <cw-text-field label="cwTextField"/>`;
    default:
      return html`???`;
  }
}

customElements.define('form-field', FormField);
