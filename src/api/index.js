import saveDatabean from "./saveDatabean";

export async function saveForm(params) {
  const config = {...params};
  return saveDatabean(config);
}

export async function saveFormTemplate(params) {
  const config = {...params};
  return saveDatabean(config)
}
