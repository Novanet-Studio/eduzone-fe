/**
 * apiRequest
 * @param {string} endpoint - uri to make a request
 * @param {string} method - Http verb method (GET/POST/PUT/DELETE)
 * @param {object} bodyParams - object with necesary body
 */

export const apiRequest = (endpoint, method, bodyParams) => {
  return fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyParams),
  }).then((result) => result.json())
}


export const fetchData = async (endpoint, method='GET', bodyParams={}) => {
  const hasBody = !!Object.keys(bodyParams).length

  if (hasBody) {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    })
    return response.json()
  } else {
    const response = await fetch(endpoint)
    return response.json()
  }
}