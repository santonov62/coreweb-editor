import { LitElement, html, css } from 'lit-element';

export class CorewebEditor extends LitElement {
  static get properties() {
    return {
      title: {type: String},
      itemsCount: {type: Number},
      columnsCount: {type: Number}
    };
  }

  static containerStyles = css`.container {
        display: grid;
        position: relative;
        padding: 10px;
        height: 100%;
        width: 100%;
        gap: 10px;
        place-items: stretch;
        min-height: 400px;
      }

      .container div {
        background: #3273dc;
        color: white;
        padding: 20px;
        font-size: 21px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  `;

  static get styles() {
    return [css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--coreweb-editor-background-color);
      }
    `, this.containerStyles];
  }

  constructor() {
    super();
    this.title = 'My app';
    this.itemsCount = 1;
    this.columnsCount = 1;
  }

  #getColumnsTemplateStr() {
    let res = 'grid-template-columns: 1fr';
    for (let i=0; i<this.columnsCount-1; i++) {
      res += ' 1fr';
    }
    return res;
  }

  addColumn() {
    this.columnsCount++;
  }

  deleteColumn() {
    if (this.columnsCount > 0)
      this.columnsCount--;
  }

  #getItemTemlates() {
    const itemTemplates = [];
    for (let i=0; i<this.itemsCount; i++) {
      itemTemplates.push(html`<div data-fieldname="name">${i+1}</div>`);
    }
    return itemTemplates;
  }

  addItem() {
    this.itemsCount++;
  }

  deleteItem() {
    if (this.itemsCount > 0)
      this.itemsCount--;
  }

  getHTMLTemplate() {
    return CorewebEditor.containerStyles + '\n' + this.shadowRoot.querySelector('.container').outerHTML;
  }

  render() {
    return html`
      <div class="container" style="${this.#getColumnsTemplateStr()}">
        ${this.#getItemTemlates()}
      </div>
    `;
  }
}

customElements.define('coreweb-editor', CorewebEditor);
