import request from "../../makeRequest";
import {WEBADMIN_URL} from "../../config";
import {makeFormUrlencoded} from '../../helper';

export default function saveDatabean(data) {
  const url = `${WEBADMIN_URL}/rulesui/SaveDatabeans`;
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: makeFormUrlencoded(data)
  }

  return request(options);
}
