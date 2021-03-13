import saveDatabeans from "./webadmin/rulesui/saveDatabeans";
import getBeans2Method from "./webadmin/rulesui/methodAction/getBeans2Method";
import deleteBeans from "./webadmin/rulesui/deleteDatabeans";
import databeanTypesEnum from "./DatabeanTypesEnum";
import {makeFormUrlencoded} from "./helper";

export async function saveFormTemplate({content, formId, rootId, id}) {
  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'layoutTemplate',
    trees: 'standardObject',
    beanType: databeanTypesEnum.LayoutTemplate,
    condition_isStandard: 0,
    condition_standardObject: formId,
    condition____nav2: 'layoutTemplate',
    rootId: rootId,
    id: id,
    action_template: content
  }
  return saveDatabeans(config);
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
  return saveDatabeans(config);
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
  const listConfig = fields.map(({id, label, fieldName, dataType, placeholder, databean = {}}) => {
    const config = {};
    config.id = databean.instanceId;
    config.rootId = databean.rootId;
    config.databeanName = label;
    config.action_placeholder = placeholder;
    config.action_fieldName = fieldName;
    config.action_dataType = dataType;
    return config;
  });
  return saveDatabeans(config, listConfig);
}

export function getFromFields({formId}) {
  const config = {
    standardObject: formId,
    beanType: databeanTypesEnum.Field,
  }
  return getBeans2Method(config);
}

export function deleteFormFields(ids = []) {
  const config = {
    formFile: 'crm-customer-fields.xml',
    formName: 'notStandardFields',
    // id:28533625,
  };
  const listConfig = ids.map(id => ({id}));

  return deleteBeans(config, listConfig);
}

export function getLayoutTemplate({id, formId}) {

  const config = {
    beanType: databeanTypesEnum.LayoutTemplate,
  }
  if (id)
    config.rootId = id;
  else if (formId)
    config.standardObject = formId;

  return getBeans2Method(config)[0];
}

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

export function saveFieldLayoutDefinitions({formId, layoutId, layoutContainerId, fieldsLayoutDefinitions = []}) {
  const config = {
    formFile: 'crm-customer-layout-definitions.xml',
    formName: 'fieldLayout',
    trees: 'layout',
    beanType: databeanTypesEnum.FieldLayoutDefinition,
    pageInoffsetdex: 0,
    orderBy: 'container',
    // orderIndex: 'ASC',
    condition____nav_isStandard: 0,
    condition_standardObject: formId, //crm.config.common.Form -> rootId
    condition_layout: layoutId, //crm.config.common.Layout -> rootId
    condition_container: layoutContainerId,

    // // databeanChecked:
    // rootId: id,
    // // id: 28511784,
    // // databeanName:,
    // // name_ch11:
    // //   name_de:
    // //     name_en:
    // //       name_fr:
    // //         name_it:
    // //           name_la:
    // //             name_nz:
    // //               name_Zr:
    // //                 name_ru:
    // //                   databeanDescription:
    // //                     description_ch11:
    // //                       description_de:
    // //                         description_en:
    // //                           description_fr:
    // //                             description_it:
    // //                               description_la:
    // //                                 description_nz:
    // //                                   description_Zr:
    // //                                     description_ru:
    // // action_container: layoutContainerId, // crm.config.common.LayoutContainer -> rootId
    // // action_placeholder:
    // action_order: 1,
    // action_target: fieldId,  // crm.config.widget.Field -> rootId
    // action_access: access, // required/optional/readonly/hidden
    // // action_fieldValue:
    // //   action_fieldDefault:
  }
  const listConfig = fieldsLayoutDefinitions.map(({id, access, fieldId, databean}, index) => {
    return {
      databeanChecked: '',
      rootId: id,
      id: databean?.instanceId,
      databeanName: '',
      databeanDescription: '',
      action_placeholder: '',
      action_order: index,
      action_target: fieldId,
      action_access: access,
      action_fieldValue: '',
      action_fieldDefault: '',
    }
  });

  return saveDatabeans(config, listConfig);
}

export function getFieldLayoutDefinitions({layoutId}) {
  const config = {
    beanType: databeanTypesEnum.FieldLayoutDefinition,
    layout: layoutId,
  };
  return getBeans2Method(config);
}

export function deleteFieldLayoutDefinitions(ids = []) {
  const config = {
    formFile: 'crm-customer-layout-definitions.xml',
    formName: 'fieldLayout',
  };
  const listConfig = ids.map(id => ({id}));

  return deleteBeans(config, listConfig);
}

export function saveLayoutContainer({rootId, formId, id, name = 'Fields'}) {
  const config = {
    formFile: 'crm-objecttypes.xml',
    formName: 'layoutContainer',
    trees: 'standardObject',
    beanType: databeanTypesEnum.LayoutContainer,
    pageInoffsetdex: 0,
    // orderBy:
    // orderIndex: ASC
    condition_isStandard: 0,
    condition_standardObject: formId, //crm.config.common.Form -> rootId
    // condition____nav2: 'layoutContainer',
    // databeanChecked:
    rootId, // crm.config.common.LayoutContainer -> rootId
    id,
    action_name: name,
  }
  return saveDatabeans(config);
}

export async function getLayoutContainer({formId}) {
  const config = {
    beanType: databeanTypesEnum.LayoutContainer
  };
  if (formId)
    config.standardObject = formId;

  return (await getBeans2Method(config))[0];
}

export function saveLayout({id = '', rootId = '', formId, name = 'default_layout'} = {}) {
  const config = {
    formFile: 'crm-customer-layout-definitions.xml',
    formName: 'layouts',
    trees: 'standardObject',
    beanType: databeanTypesEnum.Layout,
    pageInoffsetdex: 0,
    // orderBy:
    // orderIndex: ASC
    condition____nav_isStandard: 0,
    condition_standardObject: formId,
    databeanChecked: '',
    rootId,
    id,
    databeanName: '',
    //   name_ch11:
    //     name_de:
    //       name_en:
    //         name_fr:
    //           name_it:
    //             name_la:
    //               name_nz:
    //                 name_Zr:
    //                   name_ru:
    action_name: name,
    action_parent: '',
  }
  return saveDatabeans(config);
}

export async function getLayout({formId}) {
  const config = {
    beanType: databeanTypesEnum.Layout,
    standardObject: formId,
  };

  return (await getBeans2Method(config))[0];
}
