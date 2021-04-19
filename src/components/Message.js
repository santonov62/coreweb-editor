import {css, LitElement} from "lit-element";
import {html} from "lit-html";
import {classMap} from "lit-html/directives/class-map";

export class Message extends LitElement {

  static get properties() {
    return {
      type: {type: String},
      title: {type: String},
    }
  }

  static get styles() {
    return [css`
      .warning {
        border: 1px solid #c19b56;
        background-color: #f7eecf;
        color: #866730;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .warning .title {
        font-weight: bold;
        font-size: 1.5em;
      }
    `];
  }

  constructor() {
    super();
  }
  render() {
    const {title, type} = this;
    return html`
      <div class="${classMap({[type]: true})}">
        <div class="title">${title}</div>
        <br/>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('form-message', Message);
