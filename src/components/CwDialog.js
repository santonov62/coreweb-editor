import {LitElement, html, css} from 'lit-element';
//polifill for fucking safari
// if (/.*Version.*Safari.*/.test(navigator.userAgent) && !window.dialogPolyfill) {
//   window.dialogPolyfillPromise = import('dialog-polyfill');
// }
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

  constructor() {
    super();
    if (window.dialogPolyfillPromise) {
      let self = this;
      window.dialogPolyfillPromise.then((module)=> {
        self.dialogPolyfill = module.default;
        if (self.dialog)
          self.dialogPolyfill.registerDialog(self.dialog);
      })
    }
  }

  static get properties() {
    return {
      open: {type: Boolean, attribute: true, reflect: true},
      returnValue: {type: Object, attribute: false},

    };
  }
  //override to use light dom
  // createRenderRoot() {
  //     return this;
  // }
  get returnValue() {
    return this.dialog.returnValue;
  }

  setFormValue(e) {
    let slot = this.shadowRoot.querySelector('slot');
    if (slot) {
      let slotChilds = slot.assignedElements({flatten: true});

      let form = document.createElement('form');
      form.setAttribute('method', 'dialog')
      for (let node of slotChilds)
        form.appendChild(node.cloneNode(true));
      e.target.value = Object.fromEntries(new FormData(form));
      this.dialog.returnValue = e.target.value;
      return e.target.value;
    }
    return {};
  }

  firstUpdated() {
    this.dialog = this.shadowRoot.getElementById('dialog');
    if (this.dialogPolyfill)
      this.dialogPolyfill.registerDialog(this.dialog);
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
  }

  render() {
    return html`
            <dialog id="dialog" ?open="${this.open}" @close="${this.onclose}" @cancel="${this.onclose}">
                <form method="dialog">
                    <slot name="body"></slot>
                    <menu>
<!--                        <button type="reset">Reset</button>-->
                        <button type="submit" value=''">Cancel</button>
                        <button type="submit" value="true" @click="${this.setFormValue}">Confirm</button>
                    </menu>
                </form>
            </dialog>
        `;
  }
}

window.customElements.define('cw-dialog', CWDialog);
