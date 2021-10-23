import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../helpers/todos'
import { createLogger } from '../../utils/logger'
import { getJwtToken } from '../utils'

const myLogger = createLogger("deleteTodos")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  myLogger.info("Incoming event: ", event)

  const todoId = event.pathParameters.todoId

  if (!todoId) {
    myLogger.error("No ID was provided")
    throw new Error("No ID was provided")
  }

  await deleteTodo(todoId, getJwtToken(event))

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null
  };

}
