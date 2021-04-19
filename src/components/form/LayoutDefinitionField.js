import {css, html} from "lit-element";
import {MobxLitElement} from "@adobe/lit-mobx";
import {FieldLayoutDefinition} from "../../state/FieldLayoutDefinition";
import {state} from '../../state';
import {Field} from "../../state/Field";
import {nothing} from "lit-html";
import {webadminButtonStyles} from "../styles";

export class LayoutDefinitionField extends MobxLitElement {

  static get styles() {
    return [
      css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;
        border-radius: 5px;
        border: 2px dashed rgb(117 169 191);
        background: #fff;
      }
      form-field {
        border: 0px;
      }
      .cellEditor {
        background-color: rgb(9,154,239,0.11);
        border-radius: 5px;
        z-index: 1;
        align-items: center;
        justify-content: center;
        display: flex;
        position:absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .arrow {
        position: absolute;
        color: #75a9bf;
        cursor:pointer;
        font-size: xx-large;
        padding: 5px;
      }
      .arrow:hover{
        color: #2783b3
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
      `, webadminButtonStyles]
  }

  static get properties() {
    return {
      layoutDefinition: {type: Object},
      hoverCell: {type: Object},
      onAddFieldCallback: {type: Function},
    }
  }

  constructor() {
    super();
    this.setAttribute('draggable', 'true');
    this.addEventListener('mouseenter', this.#onMouseOver);
    this.addEventListener('mouseleave', this.#onMouseLeave);
    this.addEventListener('drop', this.#onDrop);
    this.addEventListener('dragover', (e) => e.preventDefault());
    this.addEventListener('dragstart', this.#onDragStart.bind(this));
    // this.addEventListener('click', this.edit.bind(this));
  }

  onDeleteField(e) {
    // e.stopPropagation();
    let layoutDefinition = this.layoutDefinition;
    layoutDefinition.clearField();
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
      const templateAreas = state.form.layoutTemplate.templateAreas;
      switch (direction) {
        case 'up':
          destArea = templateAreas[top-1][left];
          break;
        case 'down':
          destArea = templateAreas[down+1][right];
          break;
        case 'left':
          destArea = templateAreas[top][left-1];
          break;
        case 'right':
          destArea = templateAreas[down][right+1];
          break;
        default:
          if (direction instanceof Event)
            destArea = window.getComputedStyle(direction.target).gridRowStart;
      }
      state.form.layoutTemplate.joinCell(this.hoverCell.area, destArea);
      this.hoverCell = null;
    }
  }

  splitCell(e) {
    // e.stopPropagation();
    let area = this.hoverCell.area;
    state.form.layoutTemplate.splitCell(area);
    this.hoverCell = null;
  }

  onAddField(e) {
    // e.stopPropagation();
    this.onAddFieldCallback(this.dataset['area']);
  }

  edit() {
    state.form.setSelectedLayoutDefinition(this.layoutDefinition);
  }

  // disconnectedCallback() {
  //   super.disconnectedCallback();
  //   const {area} = this.dataset;
  //   state.form.deleteFieldLayoutDefinition(area);
  // }

  render() {
    const {layoutDefinition} = this;
    const {order, field} = layoutDefinition;
    return html`
      <form-field tabindex=${order} .field=${field} .layoutDefinition=${layoutDefinition}></form-field>
      ${this.#getHoverCellTemplate()}
    `;
  }

  #onMouseLeave(e) {
    this.hoverCell = null;
  }

  #onMouseOver(e) {
    const node = this;
    const hoverCell = {area:node.dataset['area'], direction:{}};
    const {templateAreas} = state.form.layoutTemplate;
    let flatAreas = templateAreas.flat();
    let startIndex = flatAreas.indexOf(hoverCell.area);
    let lastIndex = flatAreas.lastIndexOf(hoverCell.area);
    hoverCell.direction.left = startIndex%templateAreas[0].length;
    hoverCell.direction.right = lastIndex%templateAreas[0].length;
    hoverCell.direction.top = (startIndex/templateAreas[0].length)>>0;
    hoverCell.direction.down = (lastIndex/templateAreas[0].length)>>0;
    hoverCell.dataType = node.layoutDefinition?.field?.dataType;
    hoverCell.layoutDefinition = node.layoutDefinition;
    hoverCell.isMultiCell = startIndex !== lastIndex;
    this.hoverCell = hoverCell;
    // state.form.selectedLayout = this.layoutDefinition;
  }

  #onDragStart(e) {
    const {layoutDefinition} = this;
    const area = this.dataset['area'];
    const data = {
      fieldId: layoutDefinition.field?.id,
      fromArea: area,
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    console.log(`Drag data: `, data);
  }

  #onDrop(e) {
    const {fieldId, fromArea} = JSON.parse(e.dataTransfer.getData('text'));
    const dragField = state.form.fields.find(({id}) => id === fieldId);
    const currentLayoutDefinition = this.layoutDefinition;
    if (fromArea) {
      const fromLayout = state.form.fieldLayoutDefinitions.get(fromArea);
      fromLayout.update({field: currentLayoutDefinition.field});
    }
    currentLayoutDefinition.update({field: dragField});
  }

  #getHoverCellTemplate() {
    const area = this.dataset['area'];
    const {templateAreas} = state.form.layoutTemplate;
    return html`${this.hoverCell ? html`
            <div style="grid-area: ${area};" class="cellEditor" draggable="true">
              ${this.hoverCell?.dataType ? html`
                <button style="margin-right: 8px;" @click="${this.edit}">Edit</button>
                <button @click="${this.onDeleteField}">Detach</button>`:
      html`<button @click="${this.onAddField}">Add</button>`
    }
              ${this.hoverCell.isMultiCell ? html`<button style="margin-left: 8px;"
                   @click="${this.splitCell}">Split</button>`:''}
              <div class="arrow top" ?hidden=${this.hoverCell.direction.top === 0}
                   @click="${e=> {
                     // e.stopPropagation();
                     this.prepareJoinCell('up');
                   }}">+</div>
              <div class="arrow bottom" ?hidden=${this.hoverCell.direction.down === templateAreas.length-1}
                   @click="${(e)=> {
                     // e.stopPropagation();
                     this.prepareJoinCell('down')
                   }}">+</div>
              <div class="arrow left" ?hidden=${this.hoverCell.direction.left === 0}
                   @click="${(e)=> {
                     // e.stopPropagation();
                     this.prepareJoinCell('left')
                   }}">+</div>
              <div class="arrow right" ?hidden=${this.hoverCell.direction.right === templateAreas[0].length-1}
                   @click="${(e)=> {
                     // e.stopPropagation();
                     this.prepareJoinCell('right')
                   }}">+</div>
            </div>`:''}`
  }
}

customElements.define('layout-definition-field', LayoutDefinitionField);
