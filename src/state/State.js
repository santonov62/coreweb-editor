import {makeAutoObservable, makeObservable, observable, runInAction, get, set} from 'mobx';
import {getForms} from "../api";
import {Form} from "./Form";

export class State {
  isLoading = false;
  formsList = [];
  formState

  constructor({formState}) {
    makeAutoObservable(this);
    this.formState = formState;
  }

  async loadAllForms() {
    if (this.formsList && this.formsList.length > 0)
      return this.formsList;

    const beans = await getForms();
    const formsList = beans.map(bean => new Form().fromDatabean(bean));

    console.log(formsList);
    runInAction(() => {
      this.formsList = formsList.sort(sortFormComparator);
    });
    return formsList;
  }

  async setActiveForm(formId) {
    const forms = await this.loadAllForms();
    const form = forms.find(({id}) => id === Number.parseInt(formId));
    await form.loadFormDependencies();
    runInAction(() => {
      this.formState = form;
    });
  }

  clearActiveForm() {
    this.formState = {};
  }

  removeFormField(fieldId) {
    this.formState.removeField(fieldId);
  }

  addFormField(data) {
    this.formState.addField(data);
  }

  setFormField({id, dataType}) {
    const fields = this.formState.fields;
    const index = fields.findIndex(field => id === field.id);
    const field = fields[index];
    field.dataType = dataType;
    fields.splice(index, 1, field);
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

const formState = new Form();
export const state = new State({formState});
