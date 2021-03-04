import saveDatabean from "./webadmin/rulesui/saveDatabean";
import getBeansMethod from "./webadmin/rulesui/methodAction/getBeansMethod";
import {LayoutTemplate, Form} from "../databean";

export async function saveForm(params) {
  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'notStandardForms',
    // trees:
    beanType: 'crm.config.common.Form',
    // pageInoffsetdex: 0,
    // orderBy: 'name',
    // orderIndex: 'ASC',
    // condition_isStandard: 0,
    // databeanChecked:
    rootId: 28511575,
    id: 28512111,
    // databeanName:
    action_name: 'coreweb_components',
    action_type: 'crm.object.cwcomponents',
    action_transient: 0
  };
  return saveDatabean(config);
}

export async function saveFormTemplate({template}) {
  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'layoutTemplate',
    trees: 'standardObject',
    beanType: 'crm.config.common.LayoutTemplate',
    condition_isStandard: 0,
    condition_standardObject: 28511575,
    condition____nav2: 'layoutTemplate',
    rootId: 28512109,
    id: 28526561,
    action_template: template
  }
  return saveDatabean(config)
}

export async function loadLayoutTemplate({id}) {
  if (!id)
    throw Error(`id required!`);

  const config = {
    type: LayoutTemplate.BEAN_TYPE,
    rootId: id
  }
  const beans = await getBeansMethod(config);
  const layoutTemplate = beans && new LayoutTemplate(beans[0]);
  if (!layoutTemplate)
    throw Error(`There is no layout template bean.`);

  return layoutTemplate.template;
}

export async function loadForms() {
  const config = {
    type: Form.BEAN_TYPE,
  };
  const beans = await getBeansMethod(config);

  return beans.map(bean => new Form(bean));
}
