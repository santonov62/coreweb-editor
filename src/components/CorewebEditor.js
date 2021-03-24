import { LitElement, css } from 'lit-element';
import {html} from 'lit-html';
import {MobxLitElement} from "@adobe/lit-mobx";
import {state} from '../state';
import { buttonStyles } from './styles';
import FieldDataTypeEnum from "../FieldDataTypeEnum";

export class CorewebEditor extends MobxLitElement {

  static get properties() {
    return {
      hoverCell: {type: String, attribute: false, reflect: false}
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
        height: 80vh;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        color: #1a2b42;
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
        align-self: stretch;
        height: 100%;
      }
      .container form-field {
        background: #3273dc;
        color: white;
        padding: 20px;
        border-radius: 5px;
      }
      .container form-field:hover {
        background: cornflowerblue;
      }
      .container form-field.selected {
        background: blueviolet;
      }
      .cellEditor {
        background-color: rgba(15,15,15,0.25);
        z-index: 999;
        align-items: center;
        justify-content: center;
        display: flex;
        position:relative;
      }
      .arrow {
        position: absolute;
        color: #4CAF50;
        cursor:pointer;
        font-size: xx-large;
      }
      .arrow:hover{
        color: #3e8e41
      }
      .top {
        top:0
      }
      .bottom {
        bottom:0
      }
      .right {
        right:0
      }
      .left {
        left:0
      }
    `, buttonStyles, this.containerStyles];
  }

  constructor() {
    super();
    this.templateAreas = [["x1x1"]];
    state.loadAllForms();
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

  #getCellTemlates() {
    const fields = state.form.fields;
    return [...new Set(this.templateAreas.flat())].map((cell,i)=>{
        return html`<form-field draggable="true" .field="${fields[cell]}"
                              ondrag="this.classList.add('selected')"
                              ondragend="this.classList.remove('selected')"
                              ondragover="event.preventDefault(); event.dataTransfer.dropEffect = 'move'"
                              @drop="${this.prepareJoinCell}"
                              class="item"
                              data-fieldname="name${i}"
                              tabindex="0"
                              data-area="${cell}"
                              style="grid-area: ${cell}">${i+1}>
        </form-field>`
    })
  }

  #getHoverCellTemplate() {
    return html`${this.hoverCell ? html`
            <div style="grid-area: ${this.hoverCell.area};" class="cellEditor" draggable="true">
              ${this.hoverCell?.dataType ? html`
                <button style="margin-right: 8px;" @click="${this.onAddField}">Edit</button>
                <button @click="${this.onDeleteField}">Delete</button>`:
                html`<button @click="${this.onAddField}">Add</button>`
              }
              ${this.hoverCell.isMultiCell ? html`<button style="margin-left: 8px;"
                   @click="${this.splitCell}">Split</button>`:''}
              <div class="arrow top" ?hidden=${this.hoverCell.direction.top === 0}
                   @click="${()=>this.prepareJoinCell('up')}">🡁</div>
              <div class="arrow bottom" ?hidden=${this.hoverCell.direction.down === this.templateAreas.length-1}
                   @click="${()=>this.prepareJoinCell('down')}">🡃</div>
              <div class="arrow left" ?hidden=${this.hoverCell.direction.left === 0}
                   @click="${()=>this.prepareJoinCell('left')}">🡀</div>
              <div class="arrow right" ?hidden=${this.hoverCell.direction.right === this.templateAreas[0].length-1}
                   @click="${()=>this.prepareJoinCell('right')}">🡂</div>
            </div>`:''}`
  }

  #getDialogTemplate() {
    return html`
        <cw-dialog id="dialog" title="Add Field" @close="${this.onDialogClose}">
            <div slot="body">
              <input id="fieldValue" name="fieldValue" list="fieldOptions"/>
              <datalist id="fieldOptions">
                ${Object.values(FieldDataTypeEnum).map(value => html`
                <option value="${value}">${value}</option>`)}
              </datalist>
            </div>
        </cw-dialog>`
  }

  onMouseOver(evt) {
    let node = evt.path[0];
    if (node?.classList.contains('cellEditor') || evt.path[1]?.classList?.contains('cellEditor'))
      return;
    if (node.nodeName === 'FORM-FIELD') {
      this.hoverCell = {area:node.dataset['area'], direction:{}};
      let flatAreas = this.templateAreas.flat();
      let startIndex = flatAreas.indexOf(this.hoverCell.area);
      let lastIndex = flatAreas.lastIndexOf(this.hoverCell.area);
      this.hoverCell.direction.left = startIndex%this.templateAreas[0].length;
      this.hoverCell.direction.right = lastIndex%this.templateAreas[0].length;
      this.hoverCell.direction.top = (startIndex/this.templateAreas[0].length)>>0;
      this.hoverCell.direction.down = (lastIndex/this.templateAreas[0].length)>>0;
      this.hoverCell.dataType = node.field?.dataType;
      this.hoverCell.isMultiCell = startIndex !== lastIndex;
    } else
       this.hoverCell = null;
  }

  addRow() {
    this.saveState();
    const rows = this.templateAreas.length+1;
    let row = [];
    this.templateAreas[0].forEach((ta, i) => {
      row[i] = `x${rows}x${i+1}`;
    })
    this.templateAreas.push(row);
    this.update();
  }

  // addField() {
  //   state.form.addField({});
  // }

  deleteRow() {
    if (this.templateAreas.length > 1) {
      this.saveState();
      this.templateAreas.pop();
      this.update();
    }
  }

  saveState(state = JSON.parse(JSON.stringify(this.templateAreas))) {
    if (this.#templateChanges.length > 20)
      this.#templateChanges.shift();
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

  /**
   * deprecated
   * @returns {Element}
   */
  getSelection() {
    return this.shadowRoot.querySelector('.container .selected');
  }

  /**
   * Prepare for join source and destination cell as rectangle
   * @param direction can be ['up','down','left','right'] or drop event
   */
  prepareJoinCell(direction) {
    if (this.hoverCell) {
      let left = this.hoverCell.direction.left;
      let top = this.hoverCell.direction.top;
      let down = this.hoverCell.direction.down;
      let right = this.hoverCell.direction.right;
      let destArea;
      switch (direction) {
        case 'up':
          destArea = this.templateAreas[top-1][left];
          break;
        case 'down':
          destArea = this.templateAreas[down+1][right];
          break;
        case 'left':
          destArea = this.templateAreas[top][left-1];
          break;
        case 'right':
          destArea = this.templateAreas[down][right+1];
          break;
        default:
          if (direction instanceof Event)
            destArea = window.getComputedStyle(direction.target).gridRowStart;
      }
      this.joinCell(this.hoverCell.area, destArea);
    }
  }

  joinCell(cell1, cell2) {
    this.saveState();
    let [,row1,col1] = cell1.split('x');
    let [,row2,col2] = cell2.split('x');
    let rows = [];
    let cols = [];
    this.templateAreas.forEach((row,i)=>{
      row.forEach((cell,j)=> {
        let [, r, c] = cell.split('x');
        if ((row1 == r && col1 == c) || (row2 == r && col2 == c)) {
          rows.push(i+1);
          cols.push(j+1);
        }
      })
    })
    let points = {rowMin: Math.min(...rows), rowMax: Math.max(...rows), colMin: Math.min(...cols), colMax: Math.max(...cols)};
    const len = points.colMax-points.colMin+1;
    let fillArray = new Array(len).fill(`x${row1}x${col1}`);
    for (let i=0; i<=points.rowMax-points.rowMin; i++)
      this.templateAreas[points.rowMin-1+i].splice(points.colMin-1, len, ...fillArray);
    //this.getSelection().classList.remove('selected');
    this.hoverCell = null;
    this.update(this.templateAreas);
  }

  splitCell() {
    this.saveState();
    let area = this.hoverCell.area;
    this.templateAreas.forEach((row,i)=>{
      row.forEach((cell,j)=> {
        if (cell === area) {
          this.templateAreas[i][j] = `x${i+1}x${j}`;
        }
      })
    })
    this.hoverCell = null;
    this.update(this.templateAreas);
  }

  /**
   * deprecated
   * @param evt
   */
  toggleSelected(evt) {
    const selection = this.getSelection();
    if (!selection && selection !== evt.target) {
      evt.target.classList.toggle('selected');
    } else {
      this.joinCell(window.getComputedStyle(selection).gridRowStart, window.getComputedStyle(evt.target).gridRowStart);
    }
  }

  render() {
    const {isLoading, formsList, form} = state;
    return html`
          <div style="margin: 15px">
            <button @click="${this.addRow}">Add Row</button>
            <button @click="${this.deleteRow}">Delete Row</button>
            <button @click="${this.addColumn}">Add Column</button>
            <button @click="${this.deleteColumn}">Delete Column</button>
            <button @click="${this.undo}">Undo</button>
          </div>

          ${isLoading ? html`<div class="isLoading">Loading...</div>` : ''}

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
          <div class="container" @mouseover="${this.onMouseOver}" style="${this.#getColumnsTemplateStr()}; ${this.#getRowTemplateStr()}">
            ${this.#getCellTemlates()}
            ${this.#getHoverCellTemplate()}
          </div>

          ${this.#getDialogTemplate()}
    `;
  }

  onAddField(e) {
    let dialog = this.shadowRoot.getElementById('dialog');
    dialog.area = this.hoverCell.area;
    dialog.showModal();
  }

  onDeleteField() {
    let area = this.hoverCell.area;
    state.form.removeField(area);
    this.updateCellByArea(area);
  }

  onDialogClose(e) {
    const dialog = e.target;
    const dataType = dialog.returnValue;
    state.form.addField({dataType}, dialog.area);
    this.updateCellByArea(dialog.area);
  }

  updateCellByArea(area) {
    let formField = this.shadowRoot.querySelector(`form-field[data-area="${area}"]`);
    formField.field = state.form.fields[area];
    this.hoverCell = null;
  }

  saveForm() {
    const form = state.form;
    const content = this.makeTemplateContent();
    console.log('saveForm', content)
    form.setTemplateContent(content);
    form.save();
  }

  makeTemplateContent() {
    let content = `<div data-container-id="Fields">`;
    state.form.fields.forEach(field => {
      content += `<div data-fieldname="${field.fieldName}"></div>`;
    });
    content += `</div>`;
    content += `<style>${CorewebEditor.containerStyles}</style>`;
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
