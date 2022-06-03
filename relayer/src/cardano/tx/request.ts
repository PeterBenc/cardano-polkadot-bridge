import fetch from 'node-fetch'

export class HttpRequestError extends Error {
  readonly httpStatus: number
  readonly headers: Record<string, string>
  readonly responseText: string
  readonly url: string
  readonly method: string

  constructor(
    msg: string,
    httpStatus: number,
    headers: Record<string, string>,
    responseText: string,
    url: string,
    method: string,
  ) {
    super(msg)
    this.httpStatus = httpStatus
    this.headers = headers
    this.responseText = responseText
    this.url = url
    this.method = method
  }
}

export default async function request<T = unknown>(
  url: string,
  method = 'GET',
  body: unknown = null,
  headers = {},
  parseResponse = true,
): Promise<T> {
  let requestParams = {
    method,
    headers,
  }
  if (method.toUpperCase() !== 'GET') {
    requestParams = Object.assign({}, requestParams, {body})
  }
  const response = await fetch(url, requestParams).catch((e) => {
    // http status not present
    throw new Error(
      `${method} ${url} has failed with the following error: ${e}`,
    )
  })

  if (!response) {
    // http status not present
    throw new Error(`No response from ${method} ${url}`)
  }

  const responseText = await response.text()

  if (response.status >= 300) {
    throw new HttpRequestError(
      `${method} ${url} returned error: ${
        response.status
      } on payload: ${JSON.stringify(
        requestParams,
      )} with response: ${responseText}`,
      response.status,
      requestParams.headers,
      responseText,
      url,
      method,
    )
  }

  if (!parseResponse) {
    return responseText as unknown as T
  }

  try {
    return JSON.parse(responseText) as T
  } catch (e) {
    throw new Error(
      `Getting body of response from ${url} has failed with the following error: ${e}`,
    )
  }
}
