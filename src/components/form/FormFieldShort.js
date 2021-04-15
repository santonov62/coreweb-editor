import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {state} from '../../state';
import {MobxLitElement} from "@adobe/lit-mobx";
import {Field} from "../../state/Field";
import {nothing} from "lit-html";

export class FormFieldShort extends MobxLitElement {

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
        align-items: center;
        justify-content: flex-start;
        position: relative;
        background: #fff;
        padding: 5px;
        margin: 5px;
        border-radius: 5px;
        color: #2c789e;
        border: 1px solid rgb(117 169 191);
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

  render() {
    const {field, layoutDefinition} = this;
    if (!field)
      return nothing;

    const {fieldName, dataType, id} = field;

    return html`
      <div><b>${dataType}</b></div>
      <div>${fieldName}</div>
    `;
  }
}

customElements.define('form-field-short', FormFieldShort);
