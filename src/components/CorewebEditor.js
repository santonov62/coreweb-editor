import { LitElement, css } from 'lit-element';
import {html} from 'lit-html';
import {MobxLitElement} from "@adobe/lit-mobx";
import {state} from '../state';
import FieldDataTypeEnum from "../FieldDataTypeEnum";
import { styleMap } from 'lit-html/directives/style-map';
import {autorun, reaction} from "mobx";

export class CorewebEditor extends MobxLitElement {

  static get properties() {
    return {
      gridMatrix: {type: String},
    };
  }

  static containerStyles = css`.container {
        display: grid;
        gap: 10px;
      }
  `;

  #templateChanges = [];

  static get styles() {
    return [css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        color: #1a2b42;
        max-width: 960px;
        margin: 0px 30px 0px 0px;
      }
      .form-name-container {
        align-self: flex-start;
        margin-top: 10px;
      }
      .isLoading {
        margin: 10px;
        text-align: center;
        width: 100%;
      }
      .container {
      padding: 20px;
        align-self: stretch
      }
      .container div:hover {
        background: cornflowerblue;
      }
      .container div.selected {
        background: blueviolet;
      }
    `, this.containerStyles];
  }

  constructor() {
    super();
    const editor = this;
    this.templateAreas = [["x1x1"]];
    this.gridMatrix = `'. . . .'`;
    reaction(
      () => state.form.layoutTemplate.content,
      content => {
        editor.gridMatrix = editor.#parseGridMatrix(content);
      }
    )

    state.loadAllForms();
  }

  #parseGridMatrix(content) {
      const template = document.createElement('template');
      template.innerHTML = content.toString();
      const container = template.content.querySelector('[data-container-id]');
      console.log(`layoutTemplate container`, container);
      return container.style.gridTemplateAreas
        .replaceAll('" ', '\'\n')
        .replaceAll('"', '\'');
  }

  #getColumnsTemplateStr() {
    return this.templateAreas[0].reduce((res) => res + ' 1fr', 'grid-template-columns: ');
  }

  #getRowTemplateStr() {
    return this.templateAreas.reduce((res, row) => `${res}"${row.join(' ')}"`, 'grid-template-areas:');
  }

  addColumn() {
    this.saveState();
    const cols = this.templateAreas[0].length+1;
    this.templateAreas.forEach((ta, i)=>{
      ta.push(`x${i+1}x${cols}`)
    })
    this.update();
  }

  deleteColumn() {
    const cols = this.templateAreas[0].length;
    if (cols > 1) {
      this.saveState();
      this.templateAreas.forEach((ta, i) => {
        ta.pop();
      })
      this.update();
    }
  }

  // #getCellTemlates() {
  //   return [...new Set(this.templateAreas.flat())].map((cell,i)=>{
  //       return html`<form-field draggable="true"
  //                             ondrag="this.classList.add('selected')"
  //                             ondragend="this.classList.remove('selected')"
  //                             ondragover="event.preventDefault(); event.dataTransfer.dropEffect = 'move'"
  //                             @drop="${this.toggleSelected}"
  //                             class="item"
  //                             data-fieldname="name${i}"
  //                             tabindex="0"
  //                             style="grid-area: ${cell}">${i+1}
  //       </form-field>`
  //   })
  // }
  //
  // addRow() {
  //   this.saveState();
  //   const rows = this.templateAreas.length+1;
  //   let row = [];
  //   this.templateAreas[0].forEach((ta, i) => {
  //     row[i] = `x${rows}x${i+1}`;
  //   })
  //   this.templateAreas.push(row);
  //   this.update();
  // }

  addField() {
    state.form.addField({});
  }

  deleteRow() {
    if (this.templateAreas.length > 1) {
      this.saveState();
      this.templateAreas.pop();
      this.update();
    }
  }

  saveState(state = JSON.parse(JSON.stringify(this.templateAreas))) {
    this.#templateChanges.push(state);
  }

  undo() {
    if (this.#templateChanges.length > 0) {
      this.templateAreas = this.#templateChanges.pop();
      this.update();
    }
  }

  getHTMLTemplate() {
    return CorewebEditor.containerStyles + '\n' + this.shadowRoot.querySelector('.container').outerHTML;
  }


  getSelection() {
    return this.shadowRoot.querySelector('.container .selected');
  }

  // toggleSelected(evt) {
  //   const selection = this.getSelection();
  //   if (!selection && selection !== evt.target) {
  //     evt.target.classList.toggle('selected');
  //   } else {
  //     this.saveState();
  //     let [,row1,col1] = window.getComputedStyle(selection).gridRowStart.split('x');
  //     let [,row2,col2] = window.getComputedStyle(evt.target).gridRowStart.split('x');
  //     let rows = [];
  //     let cols = [];
  //     this.templateAreas.forEach((row,i)=>{
  //       row.forEach((cell,j)=> {
  //         let [, r, c] = cell.split('x');
  //         if ((row1 == r && col1 == c) || (row2 == r && col2 == c)) {
  //           rows.push(i+1);
  //           cols.push(j+1);
  //         }
  //       })
  //     })
  //     let points = {rowMin: Math.min(...rows), rowMax: Math.max(...rows), colMin: Math.min(...cols), colMax: Math.max(...cols)};
  //
  //     const len = points.colMax-points.colMin+1;
  //     let fillArray = new Array(len).fill(`x${row1}x${col1}`);
  //     for (let i=0; i<=points.rowMax-points.rowMin; i++)
  //       this.templateAreas[points.rowMin-1+i].splice(points.colMin-1, len, ...fillArray);
  //     this.getSelection().classList.remove('selected');
  //     this.update();
  //     console.log('----------', this.templateAreas);
  //   }
  //
  //
  // }

  #getGridStyles() {
    // return {
    //   gridTemplateRows: 'auto',
    //   gridTemplateColumns: '1fr 1fr 1fr 1fr',
    //   gridTemplateAreas: this.gridMatrix.split('\n').map(line => `"${line}"`).join(" "),
    //   display: 'grid',
    //   gap: '10px',
    // }
    // let style = ``;
    // style += `display: grid;`;
    // style += `gap: 10px;`;
    // style += `grid-template-rows: auto;`;
    // style += `grid-template-columns: 1fr 1fr 1fr 1fr;`;
    // style += `grid-template-areas: ${this.gridMatrix};`;
    // return style;
    return `display: grid;
    gap: 10px;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: ${this.gridMatrix};`
  }

