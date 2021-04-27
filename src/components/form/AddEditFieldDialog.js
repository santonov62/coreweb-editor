import {css, LitElement} from "lit-element";
import {html, nothing} from "lit-html";
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {state} from "../../state";
import {AccessEnum} from "./EditField";

class AddEditFieldDialog extends LitElement {

  static get properties() {
    return {
      layoutDefinition: {type: Object},
      field: {type: Object},
      options: {type: Object, attribute: false},
      // onCloseCallback: {type: Function},
    }
  }

  constructor() {
    super();
    this.options = {};
    // this.updateComplete.then(() => {
    //   this.dialog.showModal();
    // });
  }

  render() {
    const {fieldName = '', placeholder = '', label = '', description = '', dataType = '', access = ''} = this.options;
    return html`
      <cw-dialog id="dialog" title="Add/Edit Field" @change="${this.onChange}" @close="${this.onDialogClose}">
        <slot>
          <div style="display: grid; grid-template-columns: 100px 1fr; gap: 10px;">
          <label for="field">dataType: </label>
          <select name="dataType" @change=${this.onFieldSelect}>
            <option>???</option>
            ${Object.values(FieldDataTypeEnum).map(value => html`
            <option value="${value}" ?selected="${dataType === value}">${value}</option>`)}
          </select>

          ${dataType ? html`
            <label for="fieldName">fieldName: </label>
            <input name="fieldName" value=${fieldName} required/>

            <label for="placeholder">placeholder: </label>
            <input name="placeholder" value=${placeholder} />

            <label for="label">label: </label>
            <input name="label" value=${label} />

            <label for="description">description: </label>
            <input name="description" value=${description} />

            ${access ? html`
              <label for="access">access: </label>
              <select id="access">
                ${Object.values(AccessEnum).map(value => html`
                <option value="${value}" ?selected=${access === value}>${value}</option>`)}
              </select>
            ` : ''}

          ` : ``}
          </div>
        </slot>
      </cw-dialog>
    `;
  }

  set layoutDefinition(layout) {
    const oldVal = this._layoutDefinition;
    const field = layout.field || {};
    this.options = {
      access: layout.access,
      ...field,
    }
    this._layoutDefinition = layout;
    this.requestUpdate('layoutDefinition', oldVal)
  }

  get layoutDefinition() {
    return this._layoutDefinition;
  }

  onChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.options = {
      ...this.options,
      [name]: value
    };
  }

  onDialogClose() {
    if (!this.dialog.dialog.returnValue)
      return;

    let field = this.layoutDefinition.field;
    if (!field) {
      field = state.form.newField();
      this.layoutDefinition.update({field});
    }
    field.update({...this.options});
    this.layoutDefinition.update({access: this.options.access});
  }

  get dialog() {
    return this.shadowRoot.getElementById('dialog');
  }

  showModal() {
    this.dialog.showModal();
  }
}

customElements.define('edit-field-dialog', AddEditFieldDialog);
