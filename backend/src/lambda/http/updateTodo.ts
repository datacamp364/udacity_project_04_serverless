import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../helpers/todos'
import { getJwtToken } from '../utils'
import { createLogger } from '../../utils/logger'

const myLogger = createLogger("updateTodos")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  myLogger.info("Incoming event: ", event)

  const todoId = event.pathParameters.todoId
  const newTODO: UpdateTodoRequest = JSON.parse(event.body)

  if (!todoId) {
    myLogger.error("No ID was provided")
    throw new Error("No ID was provided")
  }

  if (!newTODO) {
    myLogger.error("No information to update provided")
    throw new Error("No information to update provided")
  }

  // TODO: Update a TODO item with the provided id using values in the "newTODO" object
  const updatedTODO = await updateTodo(todoId, newTODO, getJwtToken(event))

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedTODO
    })
  }


}
