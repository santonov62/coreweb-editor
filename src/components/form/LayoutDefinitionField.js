import {css, html} from "lit-element";
import {MobxLitElement} from "@adobe/lit-mobx";
import {FieldLayoutDefinition} from "../../state/FieldLayoutDefinition";
import {state} from '../../state';
import {Field} from "../../state/Field";
import {nothing} from "lit-html";

export class LayoutDefinitionField extends MobxLitElement {

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
      }`]
  }

  static get properties() {
    return {
      layoutDefinition: {type: Object},
    }
  }

  constructor() {
    super();
  }

  // disconnectedCallback() {
  //   super.disconnectedCallback();
  //   const {area} = this.dataset;
  //   state.form.deleteFieldLayoutDefinition(area);
  // }

  render() {
    const {layoutDefinition} = this;
    const {order, field} = layoutDefinition;
    return html`
      <div class="fieldLayout">
        <form-field tabindex=${order} .field=${field} .layoutDefinition=${layoutDefinition}></form-field>
      </div>
    `;
  }
}

customElements.define('layout-definition-field', LayoutDefinitionField);
