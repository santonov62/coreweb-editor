import request from '../../../makeRequest';
import {WEBADMIN_URL} from "../../../config";

// dqlQuery=where:+[{"(databean)ROOTID":+"28511575"+}]


export default function(data) {
  data = {
    rootId: 28511575
  }
  const queryParams = buildQueryParams(data);
  const url = `${WEBADMIN_URL}/rulesui/MethodAction/getBeansMethod?${queryParams}`;

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
