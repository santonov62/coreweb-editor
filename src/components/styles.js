import { css } from 'lit-element';

export const buttonStyles = css`
    button {
      background-color: #4CAF50;
      border: 1px solid green;
      color: white;
      padding: 5px 10px;
      cursor: pointer;
    }
    button:hover {
      background-color: #3e8e41;
    }`;

export const webadminButtonStyles = css`
    button {
      display: inline-block;
      border: 1px solid #a7c3d5;
      height: 24px;
      font: 12px/12px Arial, Helvetica, sans-serif;
      border-radius: 8px;
      -moz-border-radius: 8px;
      -webkit-border-radius: 8px;
      padding: 0 16px;
      color: #145089;
      background: url(./images/modern/buttons-back.png) #c8dfee;
      font-weight: bold;
      cursor: hand;
      cursor: pointer;
      -webkit-box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
      -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      -o-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 2px rgb(0 0 0 / 30%);
      margin: 3px;
      white-space: nowrap;
    }
    button:hover {
      border-color: #3f617c;
      background: url(./images/modern/buttons-back.png) 0 -22px #41637e;
      color: #FFFFFF;
      text-shadow: 0px -1px 0 #1a242c;
    }
`;

export const common = css`
  .header1 {
    font: 22px/24px Arial, Helvetica, sans-serif;
    text-decoration: none;
    color: #2683B3;
    // padding: 18px 0 0 0;
    text-shadow: 0 -1px 0 #5f6d76;
  }
`;

export const xwidget = css`
:host {
  --color-widget: var(--color-base-hue);
  --color-widget-hover: var(--color-base-hue-light);
  --color-widget-hover-secondary: var(--color-base-hue-dark-1);
  --color-widget-text-hover: var(--color-base-hue-dark-2);
  /* Preset styles */
  --color-page-background: var(--color-base-white, #ffffff);
  --color-border: #dadada;
  --color-widget: var(--color-base-hue, #6a9931);
  --color-widget-hover: var(--color-base-hue-light, #74a637);
  --color-widget-hover-secondary: var(--color-base-hue-dark-1, #628c2e);
  --color-widget-text-hover: var(--color-base-hue-dark-2, #527725);
  --color-widget-input: var(--color-page-background, #ffffff);
  --color-widget-modal-background: var(--color-page-background, #ffffff);
  --color-widget-action-icon-background: #efefef;
  --color-widget-readonly-background: var(--color-access-readonly, #cccccc);
  --color-widget-readonly-text: var(--color-access-readonly-light, #C8C8C8);
  --color-widget-required-background: var(--color-access-required, #a57f36);
  --color-widget-required-background-hover: var(--color-access-required-light, #af8c3c);
  --color-widget-required-background-hover-secondary: var(--color-access-required-dark, #9d7233);
  --color-widget-error-background: var(--color-alert-light, #fff5f5);
  --color-widget-disabled: var(--color-base-grey, #efefef);
  --color-widget-background-odd: var(--color-base-grey-hue-1, #fcfcfa);
  --color-widget-selected: var(--color-base-grey-hue-2, #f7fcf0);
  --color-text: #666666;
  --color-text-contrast: var(--color-page-background, #ffffff);
  --color-text-accent: var(--color-text-light, #999999);
  --color-text-hover: var(--color-text-dark, #444444);
  --color-text-tree-accent: var(--color-base-black, #000000);
  --color-text-error: var(--color-alert, #f56161);
  --color-text-error-input: var(--color-alert-input, #e0b3b3);
  --color-text-message: var(--color-info, #5ba3c7);
  --color-text-message-secondary: var(--color-info-light, #cfdde6);
  --color-text-warning: var(--color-warning, #f89406);
  --color-text-info: var(--color-info, #0094FF);
  --color-text-grid-expanded: #ffffff;
  --color-text-placeholder: #757575;
  --color-tooltip: #e6e34c;
  --color-tooltip-secondary: var(--color-tooltip-light, #fcfce3);
  --color-overlay-dialog: rgba(50, 50, 50, 0.3);
  --color-overlay-blocked: rgba(255, 255, 255, 0.5);
  --border-radius: 4px;
  --border-width: 1px;
  --size-dialog-popup-width: 1000px;
  /*see .responsive class*/
  --size-dialog-alert-width: 400px;
  --size-attachment-preview: 100px;
  --size-input-height: 30px;
  --size-input-checked: 20px;
  --size-widgets-gap: 10px;
  --size-widgets-side-gap: 20px;
  --size-label-width: 300px;
  --size-grid-row-height: 50px;
  --size-button: var(--size-input-height);
  --font-size-base: 14px;
  --font-size-small: 12px;
  --font-size-h1: 24px;
  --font-size-h2: 16px;
  --font-size-icon: 16px;
}


}
`;
