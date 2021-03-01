import request from '../../../makeRequest';
import {WEBADMIN_URL} from "../../../config";

// dqlQuery=where:+[{"(databean)ROOTID":+"28511575"+}]


export default function(data) {
  // data = {
  //   rootId: 28511575
  // }
  const queryParams = buildQueryParams(data);
  const url = `${WEBADMIN_URL}/rulesui/MethodAction/getBeansMethod?${queryParams}`;

  return request({
    url
  })
    .then(res => res.json())
    .then(json => json.data);
}

function buildQueryParams(data) {
  if (!data || Object.keys(data).length === 0)
    return ``;

  const params = [];
  for (const[key, value] of Object.entries(data)) {
    params.push(`${key}=${value}`);
  }
  return params.join('&');
}
