import request from '../../../makeRequest';
import {WEBADMIN_URL} from "../../../config";
import {buildQueryParams} from '../../../helper';

// dqlQuery=where:+[{"(databean)ROOTID":+"28511575"+}]
// data = {
//   rootId: 28511575
// }
export default async function(data) {
  const queryParams = buildQueryParams(data);
  const url = `${WEBADMIN_URL}/rulesui/MethodAction/getBeansMethod?${queryParams}`;

  const json = await request({
    url
  }).then(res => res.json());

  return json && json.data;
}
