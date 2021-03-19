import {MobxLitElement} from "@adobe/lit-mobx";
import {html} from "lit-element";
import {state} from '../state';

export class AvailableFields extends MobxLitElement {
  render() {
    const fields = state.form.fields.filter(({layoutDefinition}) => !layoutDefinition);
    return html`
      <div class="availableFields">
        Available fields:
        ${fields.map((field, index) => html`
          <form-field .field=${field}></form-field>
        `)}
      </div>
    `;
  }
}

customElements.define('available-fields', AvailableFields);
