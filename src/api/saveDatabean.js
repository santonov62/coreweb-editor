import request from "./makeRequest";
import {WEBADMIN_URL} from "./config";

export default function saveDatabean(databean) {
  const url = `${WEBADMIN_URL}/rulesui/SaveDatabeans`;

  return request({
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: makeBody(databean)
  })
}

function makeBody(data) {
  let formBody = [];
  for (const property in data) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
}
