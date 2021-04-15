import {MobxLitElement} from "@adobe/lit-mobx";
import {css, html} from "lit-element";
import {state} from '../state';
import {nothing} from "lit-html";
import {common} from "./styles";

export class AvailableFields extends MobxLitElement {

  static get styles() {
    return [css`
      :host {
        margin: 0 10px 0 10px;
        align-self: stretch;
      }
      .availableFields > div {
        display: flex;
      }
      form-field {
        margin: 5px;
        max-width: 200px;
      }
    `, common];
  }

  render() {
    const layoutDefinitions = state.form.fieldLayoutDefinitions;
    const {templateAreas} = state.form.layoutTemplate;
    const areas = [...new Set(templateAreas.flat())];
    const fieldIdsWithLayout = [...layoutDefinitions.entries()]
      .reduce((acc, [area, {field}]) => {
        if (field?.id && areas.includes(area)) {
          acc.push(field.id);
        }
        return acc;
      }, []);

    const fields = state.form.fields.filter(({id}) => {
      return !fieldIdsWithLayout.includes(id);
    });
    if (fields.length === 0)
      return nothing;

    return html`
      <div class="availableFields">
        <span class="header1">Unassigned fields</span>
        <div>
        ${fields.map((field, index) => html`
          <form-field .field=${field}></form-field>
        `)}
        </div>
      </div>
    `;
  }
}

customElements.define('available-fields', AvailableFields);
