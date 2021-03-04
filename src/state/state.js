import {makeAutoObservable, runInAction} from 'mobx';
import {loadForms, loadFormDependencies} from "../api";
import {Form, Field, LayoutTemplate} from "../model";

class State {
  isLoading = false;
  formsList= [];
  form = null;
  fields = [];


  constructor() {
    makeAutoObservable(this);
  }

  async loadAllForms() {
    if (this.formsList && this.formsList.length > 0)
      return this.formsList;

    const formsList = await loadForms();
    console.log(formsList);
    runInAction(() => {
      this.formsList = formsList.sort(sortFormComparator);
    });
    return formsList;
  }

  async setActiveForm(formId) {
    const [forms, items] = await Promise.all([this.loadAllForms(), loadFormDependencies({formId})]);
    const form = forms.find(({id}) => formId);
    form.layout = items.find(({type}) => type === LayoutTemplate.BEAN_TYPE);
    form.fields = items.filter(({type}) => type === Field.BEAN_TYPE);

    runInAction(() => {
      this.form = form;
      this.fields = form.fields;
    });
  }

  clearActiveForm() {
    this.form = {};
    this.fields = [];
  }
}

function sortFormComparator(a, b) {
  const name1 = a.name.toLowerCase();
  const name2 = b.name.toLowerCase();
  if (name1 > name2)
    return 1
  if (name1 < name2)
    return -1;
  return 0;
}

export const state = new State();

