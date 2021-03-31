import {LitElement, html, css} from 'lit-element';
import { buttonStyles } from './styles';

/**
 * A form dialog component, collect values from dialogs elements who have 'name' attribute
 * @element cw-dialog
 * @slot - dialog content
 * @attr {String} title - Label for dialog
 * @attr {String} oktitle - Label for Ok button
 * @attr {String} canceltitle - Label Cancel button
 * @attr {Boolean} nobuttons - Hide Ok/Cancel buttons
 * @property {Object} returnValue - json dialogs value, ex: {name1: value1, name2: value2, ...}
 * @fires {} close - Fires when dialog closed
 * @fires {} cancel - Fires when dialog canceled (ex. by escape key)
 */
class CWDialog extends LitElement {

  static get styles() {
    return [
      buttonStyles,
      css`
      dialog::backdrop {
        background-color: rgba(190,190,190,0.7) !important;
      }
        menu {
          display: flex; justify-content: flex-end; margin-bottom: 0
        }`
    ]
  }

  static get properties() {
    return {
      open: {type: Boolean, attribute: true, reflect: true},
      returnValue: {type: Object, attribute: false},
      title: {type: String}
    };
  }
  //override to use light dom
  // createRenderRoot() {
  //     return this;
  // }
  /**
   * Return dialog value
   * @returns {any} if form consists from multiple fields return object else return field value
   */
  get returnValue() {
    if (this.dialog.returnValue) {
      const value = JSON.parse(this.dialog.returnValue);
      const keys = Object.keys(value);
      return (keys.length > 1) ? value : value[keys[0]];
    } else
      return null;
  }

  setFormValue(e) {
    let slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      let slotChilds = slot.assignedElements({flatten: true});

      let form = document.createElement('form');
      form.setAttribute('method', 'dialog')
      for (let node of slotChilds) {
        let cloned = form.appendChild(node.cloneNode(true));
        cloned.value = node.value;
      }
      e.target.value = JSON.stringify(Object.fromEntries(new FormData(form)));
      return e.target.value;
    }
    return {};
  }

  firstUpdated() {
    this.dialog = this.shadowRoot.getElementById('dialog');
  }

  showModal() {
    this.dialog.showModal();
    //this.shadowRoot.getElementById('dialog').showModal();
  }

  show() {
    this.dialog.show();
  }

  close() {
    this.dialog.close();
  }

  onclose(e) {
    console.log("close CWDialog",e);
    this.dispatchEvent(new Event('close', {bubbles: true}));
  }

  render() {
    return html`
            <dialog id="dialog" ?open="${this.open}" @close="${this.onclose}" @cancel="${this.onclose}">
                <fieldset>
                  <legend>${this.title}</legend>
                <form method="dialog" style="margin-block-end: 0" id="cwform">
                    <slot></slot>
                    <menu>
                        <button type="submit" style="margin-right: 8px;" value="true" @click="${this.setFormValue}">Ok</button>
                        <button type="submit" value=''">Cancel</button>
                    </menu>
                </form>
                </fieldset>
            </dialog>
        `;
  }
}

window.customElements.define('cw-dialog', CWDialog);
