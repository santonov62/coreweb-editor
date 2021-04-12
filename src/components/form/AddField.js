import {html, nothing} from "lit-html";
import {MobxLitElement} from "@adobe/lit-mobx";
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {state} from "../../state";
import {Field} from "../../state/Field";

export class AddField extends MobxLitElement {

  // field
  // layoutDefinition

  static get properties() {
    return {
      id: {type: Number},
      field: {attribute: false},
      layoutDefinition: {attribute: false},
      isNewField: {type: Boolean},
    }
  }

  constructor() {
    super();
  }

  onFieldSelect(e) {
    const fieldId = parseInt(e.target.value);
    const field = fieldId === -1 ? state.form.addField({}) : state.form.fields.find(({id}) => id === fieldId);
    this.layoutDefinition.update({
      field,
    });
  }

  render() {
    const {layoutDefinition} = this;
    const {field} = layoutDefinition;
    console.log('AddField render', layoutDefinition);
    return html`
      <div class="add-field">
        <label for="field">Field: </label>
        <select @change=${this.onFieldSelect}>
          <option></option>
          <option value="-1">+new</option>
          ${state.form.fields.map(({fieldName, id}) => html`
            <option value="${id}" ?selected="${id === field?.id}">${fieldName}</option>
          `)}
        </select>

      </div>`;
  }

}

customElements.define('add-field', AddField);
