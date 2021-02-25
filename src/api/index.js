import saveDatabean from "./saveDatabean";

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
    // name_ch11:
    //   name_de:
    //     name_en:
    //       name_fr:
    //         name_it:
    //           name_la:
    //             name_nz:
    //               name_Zr:
    //                 name_ru:
    action_name: 'coreweb_components',
    action_type: 'crm.object.cwcomponents',
    action_transient: 0
  };
  return saveDatabean(config);
}

export async function saveFormTemplate(template) {
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
