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

export function makeFormData(data) {
  const formData  = new FormData();
  for(const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
}
