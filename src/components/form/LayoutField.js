import {html} from "lit-element";
import {MobxLitElement} from "@adobe/lit-mobx";

export class LayoutField extends MobxLitElement {

  layoutDefinition
  order

  constructor() {
    super();
  }

  detach(e) {
    const {layoutDefinition} = this;
    const {field} = layoutDefinition;
    layoutDefinition.field = null;
    field.layoutDefinition = null;
  }

  render() {
    const {layoutDefinition} = this;
    const {order, field} = layoutDefinition;
    return html`
      <div class="fieldLayout">
        <button @click=${this.detach}>detach</button>
        <form-field tabindex=${order} .field=${field}></form-field>
      </div>
    `;
  }
}

customElements.define('layout-field', LayoutField);
