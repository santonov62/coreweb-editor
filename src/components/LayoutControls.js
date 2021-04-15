import {css, LitElement} from "lit-element";
import {html} from "lit-html";
import {state} from "../state";
import {webadminButtonStyles} from "./styles";

export class LayoutControls extends LitElement {

  static get styles() {
    return [css`
      .layoutControls {
        margin: 15px;
        position: sticky;
        top: 20px;
        z-index: 99999;
      }
    `, webadminButtonStyles];
  }

  undo() {
    state.form.layoutTemplate.undo();
  }

  deleteColumn() {
    state.form.layoutTemplate.deleteColumn();
  }

  deleteRow() {
    state.form.layoutTemplate.deleteRow();
  }

  addColumn() {
    state.form.layoutTemplate.addColumn();
  }

  addRow() {
    state.form.layoutTemplate.addRow();
  }

  render() {
    return html`
          <div class="layoutControls">
            <button @click="${this.addRow}">Add Row</button>
            <button @click="${this.deleteRow}">Delete Row</button>
            <button @click="${this.addColumn}">Add Column</button>
            <button @click="${this.deleteColumn}">Delete Column</button>
            <button @click="${this.undo}">Undo</button>
          </div>
    `;
  }
}

customElements.define('layout-controls', LayoutControls);
