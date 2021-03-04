import {WEBADMIN_URL} from "../../config";
import request from "../../makeRequest";
import {makeFormUrlencoded} from '../../helper';

export default function ({beanType, ...data}) {
  const url = `${WEBADMIN_URL}/rulesui/save/${beanType}`;
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
