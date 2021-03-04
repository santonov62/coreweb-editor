import request from '../../../makeRequest';
import {WEBADMIN_URL} from "../../../config";
import {buildQueryParams} from '../../../helper';

export default async function(data) {
  const queryParams = buildQueryParams(data);
  const url = `${WEBADMIN_URL}/rulesui/MethodAction/getBeans2Method?${queryParams}`;

  const json = await request({
    url
  }).then(res => res.json());

  return json && json.data;
}
