import {html, nothing} from "lit-html";
import {MobxLitElement} from "@adobe/lit-mobx";
import FieldDataTypeEnum from "../../FieldDataTypeEnum";

export class EditField extends MobxLitElement {

  // field
  // layoutDefinition

  static get properties() {
    return {
      id: {type: Number},
      field: {attribute: false},
      layoutDefinition: {attribute: false}
    }
  }

  constructor() {
    super();
  }

  render() {
    const {layoutDefinition, field} = this;
    const {fieldName, label, dataType, placeholder, id} = field;
    // const {access} = layoutDefinition;
    console.log('EditField render', field);
    return html`
      <div class="edit-field">
        <label for="fieldName">dataType: </label>
        <select @change=${(e) => field.update({dataType: e.target.value})}>
          <option>???</option>
          ${Object.values(FieldDataTypeEnum).map(value => html`
            <option value="${value}" ?selected=${dataType === value}>${value}</option>`)}
        </select>
        <br />
        <label for="fieldName">fieldName: </label>
        <input id="fieldName" value=${fieldName} @change=${(e) => field.update({fieldName: e.target.value})}/>
        <br />

        <label for="placeholder">placeholder: </label>
        <input id="placeholder" value=${placeholder}
               @change=${(e) => field.update({placeholder: e.target.value})}/>

        <br />
        <label for="label">label: </label>
        <input id="label" value=${label} @change=${(e) => field.update({label: e.target.value})}/>

        ${layoutDefinition ? html`
          <br />
          <label for="access">access: </label>
          <select id="access" @change=${(e) => layoutDefinition.update({access: e.target.value})}>
            ${Object.values(AccessEnum).map(value => html`
            <option value="${value}" ?selected=${layoutDefinition.access === value}>${value}</option>`)}
          </select>
        ` : ''}
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
