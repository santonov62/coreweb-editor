import request from '../../../makeRequest';
import {WEBADMIN_URL} from "../../../config";

export default function(data) {
  data = {
    isStandard: 0,
    beanType: 'crm.config.common.Form',
    ___AppName: 'webadmin',
  }
  const queryParams = buildQueryParams(data);
  const url = `${WEBADMIN_URL}/rulesui/MethodAction/getBeans2Method?${queryParams}`;

  return request({
    url
  });
}

function buildQueryParams(data) {
  if (!data || Object.keys(data).length === 0)
    return ``;

  const params = [];
  for (const[key, value] of data.entries()) {
    params.push(`${key}=${value}`);
  }
  return params.join('&');
}
