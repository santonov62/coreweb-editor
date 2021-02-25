
export default ({
  url = '/',
  method = 'GET',
  header = {},
  body
}) => {
  const options = {
    method,
    credentials: "same-origin",
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }
  if (body)
    options.body = body

  return fetch(url, options);
}
