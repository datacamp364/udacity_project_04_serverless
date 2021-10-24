/**
 * AWS-SPECIFIC! This code is very AWS / vendor specific and contatins code to directly
 * connect to a DynamoDB database (which is AWS specific)
 */
import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoUpdate } from '../../models/TodoUpdate'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'
import { getUserIdFromJWT } from '../utils'

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const myLogger = createLogger("todoAccess")

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODO_TABLE) {
    }

    /**
     *  ##################### NOW THE CRUD OPERATIONS FOLLOW #####################
     */



    /**
     * Creates a new TODO item 
     * @param todoItem item that has to be created 
     * @returns newly created item 
     */
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()

        return todoItem
    }

    /**
     * Returns all TODO items for a specific user 
     * @returns 
     */
    async getAllTodoItems(jwtToken: string): Promise<TodoItem[]> {
        myLogger.info('Getting all todo items')

        const userId = getUserIdFromJWT(jwtToken)

        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    /**
     * Deletes a TODO item
     * @param todoId 
     * @param userId 
     * @returns 
     */
    async deleteTodoItem(todoId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId
            }
        }).promise()
    }

    /**
     * Updates a specific TODO item 
     * @param todoId 
     * @param userId 
     * @param updatedTodo 
     * @returns 
     */
    async updateTodoItem(todoId: string, userId: string, newTODO: TodoUpdate): Promise<TodoUpdate> {
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId,
                "userId": userId
            },
            UpdateExpression: "set #n=:name, dueDate=:duedate, done=:done",
            ExpressionAttributeValues: {
                ":name": newTODO.name,
                ":duedate": newTODO.dueDate,
                ":done": newTODO.done
            },
            ExpressionAttributeNames: {
                "#n": "name"
            }
        }).promise()

        return newTODO
    }
}

/**
 * Creates a DynamoDB client in a way that supports local deployment 
 * @returns DynamoDB client
 */
function createDynamoDBClient() {
    console.log('Creating a local DynamoDB instance')

    if (process.env.IS_OFFLINE) {
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
