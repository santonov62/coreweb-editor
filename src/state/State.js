import {makeAutoObservable, makeObservable, observable, runInAction, get, set} from 'mobx';
import {getForms} from "../api";
import {Form} from "./Form";

export class State {
  isLoading = false
  formsList = []
  form

  constructor() {
    makeAutoObservable(this);
    this.form = new Form({state: this});
  }

  async loadAllForms() {
    if (this.formsList && this.formsList.length > 0)
      return this.formsList;

    this.isLoading = true;
    const beans = await getForms();
    const formsList = beans.map(bean => new Form({state: this}).fromDatabean(bean));

    runInAction(() => {
      this.formsList = formsList.sort(sortFormComparator);
      this.isLoading = false;
    });

    console.log(`loadAllForms ->`, formsList);
    return formsList;
  }

  resetForm() {
    this.form = new Form({state: this});
  }

  async setActiveForm(formId) {
    const forms = await this.loadAllForms();
    const form = forms.find(({id}) => id === Number.parseInt(formId));
    runInAction(() => {
      this.form = form;
      form.loadDependencies();
    });
  }

}

function sortFormComparator(form, formNext) {
  const name1 = form.name.toLowerCase();
  const name2 = formNext.name.toLowerCase();
  if (name1 > name2)
    return 1
  if (name1 < name2)
    return -1;
  return 0;
}
