import request from "../../makeRequest";
import {WEBADMIN_URL} from "../../config";
import {makeFormUrlencoded} from '../../helper';

export default function saveDatabeans(data) {
  const url = `${WEBADMIN_URL}/rulesui/SaveDatabeans`;
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: typeof data === 'object' ? makeFormUrlencoded(data) : data,
  }

  return request(options);
}
