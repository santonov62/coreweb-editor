import {MobxLitElement} from "@adobe/lit-mobx";
import {css, html} from "lit-element";
import {state} from '../state';
import {nothing} from "lit-html";
import {common} from "./styles";

export class AvailableFields extends MobxLitElement {

  onDragStart(e) {
    const data = {fieldId: e.currentTarget.field.id};
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    console.log(`Drag data: `, data);
  }

  render() {
    const fields = this.#getUnassignedFields();
    if (fields.length === 0)
      return nothing;

    return html`
      <div class="availableFields">
        <span class="header1">Detached fields</span>
        <div style="padding: 5px">
        ${fields.map((field, index) => html`
          <form-field-short .field=${field} draggable=true @dragstart="${this.onDragStart}"></form-field-short>
        `)}
        </div>
      </div>
    `;
  }

  #getUnassignedFields() {
    const {templateAreas, fieldLayoutDefinitions} = state.form.layoutTemplate;
    const areas = [...new Set(templateAreas.flat())];
    const fieldIdsWithLayout = [...fieldLayoutDefinitions.entries()]
      .reduce((acc, [area, {field}]) => {
        if (field?.id && areas.includes(area)) {
          acc.push(field.id);
        }
        return acc;
      }, []);

    return state.form.fields.filter(({id}) => {
      return !fieldIdsWithLayout.includes(id);
    });
  }

  static get styles() {
    return [css`
      :host {
        // margin: 0 10px 0 10px;
        align-self: stretch;
      }
      .header1 {
        margin-left: 10px;
      }
      .availableFields {
        position: sticky;
        bottom: 0;
        z-index: 2;
        // background-color: #eaf3f6;
        // padding-top: 10px;
        opacity: 0.9;
        // -webkit-box-shadow: 0px -5px 5px -5px rgba(34, 60, 80, 0.6);
        // -moz-box-shadow: 0px -5px 5px -5px rgba(34, 60, 80, 0.6);
        // box-shadow: 0px -5px 5px -5px rgba(34, 60, 80, 0.6);
      }
      .availableFields > div {
        display: flex;
        flex-wrap: wrap;
      }
      form-field-short {
        cursor: move;
      }
      form-field-short:hover {
        background-color: #e9f4fe;
      }
    `, common];
  }
}

customElements.define('available-fields', AvailableFields);
