import request from "../../makeRequest";
import {WEBADMIN_URL} from "../../config";
import {makeFormUrlencoded} from '../../helper';

export default function saveDatabeans(data, listConfig = []) {
  const url = `${WEBADMIN_URL}/rulesui/SaveDatabeans`;
  let body = makeFormUrlencoded(data);
  listConfig.forEach(config => {
    body += `&${makeFormUrlencoded(config)}`;
  });
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body,
  }

  return request(options);
}
