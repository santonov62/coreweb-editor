import saveDatabean from "./webadmin/rulesui/saveDatabean";
import getBeans2Method from "./webadmin/rulesui/methodAction/getBeans2Method";
import {Field, Form, LayoutTemplate} from "../model";
import deleteBeans from "./webadmin/rulesui/deleteDatabeans";

export async function saveForm(params) {
  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'notStandardForms',
    // trees:
    beanType: Form.BEAN_TYPE,
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
    beanType: LayoutTemplate.BEAN_TYPE,
    condition_isStandard: 0,
    condition_standardObject: 28511575,
    condition____nav2: 'layoutTemplate',
    rootId: 28512109,
    // id: 28526561,
    action_template: template
  }
  return saveDatabean(config)
}

export async function saveFormFields({formId, fields = []}) {
  const config = {
    formFile: "crm-customer-fields.xml",
    formName: "notStandardFields",
    beanType: Field.BEAN_TYPE,
    // condition____nav1: nonstandard
    condition_standardObject: formId,

    // // databeanChecked:
    // rootId: 28511777,
    // id: 28532557,
    // // databeanName: "textfieldName1",
    // name_en: "textfieldName1",
    // //         databeanDescription:
    // action_placeholder: "textfield1",
    // action_fieldName: "textfield1",
    // action_dataType: "textfield",
  };
  fields.forEach(({id, label, fieldName, dataType, placeholder}) => {
    config.rootId = id;
    config.databeanName = label;
    config.action_placeholder = placeholder;
    config.action_fieldName = fieldName;
    config.action_dataType = dataType;
  });

  return saveDatabean(config);
}

export function deleteFormFields(ids = []){
  const config = {
    formFile:'crm-customer-fields.xml',
    formName:'notStandardFields',
    // id:28533625,
  };
  ids.forEach(id => config.id = id);

  return deleteBeans(config);
}

// export async function loadLayoutTemplate({id, formId}) {
//
//   const config = {
//     type: LayoutTemplate.BEAN_TYPE
//   }
//   if (id)
//     config.rootId = id;
//   else if (formId)
//     config.code = formId;
//
//   const beans = await getBeansMethod(config);
//   const layoutTemplate = beans && new LayoutTemplate(beans[0]);
//   if (!layoutTemplate)
//     throw Error(`There is no layout template bean.`);
//
//   return layoutTemplate.template;
// }

export async function loadForms() {
  const config = {
    beanType: Form.BEAN_TYPE,
  };
  const beans = await getBeans2Method(config);

  return beans.map(bean => new Form(bean));
}

export async function loadFormDependencies({formId}) {
  const config = {
    standardObject: formId
  }
  const beans = await getBeans2Method(config);

  return beans.map(bean => {
    const {beanType} = bean;
    if (beanType === LayoutTemplate.BEAN_TYPE)
      return new LayoutTemplate(bean);
    if (beanType === Field.BEAN_TYPE)
      return new Field(bean);

    return bean;
  })
}
