
export default ({
  url = '/',
  method = 'GET',
  header = {},
  body = {}
}) => {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body
  });
}
