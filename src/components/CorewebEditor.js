import { LitElement, css } from 'lit-element';
import {html, nothing} from 'lit-html';
import {MobxLitElement} from "@adobe/lit-mobx";
import {state} from '../state';
import {buttonStyles, common, webadminButtonStyles} from './styles';
import FieldDataTypeEnum from "../FieldDataTypeEnum";
import {reaction} from "mobx";
import {FieldLayoutDefinition} from "../state/FieldLayoutDefinition";

export class CorewebEditor extends MobxLitElement {

  static get properties() {
    return {
      hoverCell: {type: String, attribute: false, reflect: false}
    };
  }

  constructor() {
    super();
    this.templateAreas = state.form.layoutTemplate.templateAreas;
    state.loadAllForms();
  }

  #getColumnsTemplateStr() {
    const {templateAreas} = state.form.layoutTemplate;
    return templateAreas[0].reduce((res) => res + ' 1fr', 'grid-template-columns: ');
  }

  #getRowTemplateStr() {
    const {templateAreas} = state.form.layoutTemplate;
    return templateAreas.reduce((res, row) => `${res}'${row.join(' ')}'`, 'grid-template-areas:');
  }

  #getCellTemlates() {
    const {templateAreas} = state.form.layoutTemplate;
    const {fields, fieldLayoutDefinitions} = state.form;
    return [...new Set(templateAreas.flat())].map((cell,i)=>{
      const layoutDefinition = fieldLayoutDefinitions.get(cell) || state.form.newFieldLayoutDefinition(cell);

      return html`<layout-definition-field
                        .layoutDefinition=${layoutDefinition}
                        .onAddFieldCallback="${this.onAddField.bind(this)}"
                        class="item"
                        tabindex="0"
                        data-area="${cell}"
                        style="grid-area: ${cell}">${i+1}>
        </layout-definition-field>`
    })
  }

  #getDialogTemplate() {
    return html`
      <cw-dialog id="dialog" title="Add/Edit Field" @close="${this.onDialogClose}">
        <slot>
          <label for="dataType">Field: </label>
          <select id="dataType" name="dataType" @change=${this.onFieldSelect}>
            <option>???</option>
            ${Object.values(FieldDataTypeEnum).map(value => html`
            <option value="${value}">${value}</option>`)}
          </select>
        </slot>
      </cw-dialog>`
  }

  render() {
    const {formsList, form} = state;
    const {selectedLayout} = form;
    const isLoading = state.isLoading || form.isLoading;
    return html`

      ${isLoading ? html`<form-loader><slot>Loading...</slot></form-loader>` : ''}

      ${selectedLayout && selectedLayout.field ? html`
        <div class="editField">
          <div class="close" @click="${() => state.form.setSelectedLayoutDefinition(null)}">X</div>
          <span class="header1">Edit field</span>
          <edit-field .layoutDefinition="${selectedLayout}" .field="${selectedLayout.field}"></edit-field>
        </div>` : nothing}

      <div class="form-name-container">
        <label for="formName">Form name: </label>
        <select @change=${this.onFormSelect}>
          <option value="">New form --></option>
          ${formsList.map(({id, name}) => html`<option value=${id}>${name}</option>`)}
        </select>
        <input id="formName" value="" type="text" @change=${this.onFromNameChange} ?hidden=${!!form.databean} />
        <button @click="${this.saveForm}">Save</button>
      </div>

      ${state.form.layoutTemplate.isErrorParseAreas ? html`
        <form-message title="Warning" type="warning">
          <slot>
            Current form template doesn't support edit in visual editor. Now template generated by default and will be rewrited after save.
          </slot>
        </form-message>` : nothing}

      <div class="container">
        <layout-controls></layout-controls>
        <div class="layoutContainer" style="${this.#getColumnsTemplateStr()}; ${this.#getRowTemplateStr()}">
          ${this.#getCellTemlates()}
        </div>
        <available-fields></available-fields>
      </div>

      ${this.#getDialogTemplate()}
    `;
  }

  onAddField(area) {
    let dialog = this.shadowRoot.getElementById('dialog');
    dialog.area = area;
    dialog.showModal();
  }

  onDialogClose(e) {
    const dialog = e.target;
    const {area} = dialog;
    const dataType = dialog.returnValue;
    if (dataType) {
      const field = state.form.newField({dataType});
      state.form.fieldLayoutDefinitions.get(area).update({
        field,
      });
    }
  }

  saveForm() {
    state.form.save();
  }

  onFromNameChange(e) {
    const name = e.target.value;
    state.form.setName(name);
  }

  onFormSelect(e) {
    const formId = e.target.value;
    formId ? state.setActiveForm(formId) : state.resetForm();
  }

  static get styles() {
    return [css`
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        color: #1a2b42;
        margin: 0px 30px 0px 0px;
      }
      .container {
        width: 100%;
      }
      .form-name-container {
        align-self: flex-start;
        margin-top: 10px;
      }
      .layoutContainer {
        display: grid;
        gap: 2px;
        margin-bottom: 40px;
        align-self: stretch;
        background-color: #fff;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
      }
      .editField{
        position: fixed;
        left: 0;
        background-color: #fff;
        padding: 50px 15px;
        box-shadow: 0px 5px 32px 2px rgba(34, 60, 80, 0.4);
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border: solid 1px rgb(185 190 194);
        margin-left: -1px;
        z-index: 3;
      }
      .editField .close {
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
      }
    `, webadminButtonStyles, common];
  }
}

customElements.define('coreweb-editor', CorewebEditor);
