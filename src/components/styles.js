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
