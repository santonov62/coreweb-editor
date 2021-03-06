import {WEBADMIN_URL} from "../../config";
import {makeFormUrlencoded} from "../../helper";
import request from "../../makeRequest";

export default function deleteBeans(data) {
  const url = `${WEBADMIN_URL}/rulesui/DeleteDatabeans`;
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: makeFormUrlencoded(data)
  }

  return request(options);
}
