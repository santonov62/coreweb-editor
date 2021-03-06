export function makeFormUrlencoded(data) {
  let formData = [];
  for (const property in data) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(data[property]);
    formData.push(encodedKey + "=" + encodedValue);
  }
  formData = formData.join("&");
  return formData;
}

export function buildQueryParams(data) {
  if (!data || Object.keys(data).length === 0)
    return ``;

  const params = [];
  for (const [key, value] of Object.entries(data)) {
    params.push(`${key}=${value}`);
  }
  return params.join('&');
}
