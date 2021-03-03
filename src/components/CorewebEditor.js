import { LitElement, css } from 'lit-element';
import {html, render} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {saveFormTemplate, loadLayoutTemplate} from "../api";

export class CorewebEditor extends LitElement {
  static get properties() {
    return {
      isLoading: {type: Boolean}
    };
  }

  static containerStyles = css`.container {
        display: grid;
        // position: relative;
        // padding: 10px;
        // width: 100%;
        gap: 10px;
      }

      .container div:hover {
        background: cornflowerblue;
      }

      .container div.selected {
        background: blueviolet;
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
        margin: 0 auto;
      }
      .form-name-container {
        align-self: flex-start;
        margin-top: 10px;
      }
      .isLoading {
        margin: 10px;
      }
      .container {
      padding: 10px;
        align-self: stretch
      }
      .container form-field {
        background: #3273dc;
        color: white;
        padding: 20px;
        border-radius: 5px;
      }
    `, this.containerStyles];
  }

  constructor() {
    super();
    this.templateAreas = [["x1x1"]];
    this.loadTemplate({id:28512109});
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

  addRow() {
    const fieldTemplateContent = `<form-field data-fieldname="${Date.now()}"></form-field>`;
    this.#appendHtml(fieldTemplateContent);
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

  render() {
    const {isLoading} = this;
    return html`
          <div style="margin: 15px">
            <button @click="${this.addRow}">Add Row</button>
            <button @click="${this.deleteRow}">Delete Row</button>
            <button @click="${this.addColumn}">Add Column</button>
            <button @click="${this.deleteColumn}">Delete Column</button>
            <button @click="${this.undo}">Undo</button>
          </div>

          <div class="form-name-container">
            <label for="formName">Form name: </label>
            <input id="formName" value="xxx" type="text" />
            <button @click="${this.saveFormTemplate}">Save</button>
          </div>

          <div class="container" style="${this.#getColumnsTemplateStr()}; ${this.#getRowTemplateStr()}">
            ${isLoading ?
              html`<div class="isLoading">Loading...</div>` : ''}
          </div>
    `;
  }

  async saveFormTemplate() {
    const template = this.makeFormTemplate();
    await saveFormTemplate({template});
  }

  makeFormTemplate() {
    return `<div data-container-id="Fields">${this.container.innerHTML}</div>` +
           `<style>${CorewebEditor.containerStyles}</style>`;
  }

  get container() {
    return this.shadowRoot.querySelector('.container')
  }

  appendLayoutTemplate(layoutTemplateContent) {
    const template = document.createElement('template');
    template.innerHTML = layoutTemplateContent.trim();
    this.#appendHtml(template.content.firstChild.innerHTML);
  }

  #appendHtml(html) {
    this.container.insertAdjacentHTML('beforeend', html);
  }

  async loadTemplate({id}) {
    try {
      this.isLoading = true;
      const layoutTemplateBean = await loadLayoutTemplate({id});
      this.appendLayoutTemplate(layoutTemplateBean.content);
      console.log(`Load layoutTemplateBean: `, layoutTemplateBean);
    } finally {
      this.isLoading = false;
    }
  }
}

customElements.define('coreweb-editor', CorewebEditor);
