import { LitElement, html, css } from 'lit-element';

export class RowItem extends LitElement {

  static get properties() {
    return {
      count: { type: Number }
    }
  }

  render() {
    return html`
        <slot></slot>
    `;
  }
}

customElements.define('row-item', RowItem);
