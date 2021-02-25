import request from "./makeRequest";
import {WEBADMIN_URL} from "./config";

export default function saveDatabean(data) {
  const url = `${WEBADMIN_URL}/rulesui/SaveDatabeans`;

  return request({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: makeFormData(data)
  })
}

function makeFormData(data) {
  let formData = [];
  for (const property in data) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(data[property]);
    formData.push(encodedKey + "=" + encodedValue);
  }
  formData = formData.join("&");
  return formData;
}
