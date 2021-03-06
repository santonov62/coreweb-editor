import {makeAutoObservable, runInAction} from 'mobx';
import {loadFormDependencies, loadForms} from "../api";
import {Field, LayoutTemplate} from "../model";

class State {
  isLoading = false;
  formsList = [];
  form = {fields:[]};

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
    });
  }

  clearActiveForm() {
    this.form = {};
  }

  removeField(fieldId) {
    const fields = this.form.fields.filter(({id}) => fieldId !== id);
    this.form = {
      ...this.form,
      fields
    }
  }

  addField({id = Date.now(), fieldName = '', dataType = ''}) {
    const {fields} = this.form;
    fields.push({id, fieldName, dataType});
    this.form = {
      ...this.form,
      fields
    }
  }
}

export function sortFormComparator(form, formNext) {
  const name1 = form.name.toLowerCase();
  const name2 = formNext.name.toLowerCase();
  if (name1 > name2)
    return 1
  if (name1 < name2)
    return -1;
  return 0;
}


export const state = new State();
