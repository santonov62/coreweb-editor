import { LitElement, html, css } from 'lit-element';

export const TypesEnum = {xtextfield: "xtextfield", cwTextField: "cw-text-field"}

export class FormItem extends LitElement {

  static get properties() {
    return {
      componentType: {type: String},
      id: {type: Number},
      template: {type: String}
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
        right: 20px;
        top: 20px;
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
    const componentOptions = Object.entries(TypesEnum)
      .map(([key, value]) => html`<option value="${value}" ?selected=${componentType === key}>${value}</option>`);

    return html`
<!--        <slot></slot>-->
<!--        <button class="destroyButton" @click=${this.destroy}>X</button>-->
        <select @change=${this.onChangeType}>
          <option>???</option>
          ${componentOptions}
        </select>
        <div class="component">
        ${componentType === TypesEnum.xtextfield ?
          html`<div>xtextfield widget</div>`
        : ''}
        ${componentType === TypesEnum.cwTextField ?
          html`<cw-text-field label="cwTextField" />`
        : ''}
        </div>
    `;
  }
  getItemTemplate() {
    const template = this.shadowRoot.querySelector('.component').innerHTML;
    return template;
  }
}

customElements.define('form-item', FormItem);
