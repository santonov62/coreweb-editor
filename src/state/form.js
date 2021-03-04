import {makeAutoObservable, runInAction} from 'mobx';
import {loadForms} from "../api";

export class Form {
  values = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    const forms = await loadForms();
    console.log(forms);
    runInAction(() => this.values = forms);
  }
}
