import saveDatabean from "./webadmin/rulesui/saveDatabean";
import getBeans2Method from "./webadmin/rulesui/methodAction/getBeans2Method";
import deleteBeans from "./webadmin/rulesui/deleteDatabeans";
import databeanTypesEnum from "./DatbeanTypeEnum";
import {makeFormUrlencoded} from "./helper";

export async function saveFormTemplate({template}) {
  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'layoutTemplate',
    trees: 'standardObject',
    beanType: databeanTypesEnum.LayoutTemplate,
    condition_isStandard: 0,
    condition_standardObject: 28511575,
    condition____nav2: 'layoutTemplate',
    rootId: 28512109,
    // id: 28526561,
    action_template: template
  }
  return saveDatabean(config)
}

export function saveForm({instanceId, rootId, name}) {

  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'allObjects',
    // trees:
    beanType: databeanTypesEnum.Form,
    // pageInoffsetdex: 0
    // orderBy: name
    // orderIndex: ASC
    // databeanChecked:
    rootId,
    id: instanceId,
    action_name: name,
    action_isStandard: 0
  }
  return saveDatabean(config);
}

export async function saveFormFields({formId, fields = []}) {
  let body = ``;
  const config = {
    formFile: "crm-customer-fields.xml",
    formName: "notStandardFields",
    beanType: databeanTypesEnum.Field,
    condition____nav1: "nonstandard",
    condition_standardObject: formId,
  };
  body += makeFormUrlencoded(config);
  fields.forEach(({id, label, fieldName, dataType, placeholder, databean = {}}) => {
    const config = {};
    config.id = databean.instanceId;
    config.rootId = databean.rootId;
    config.databeanName = label;
    config.action_placeholder = placeholder;
    config.action_fieldName = fieldName;
    config.action_dataType = dataType;
    body += `&${makeFormUrlencoded(config)}`;
  });
  console.log(body);
  return saveDatabean(body);
}

export function deleteFormFields(ids = []) {
  const config = {
    formFile: 'crm-customer-fields.xml',
    formName: 'notStandardFields',
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

export function getForms({name} = {}) {
  const config = {
    beanType: databeanTypesEnum.Form
  };
  if (name)
    config.name = name;

  return getBeans2Method(config);
}

export async function getForm({name}) {
  return (await getForms({name}))[0];
}

export async function getFormDependencies({formId}) {
  const config = {
    standardObject: formId
  }
  return await getBeans2Method(config);
}
