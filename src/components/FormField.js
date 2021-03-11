import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../FieldDataTypeEnum";
import {state} from '../state';
import {MobxLitElement} from "@adobe/lit-mobx";
import {Field} from "../state/Field";

export class FormField extends MobxLitElement {

  field = new Field()

  static get properties() {
    return {
      id: {type: Number},
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

  // onChangeType(e) {
  //   const value = e.target.value;
  //   state.form.updateField({id: this.id, dataType: value});
  // }

  onChangeType(e) {
    const dataType = e.target.value;
    this.field.update({dataType});
  }

  render() {
    const {fieldName, label, dataType, placeholder, id} = this.field;
    const editUrl = `${location.origin}/webadmin/rulesui2.crm-customer-fields.ct?formName=notStandardFields&filter_(databean)rootId=${id}`;

    return html`
      <div class="controls">
        <a href=${editUrl} class="destroyButton" target="_blank">open</a> |
        <a href="#" class="destroyButton" @click=${() => state.form.removeField(id)}>delete</a>
      </div>
      <select @change=${this.onChangeType}>
        <option>???</option>
        ${Object.values(FieldDataTypeEnum).map(value => html`
          <option value="${value}" ?selected=${dataType === value}>${value}</option>`)}
      </select>
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
