import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../FieldDataTypeEnum";
import {state} from '../state/State';
export class FormField extends LitElement {

  state = state;

  static get properties() {
    return {
      id: {type: Number},
      dataType: {type: String},
      fieldName: {type: String},
      label: {type: String},
      placeholder: {type: String},
      field: {type: Object}
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
      .destroyButton {
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

  onChangeType(e) {
    const value = e.target.value;
    state.setFormField({id: this.id, dataType: value});
  }

  render() {
    const {fieldName, label, dataType, placeholder, id} = this;

    return html`
      <a href="#" class="destroyButton" @click=${() => state.removeFormField(id)}>X</a>
      <select @change=${this.onChangeType}>
        <option>???</option>
        ${Object.values(FieldDataTypeEnum).map(value => html`
          <option value="${value}" ?selected=${dataType === value}>${value}</option>`)}
      </select>
      <div class="component">
        ${renderFieldComponent(dataType)}
      </div>
      <div>${JSON.stringify({dataType, label, fieldName, placeholder})}</div>
    `;
  }

  save() {

  }

  set dataType(newValue) {
    const prevValue = this._dataType;
    this._dataType = newValue;
    if (!this.fieldName && prevValue !== newValue)
      this.fieldName = `${this._dataType}${Date.now()}`;

    this.requestUpdate('dataType', prevValue);
  }

  get dataType() {
    return this._dataType;
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
