import { LitElement, html, css } from 'lit-element';
import FieldDataTypeEnum from "../FieldDataTypeEnum";

export class FormField extends LitElement {

  static get properties() {
    return {
      componentType: {type: String},
      id: {type: Number},
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
    this.componentType = '';
  }
  onChangeType(e) {
    this.componentType = e.target.value;
  }
  destroy(e) {
    const node = e.path[2];
    !!node && node.remove();
  }
  render() {
    const {componentType} = this;
    const componentOptions = Object.entries(FieldDataTypeEnum).map(([key, value]) => html`
      <option value="${value}" ?selected=${componentType === value}>${value}</option>`);

    return html`
        <a href="#" class="destroyButton" @click=${this.destroy}>X</a>
        <select @change=${this.onChangeType}>
          <option>???</option>
          ${componentOptions}
        </select>
        <div class="component">
            ${renderFieldComponent(componentType)}
        </div>
    `;
  }
  save() {

  }
}

function renderFieldComponent(componentType) {
  switch (componentType) {
    case FieldDataTypeEnum.textfield:
      return html`<div>xtextfield widget</div>`;
    case FieldDataTypeEnum.$textfield:
      return html`<cw-text-field label="cwTextField" />`;
    default:
      return html`???`;
  }
}

customElements.define('form-field', FormField);
