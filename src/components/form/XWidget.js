import {css, LitElement} from "lit-element";
import {html} from "lit-html";
import {xwidget} from "../styles";


export class XWidget extends LitElement {

  static get properties() {
    return {
      isCorewebScriptsLoaded: {type: Boolean, value: false},
      options: {type: Object},
      field: {type: Object},
    }
  }

  constructor(options) {
    super();
    window.loadCorewebScipts.then(() => this.isCorewebScriptsLoaded = true)
    this.updateComplete.then(() => {
      if (this.isCorewebScriptsLoaded && options) {
        const rendererContainer = this.shadowRoot.getElementById('renderer');
        // if (rendererContainer) {
          const widget = utils.createWidget({...options});
          rendererContainer.innerHTML = '';
          rendererContainer.append(widget[0]);
        // }
      }
    });
  }

  render() {
    const {isCorewebScriptsLoaded} = this;
    return html`
      <link rel="stylesheet" href="https://helios.mediaspectrum.net/coreweb_ui/css/main.css?ver=cui1.0.158">
      ${isCorewebScriptsLoaded ? html`
          <div id="renderer">XWidget html</div>`
        : html`<div>Coreweb scripts waiting...</div>`}
    `;
  }

  // set options(newOptions) {
  //   const oldValue = this._options;
  //   this._options = newOptions;
  //   if (newOptions) {
  //     window.loadCorewebScipts.then(() => {
  //       const rendererContainer = this.shadowRoot.getElementById('renderer');
  //       const widget = utils.createWidget({...this.options});
  //       rendererContainer.innerHTML = '';
  //       rendererContainer.append(widget[0]);
  //     })
  //   }
  //   // this.requestUpdate('options', oldValue);
  //   this.requestUpdate('options', oldValue);
  // }
  //
  // get options() {
  //   return this._options;
  // }

  static get styles() {
    return [css`
      #renderer > div {
        display: block !important;
      }`, xwidget];
  }
}
customElements.define('x-widget', XWidget);

window.config = {
  appName: '',
  baseUrl: 'http://localhost:8080/coreweb',
  // baseUrl: 'coreweb'
}
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    const head = document.querySelector('head');
    head.appendChild(script);
  });
}

export async function loadCorewebScripts() {
  await loadScript(`${window.config.baseUrl}/controller/cuivar?foo=` + Date.now() + '&___AppName=' + window.config.appName);
  window.config = Object.assign(window.config, window.cuivar);
  await loadScript(`${window.config.baseUrl}/scripts/libs/jquery-1.10.1.min.js`);
  await loadScript(`${window.config.baseUrl}/scripts/libs/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.min.js`);
  await loadScript(`${window.config.baseUrl}/js/coreweb.js`);
  await loadScript(`${window.config.baseUrl}/controller/l10nvar?___AppName=${config.appName}`);
  window.l10n = new LocalizationManager({...window.resourcesLocal, ...window.resources});
  // init managers and global vars
  window.contextPath = window.config.baseUrl;
  window.___AppName = window.config.appName;
  window.corewebAPI = new CorewebAPI({
    contextPath: window.contextPath,
    appname: window.config.appName
  });
  window.contextManager = new ContextManager();
  window.utils = new Utils();
  window.renderers = new Renderers();
  window.triggersManager = new TriggersManager();
  window.triggersManager.init();
  window.callback = new ResponseCallback();
  await loadScript(`${window.config.baseUrl}/js/coreweb.widgets.js`);
  return true;
}

window.loadCorewebScipts = window.loadCorewebScipts || loadCorewebScripts();
