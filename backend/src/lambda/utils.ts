import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  return parseUserId(getJwtToken(event))
}


export function getUserIdFromJWT(jwttoken: string): string {
  return parseUserId(jwttoken)
}

/**
 * Returns the JWT Token from Auth header 
 * @param event 
 * @returns JWT token (non formated or anything like that)
 */
export function getJwtToken(event: APIGatewayProxyEvent): any {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  return split[1]
}