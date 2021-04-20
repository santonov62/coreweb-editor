import {LitElement, html, css} from 'lit-element';
import FieldDataTypeEnum from "../../FieldDataTypeEnum";
import {state} from '../../state';
import {MobxLitElement} from "@adobe/lit-mobx";
import {Field} from "../../state/Field";
import {nothing} from "lit-html";
import {XWidget} from "./XWidget";

export class FormField extends MobxLitElement {

  static get properties() {
    return {
      id: {type: Number},
      isEditEnabled: {type: Boolean},
      field: {type: Object},
      layoutDefinition: {type: Object}
      // dataType: {type: String},
      // fieldName: {type: String},
      // label: {type: String},
      // placeholder: {type: String}
    }
  }

  static get styles() {
    return [
      css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;
        background: #fff;
        padding: 20px;
        border-radius: 5px;
        min-height: 60px;
        color: #2c789e;
        border: 1px solid rgb(117 169 191);
      }
      select {
        margin: 10px 0 10px 0;
      }
      .controls {

      }
      .component {
        align-self: stretch
      }
      `
    ]
  }

  constructor() {
    super();
    this.field = new Field();
    // this.addEventListener('focus', (event) =>  this.isEditEnabled = true );
    // this.addEventListener('blur', (event) =>  this.isEditEnabled = false );
  }

  render() {
    const {field, layoutDefinition} = this;
    if (!field)
      return nothing;

    console.log('FormField render', field);
    const {fieldName, label, dataType, placeholder, id} = field;
    // const {access} = layoutDefinition;
    const editUrl = `${location.origin}/webadmin/rulesui2.crm-customer-fields.ct?formName=notStandardFields&filter_(databean)rootId=${id}`;

    // return html`
    //   <div class="controls">
    //     <a href=${editUrl} target="_blank">Open field</a>
    //   </div>
    return html`
      <span>${dataType}</span>
      <div class="component">
        ${renderFieldComponent({field, layoutDefinition})}
      </div>
    `;
  }
}

// function renderFieldComponent({dataType, label, placeholder, layoutDefinition:{access}=''}) {
//   if (FieldDataTypeEnum[dataType] && customElements.get(dataType)) {
//     return html`<${dataType} label="${label}" placeholder="${placeholder}" ${access}/>`;
//   }
//   switch (dataType) {
//     case FieldDataTypeEnum.textfield:
//       return html`
//         <div>xtextfield widget</div>`;
//     default:
//       return html`this widget can't be displayed`;
//   }
// }
function renderFieldComponent({field, layoutDefinition}) {
  const options = {...field, access: layoutDefinition.access, layoutId: layoutDefinition.id}
  if (FieldDataTypeEnum[options.dataType]) {
    return html`${new XWidget(options)}`;
  }
  return html`
    this field can't be displayed
    <div style="word-break: break-all;">Field: ${JSON.stringify(options)}</div>
  `;
}

customElements.define('form-field', FormField);
