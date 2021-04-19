import {css, LitElement} from "lit-element";
import {html} from "lit-html";
import {common} from "./styles";

export class Loader extends LitElement {

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="loader header1"><slot></slot></div>
    `;
  }

  static get styles() {
    return [css`
    .loader {
      z-index: 999;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }`, common];
  }
}

customElements.define('form-loader', Loader)
