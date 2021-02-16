const WEBADMIN_URL = `https://helios.mediaspectrum.net/webadmin`

function saveDatabean(databean) {
  let formBody = [];
  for (const property in databean) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(databean[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const url = `${WEBADMIN_URL}/rulesui/SaveDatabeans`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  });
}

export async function saveForm(params) {
  return saveDatabean(params);
}
