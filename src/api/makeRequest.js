
export default ({
  url = '/',
  method = 'GET',
  headers,
  body
}) => {
  const options = {
    method,
    credentials: "same-origin",
    redirect: 'manual',
  }
  if (body)
    options.body = body
  if (headers)
    options.headers = headers

  return fetch(url, options);
}
