import { LitElement, css } from 'lit-element';
import {html, nothing} from 'lit-html';
import {MobxLitElement} from "@adobe/lit-mobx";
import {state} from '../state';
import {buttonStyles, webadminButtonStyles} from './styles';
import FieldDataTypeEnum from "../FieldDataTypeEnum";
import {reaction} from "mobx";
import {FieldLayoutDefinition} from "../state/FieldLayoutDefinition";

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
        height: 100%;
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
        margin-bottom: 40px;
        align-self: stretch;
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
    `, webadminButtonStyles, this.containerStyles];
  }

  constructor() {
    super();
    // const editor = this;
    this.templateAreas = state.form.layoutTemplate.templateAreas;
    // state.form.layoutTemplate.templateAreas = [["x1x1"]];
    // reaction(
    //   () => state.form.layoutTemplate.content,
    //   content => {
    //     if (content)
    //       editor.templateAreas = editor.#parseAreas(content);
    //   }
    // )
    state.loadAllForms();
  }

  // #parseAreas(content) {
  //   const template = document.createElement('template');
  //   template.innerHTML = content.toString();
  //   const container = template.content.querySelector('[data-container-id]');
  //   console.log(`layoutTemplate container`, container);
  //   return container.style.gridTemplateAreas
  //     .split('" "')
  //     .map(area => area.replaceAll('"', '').split(' '));
  // }

  #getColumnsTemplateStr() {
    const {templateAreas} = state.form.layoutTemplate;
    return templateAreas[0].reduce((res) => res + ' 1fr', 'grid-template-columns: ');
  }

  #getRowTemplateStr() {
    const {templateAreas} = state.form.layoutTemplate;
    return templateAreas.reduce((res, row) => `${res}'${row.join(' ')}'`, 'grid-template-areas:');
  }

  // addColumn() {
  //   state.form.layoutTemplate.addColumn();
  // }

  // addColumn() {
  //   this.saveState();
  //   const cols = state.form.layoutTemplate.templateAreas[0].length+1;
  //   state.form.layoutTemplate.templateAreas.forEach((ta, i)=>{
  //     ta.push(`x${i+1}x${cols}`)
  //   })
  //   this.update();
  // }

  // deleteColumn() {
  //   state.form.layoutTemplate.deleteColumn();
  // }

  // deleteColumn() {
  //   const cols = state.form.layoutTemplate.templateAreas[0].length;
  //   if (cols > 1) {
  //     this.saveState();
  //     state.form.layoutTemplate.templateAreas.forEach((ta, i) => {
  //       ta.pop();
  //     });
  //     this.#mergeLayoutsWithAreas();
  //     this.update();
  //   }
  // }

  // #getCellTemlates() {
  //   const fields = state.form.fields;
  //   return [...new Set(state.form.layoutTemplate.templateAreas.flat())].map((cell,i)=>{
  //       return html`<form-field draggable="true" .field="${fields[cell]}"
  //                             ondrag="this.classList.add('selected')"
  //                             ondragend="this.classList.remove('selected')"
  //                             ondragover="event.preventDefault(); event.dataTransfer.dropEffect = 'move'"
  //                             @drop="${this.prepareJoinCell}"
  //                             class="item"
  //                             data-fieldname="name${i}"
  //                             tabindex="0"
  //                             data-area="${cell}"
  //                             style="grid-area: ${cell}">${i+1}>
  //       </form-field>`
  //   })
  // }

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

  // #getHoverCellTemplate() {
  //   return html`${this.hoverCell ? html`
  //           <div style="grid-area: ${this.hoverCell.area};" class="cellEditor" draggable="true">
  //             ${this.hoverCell?.dataType ? html`
  //               <button style="margin-right: 8px;" @click="${this.onAddField}">Edit</button>
  //               <button @click="${this.onDeleteField}">Delete</button>`:
  //               html`<button @click="${this.onAddField}">Add</button>`
  //             }
  //             ${this.hoverCell.isMultiCell ? html`<button style="margin-left: 8px;"
  //                  @click="${this.splitCell}">Split</button>`:''}
  //             <div class="arrow top" ?hidden=${this.hoverCell.direction.top === 0}
  //                  @click="${()=>this.prepareJoinCell('up')}">🡁</div>
  //             <div class="arrow bottom" ?hidden=${this.hoverCell.direction.down === state.form.layoutTemplate.templateAreas.length-1}
  //                  @click="${()=>this.prepareJoinCell('down')}">🡃</div>
  //             <div class="arrow left" ?hidden=${this.hoverCell.direction.left === 0}
  //                  @click="${()=>this.prepareJoinCell('left')}">🡀</div>
  //             <div class="arrow right" ?hidden=${this.hoverCell.direction.right === state.form.layoutTemplate.templateAreas[0].length-1}
  //                  @click="${()=>this.prepareJoinCell('right')}">🡂</div>
  //           </div>`:''}`
  // }

  // #getDialogTemplate() {
  //   return html`
  //       <cw-dialog id="dialog" title="Add Field" @close="${this.onDialogClose}">
  //           <div slot="body">
  //             <input id="fieldValue" name="fieldValue" list="fieldOptions"/>
  //             <datalist id="fieldOptions">
  //               ${Object.values(FieldDataTypeEnum).map(value => html`
  //               <option value="${value}">${value}</option>`)}
  //             </datalist>
  //           </div>
  //       </cw-dialog>`
  // }

  #getDialogTemplate() {
    if (!state.form.selectedLayout)
      return nothing;
    const layoutDefinition = state.form.selectedLayout;
    const {field} = layoutDefinition;
    return html`
      <cw-dialog id="dialog" title="Add/Edit Field">
        <slot>
          <add-field .layoutDefinition="${layoutDefinition}"></add-field>
          ${field ?
            html`<edit-field .field="${field}" .layoutDefinition="${layoutDefinition}"></edit-field>` : nothing
          }
        </slot>
      </cw-dialog>`
  }

  onMouseOver(evt) {
    // let node = evt.path[0];
    // if (node?.classList.contains('cellEditor') || evt.path[1]?.classList?.contains('cellEditor'))
    //   return;
    // if (node.nodeName === 'LAYOUT-DEFINITION-FIELD') {
    //   const hoverCell = {area:node.dataset['area'], direction:{}};
    //   const {templateAreas} = state.form.layoutTemplate;
    //   let flatAreas = templateAreas.flat();
    //   let startIndex = flatAreas.indexOf(hoverCell.area);
    //   let lastIndex = flatAreas.lastIndexOf(hoverCell.area);
    //   hoverCell.direction.left = startIndex%templateAreas[0].length;
    //   hoverCell.direction.right = lastIndex%templateAreas[0].length;
    //   hoverCell.direction.top = (startIndex/templateAreas[0].length)>>0;
    //   hoverCell.direction.down = (lastIndex/templateAreas[0].length)>>0;
    //   hoverCell.dataType = node.layoutDefinition?.field?.dataType;
    //   hoverCell.layoutDefinition = node.layoutDefinition;
    //   hoverCell.isMultiCell = startIndex !== lastIndex;
    //   this.hoverCell = hoverCell;
    // } else
    //    this.hoverCell = null;
  }

  // addRow() {
  //   // this.saveState();
  //   // const {layoutTemplate} = state.form;
  //   state.form.layoutTemplate.addRow();
  //   // const rows = state.form.layoutTemplate.templateAreas.length+1;
  //   // let row = [];
  //   // state.form.layoutTemplate.templateAreas[0].forEach((ta, i) => {
  //   //   row[i] = `x${rows}x${i+1}`;
  //   // })
  //   // state.form.layoutTemplate.templateAreas.push(row);
  //   // this.update();
  // }

  // addField() {
  //   state.form.addField({});
  // }

  // deleteRow() {
  //   const {layoutTemplate} = state.form;
  //   state.form.layoutTemplate.deleteRow();
  // }

  // saveState(cmpState) {
  //   const {layoutTemplate} = state.form;
  //   cmpState = cmpState || JSON.parse(JSON.stringify(layoutTemplate.templateAreas));
  //   if (this.#templateChanges.length > 20)
  //     this.#templateChanges.shift();
  //   this.#templateChanges.push(cmpState);
  // }

  // undo() {
  //   if (this.#templateChanges.length > 0) {
  //     state.form.layoutTemplate.templateAreas = this.#templateChanges.pop();
  //     // this.update();
  //   }
  // }

  // undo() {
  //   state.form.layoutTemplate.undo();
  // }

  // getHTMLTemplate() {
  //   return CorewebEditor.containerStyles + '\n' + this.shadowRoot.querySelector('.container').outerHTML;
  // }

  // /**
  //  * deprecated
  //  * @returns {Element}
  //  */
  // getSelection() {
  //   return this.shadowRoot.querySelector('.container .selected');
  // }

  // /**
  //  * Prepare for join source and destination cell as rectangle
  //  * @param direction can be ['up','down','left','right'] or drop event
  //  */
  // prepareJoinCell(direction) {
  //   if (this.hoverCell) {
  //     let left = this.hoverCell.direction.left;
  //     let top = this.hoverCell.direction.top;
  //     let down = this.hoverCell.direction.down;
  //     let right = this.hoverCell.direction.right;
  //     let destArea;
  //     const templateAreas = state.form.layoutTemplate.templateAreas;
  //     switch (direction) {
  //       case 'up':
  //         destArea = templateAreas[top-1][left];
  //         break;
  //       case 'down':
  //         destArea = templateAreas[down+1][right];
  //         break;
  //       case 'left':
  //         destArea = templateAreas[top][left-1];
  //         break;
  //       case 'right':
  //         destArea = templateAreas[down][right+1];
  //         break;
  //       default:
  //         if (direction instanceof Event)
  //           destArea = window.getComputedStyle(direction.target).gridRowStart;
  //     }
  //     this.joinCell(this.hoverCell.area, destArea);
  //   }
  // }

  // joinCell(cell1, cell2) {
  //   state.form.layoutTemplate.joinCell(cell1, cell2);
  //   this.hoverCell = null;
  //   // this.update();
  // }

  // joinCell(cell1, cell2) {
  //   this.saveState();
  //   let [,row1,col1] = cell1.split('x');
  //   let [,row2,col2] = cell2.split('x');
  //   let rows = [];
  //   let cols = [];
  //   const {templateAreas} = state.form.layoutTemplate;
  //   templateAreas.forEach((row, i)=>{
  //     row.forEach((cell,j)=> {
  //       let [, r, c] = cell.split('x');
  //       if ((row1 == r && col1 == c) || (row2 == r && col2 == c)) {
  //         rows.push(i+1);
  //         cols.push(j+1);
  //       }
  //     })
  //   })
  //   let points = {rowMin: Math.min(...rows), rowMax: Math.max(...rows), colMin: Math.min(...cols), colMax: Math.max(...cols)};
  //   const len = points.colMax-points.colMin+1;
  //   let fillArray = new Array(len).fill(`x${row1}x${col1}`);
  //   for (let i=0; i<=points.rowMax-points.rowMin; i++)
  //     templateAreas[points.rowMin-1+i].splice(points.colMin-1, len, ...fillArray);
  //   //this.getSelection().classList.remove('selected');
  //   this.hoverCell = null;
  //   this.#mergeLayoutsWithAreas();
  //   this.update(templateAreas);
  // }

  // splitCell() {
  //   this.saveState();
  //   let area = this.hoverCell.area;
  //   state.form.layoutTemplate.templateAreas.forEach((row,i)=>{
  //     row.forEach((cell,j)=> {
  //       if (cell === area) {
  //         state.form.layoutTemplate.templateAreas[i][j] = `x${i+1}x${j+1}`;
  //       }
  //     })
  //   })
  //   this.hoverCell = null;
  //   this.update(state.form.layoutTemplate.templateAreas);
  // }

  // splitCell() {
  //   let area = this.hoverCell.area;
  //   state.form.layoutTemplate.splitCell(area);
  //   this.hoverCell = null;
  //   // this.update();
  // }

  // #mergeLayoutsWithAreas() {
  //   const {templateAreas} = state.form.layoutTemplate;
  //   const layoutDefinitionKeys = [...state.form.fieldLayoutDefinitions.keys()];
  //   const areas = [...new Set(templateAreas.flat())];
  //   for (const area of layoutDefinitionKeys) {
  //     if (!areas.includes(area))
  //       state.form.removeFieldLayoutDefinition(area);
  //   }
  // }

  // /**
  //  * deprecated
  //  * @param evt
  //  */
  // toggleSelected(evt) {
  //   const selection = this.getSelection();
  //   if (!selection && selection !== evt.target) {
  //     evt.target.classList.toggle('selected');
  //   } else {
  //     this.joinCell(window.getComputedStyle(selection).gridRowStart, window.getComputedStyle(evt.target).gridRowStart);
  //   }
  // }

  render() {
    const {isLoading, formsList, form} = state;
    return html`
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
      <div style="width: 100%">
        <layout-controls></layout-controls>
        <div class="container" @mouseover="${this.onMouseOver}" style="${this.#getColumnsTemplateStr()}; ${this.#getRowTemplateStr()}">
          ${this.#getCellTemlates()}
        </div>
        <available-fields></available-fields>
      </div>

      ${this.#getDialogTemplate()}
    `;
  }

  // onAddField(e) {
  //   let dialog = this.shadowRoot.getElementById('dialog');
  //   dialog.area = this.hoverCell.area;
  //   dialog.showModal();
  // }
  onAddField(area) {
    let dialog = this.shadowRoot.getElementById('dialog');
    dialog.area = area;
    dialog.showModal();
  }

  // onDeleteField() {
  //   let area = this.hoverCell.area;
  //   state.form.removeField(area);
  //   this.updateCellByArea(area);
  // }

  // onDeleteField() {
  //   let layoutDefinition = this.hoverCell.layoutDefinition;
  //   layoutDefinition.clearField();
  //   this.update();
  // }

  // onDialogClose(e) {
  //   const dialog = e.target;
  //   const dataType = dialog.returnValue;
  //   state.form.addField({dataType}, dialog.area);
  //   this.updateCellByArea(dialog.area);
  // }
  //
  // updateCellByArea(area) {
  //   let formField = this.shadowRoot.querySelector(`form-field[data-area="${area}"]`);
  //   formField.field = state.form.fields[area];
  //   this.hoverCell = null;
  // }

  saveForm() {
    const form = state.form;
    // const content = form.layoutTemplate.makeTemplateContent();
    // console.log('saveForm -> content', content)
    // form.setTemplateContent(content);
    form.save();
  }

//   makeTemplateContent() {
//     return `
// <!-- Generated with visual coreweb editor -->
// <div data-container-id="Fields" ></div>
// <style id="corewebEditor">
//   [data-container-id="Fields"] {
//     display: grid;
//     ${this.#getColumnsTemplateStr()};
//     ${this.#getMappedRowTemplateStr()}
//   }
// </style>
// `;
//   }

//   makeTemplateContent() {
//     return `
// <!-- Generated with visual coreweb editor -->
// <div data-container-id="Fields" style="display: grid;${this.#getColumnsTemplateStr()};${this.#getMappedRowTemplateStr()};"></div>
// `;
//   }

  // get container() {
  //   return this.shadowRoot.querySelector('.container')
  // }

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
