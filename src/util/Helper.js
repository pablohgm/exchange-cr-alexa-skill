/**
 * Model Response Object
 * @param statusCode
 * @param message
 * @param event
 * @return {{headers: {'Access-Control-Allow-Origin': string, 'Access-Control-Allow-Credentials': boolean}, statusCode: *, body: string, path: *}}
 */
const Response = (statusCode, message, event) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials' : true
    },
    statusCode,
    body: JSON.stringify({
      message,
      path: event.path
    }),
  }
}

export {
  Response
}