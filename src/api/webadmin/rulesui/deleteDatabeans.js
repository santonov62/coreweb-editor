import {WEBADMIN_URL} from "../../config";
import {makeFormUrlencoded} from "../../helper";
import request from "../../makeRequest";

export default function deleteBeans(data, listConfig = []) {
  const url = `${WEBADMIN_URL}/rulesui/DeleteDatabeans`;
  let body = makeFormUrlencoded(data);
  listConfig.forEach(config => {
    body += `&${makeFormUrlencoded(config)}`;
  });
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  }

  return request(options);
}
