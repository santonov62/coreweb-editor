import { LitElement, css } from 'lit-element';
import {html, render} from 'lit-html';

export class CorewebEditor extends LitElement {
  static get properties() {
    return {
      title: {type: String}
    };
  }

  static containerStyles = css`.container {
        display: grid;
        position: relative;
        padding: 10px;
        // height: 100%;
        width: 100%;
        gap: 10px;
        // place-items: stretch;
        // min-height: 400px;
        // font-size: calc(10px + 2vmin);
      }

      .container form-item {
        background: #3273dc;
        color: white;
        padding: 20px;
        // font-size: 21px;
        border-radius: 5px;
        // display: flex;
        // justify-content: center;
        // align-items: center;
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
        // text-align: center;
        background-color: var(--coreweb-editor-background-color);
      }
      .formNameContainer {
        align-self: flex-start;
        margin-top: 10px;
      }
    `, this.containerStyles];
  }

  constructor() {
    super();
    this.title = 'My app';
    this.templateAreas = [["x1x1"]];
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
    return [...new Set(this.templateAreas.flat())].map((cell,i)=>{
      return html`<form-item draggable="true" ondrag="this.classList.add('selected')" ondragend="this.classList.remove('selected')" ondragover="event.preventDefault();
event.dataTransfer.dropEffect = 'move'" @drop="${this.toggleSelected}" class="item" data-fieldname="name" tabindex="0" style="grid-area: ${cell}">${i+1}</form-item>`
    })
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

  toggleSelected(evt) {
    const selection = this.getSelection();
    if (!selection && selection !== evt.target) {
      evt.target.classList.toggle('selected');
    } else {
      this.saveState();
      let [,row1,col1] = window.getComputedStyle(selection).gridRowStart.split('x');
      let [,row2,col2] = window.getComputedStyle(evt.target).gridRowStart.split('x');
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
      this.getSelection().classList.remove('selected');
      this.update();
      console.log('----------', this.templateAreas);
    }


  }

  render() {
    return html`
      <div>
          <div style="float: left; margin: 15px">
            <button @click="${this.addRow}">Add Row</button>
            <button @click="${this.deleteRow}">Delete Row</button>
            <button @click="${this.addColumn}">Add Column</button>
            <button @click="${this.deleteColumn}">Delete Column</button>
            <button @click="${this.undo}">Undo</button>
          </div>
          <div class="formNameContainer">
            <label>Form name: </label>
            <input id="formName" value="xxx" type="text" />
            <button>Save</button>
          </div>
          <div class="container" style="${this.#getColumnsTemplateStr()}; ${this.#getRowTemplateStr()}" @click="${this.toggleSelected}">
            ${this.#getCellTemlates()}
          </div>
        </div>
    `;
  }
}

customElements.define('coreweb-editor', CorewebEditor);
