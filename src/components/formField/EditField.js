import {html} from "lit-html";
import {MobxLitElement} from "@adobe/lit-mobx";
import {state} from "../../state";
import FieldDataTypeEnum from "../../FieldDataTypeEnum";

export class EditField extends MobxLitElement {

  static get properties() {
    return {
      id: {type: Number}
    }
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

  render() {
    const {fieldName, label, dataType, placeholder, id, layoutDefinition} = this.field;
    const {access} = layoutDefinition;
    return html`
      <div class="edit-field">

        <label for="fieldName">dataType: </label>
        <select @change=${(e) => this.field.update({dataType: e.target.value})}>
          <option>???</option>
          ${Object.values(FieldDataTypeEnum).map(value => html`
            <option value="${value}" ?selected=${dataType === value}>${value}</option>`)}
        </select>

        <label for="fieldName">fieldName: </label>
        <input id="fieldName" value=${fieldName} @change=${(e) => this.field.update({fieldName: e.target.value})}/>

        <label for="placeholder">placeholder: </label>
        <input id="placeholder" value=${placeholder}
               @change=${(e) => this.field.update({placeholder: e.target.value})}/>

        <br />
        <label for="label">label: </label>
        <input id="label" value=${label} @change=${(e) => this.field.update({label: e.target.value})}/>

        <label for="access">access: </label>
        <select id="access" @change=${(e) => layoutDefinition.update({access: e.target.value})}>
          ${Object.values(AccessEnum).map(value => html`
            <option value="${value}" ?selected=${access === value}>${value}</option>`)}
        </select>
      </div>`;
  }

}

export const AccessEnum = {
  optional: 'optional',
  readonly: 'readonly',
  hidden: 'hidden',
  required: 'required',
}

customElements.define('edit-field', EditField);
