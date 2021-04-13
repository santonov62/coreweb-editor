import {makeAutoObservable} from "mobx";

export class Editor {

  templateAreas

  constructor(data = {}) {
    makeAutoObservable(this);
    this.state = data.state;
    this.templateAreas = [['x1x1']];
  }
}