  render() {
    const {isLoading, formsList, form} = state;
    const {fields, fieldLayoutDefinitions} = form;
    console.log('CorewebEditor render -> fields', fields);
    console.log('CorewebEditor render -> fieldLayoutDefinitions', fieldLayoutDefinitions);
    return html`
          <div style="margin: 15px">
            <button @click="${this.addField}">Add Row</button>
            <button @click="${this.deleteRow}">Delete Row</button>
            <button @click="${this.addColumn}">Add Column</button>
            <button @click="${this.deleteColumn}">Delete Column</button>
            <button @click="${this.undo}">Undo</button>
          </div>

          ${isLoading ? html`<div class="isLoading">Loading...</div>` : ''}

          <div id="gridMatrix">
            <label>grid-template-areas:</label><br />
            <textarea rows='6' cols="40" @change=${this.onGridMatrixChange}>${this.gridMatrix}</textarea>
          </div>

          <div class="form-name-container">
            <label for="formName">Form name: </label>
            <select @change=${this.onFormSelect}>
              <option value="">New form --></option>
              ${formsList.map(({id, name}) => html`<option value=${id}>${name}</option>`)}
            </select>
            <input id="formName" value="" type="text" @change=${this.onFromNameChange} ?hidden=${!!form.databean} />
            <button @click="${this.saveForm}">Save</button>
          </div>

          ${form.isLoading ? html`<div class="isLoading">Loading...</div>` : ''}
          <div class="container" style="${this.#getGridStyles()}">
            ${fieldLayoutDefinitions.map((layoutDefinition, index) => html`
              <form-field tabindex=${index}
                          .field=${layoutDefinition.field}
                          style=${`grid-area: ${layoutDefinition.field.fieldName};`}></form-field>`)}
          </div>

          <div style="width: 100%">
            Add field:
            <select id="addField" @change=${this.onAddField}>
              <option value="new">???</option>
              ${Object.values(FieldDataTypeEnum).map(value => html`
                <option value="${value}">${value}</option>`)}
            </select>
          </div>
          <br />
          <available-fields />
    `;
  }

  onGridMatrixChange(e) {
    this.gridMatrix = e.target.value;
  }

  onAddField(e) {
    const dataType = e.target.value;
    state.form.addField({dataType});
    this.shadowRoot.getElementById('addField').value = 'new';
  }

  saveForm() {
    const form = state.form;
    const content = this.makeTemplateContent();
    console.log('saveForm', content)
    form.setTemplateContent(content);
    form.save();
  }

  makeTemplateContent() {
    let content = `<div data-container-id="Fields" style="${this.#getGridStyles()}">`;
    state.form.fields.forEach(field => {
      content += `<div data-fieldname="${field.fieldName}" style="grid-area: ${field.fieldName}"></div>`;
    });
    content += `</div>`;
    return content;
  }

  get container() {
    return this.shadowRoot.querySelector('.container')
  }

  onFromNameChange(e) {
    const name = e.target.value;
    state.form.setName(name);
  }

  onFormSelect(e) {
    const formId = e.target.value;
    formId ? state.setActiveForm(formId) : state.resetForm();
  }
}

customElements.define('coreweb-editor', CorewebEditor);
