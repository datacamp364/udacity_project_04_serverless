import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../helpers/todos'
import { createLogger } from '../../utils/logger'

const myLogger = createLogger("generateUploadURL")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId = event.pathParameters.todoId

  if (!todoId) {

    myLogger.info(`could not generate upload url because todoId is missing in the request`);

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: "Missing path parameter todoId" })
    };
  }

  const uploadUrl = generateUploadUrl(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
  /*
  myLogger.info("Incoming event: ", event)

  const todoId = event.pathParameters.todoId

  if (!todoId) {
    myLogger.error("No ID was provided")
    throw new Error("No ID was provided")
  }

  const presignedURL = await generateUploadUrl(todoId)

  myLogger.info("Returning following signedURL: " + presignedURL)
  myLogger.info("Thats how it looks with stringify: ", JSON.stringify({
    presignedURL
  }))

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      presignedURL
    })
  }*/
}
