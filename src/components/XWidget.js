import {LitElement} from "lit-element";
import {html} from "lit-html";


export class XWidget extends LitElement {

  static get properties() {
    return {
      isCorewebScriptsLoaded: {type: Boolean, value: false}
    }
  }

  constructor() {
    super();
    corewebSciptsComplete.then(() => this.isCorewebScriptsComplete = true);
    this.updateComplete.then(() => {
      if (this.isCorewebScriptsComplete) {
        const widgetLayoutManager = new PageLayoutManager('widget', {isNew: true});
        widgetLayoutManager.initForm({
          fields: [
            {
              name: 'textfield',
              dataType: 'textfield',
              ...this.field
            }
          ]
        }, true);
      }
    });
  }

  render() {
    const {isCorewebScriptsComplete} = this;
    return html`
      ${isCorewebScriptsComplete ? html`
          <div data-form-id="widget">XWidget html</div>`
        : html`<div>Coreweb scripts loading...</div>`}
    `;
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

const corewebSciptsComplete = new Promise((resolve, reject) => {
  loadCorewebScripts().then(resolve).catch(reject);
});
