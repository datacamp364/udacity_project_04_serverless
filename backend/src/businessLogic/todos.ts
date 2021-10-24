/**
 * Contains the business logic for handling TODOs 
 * 
 * In theory this whole logic can be moved to another vendor if needed, because nothing AWS
 * specific is used here 
 */

// external dependencies 
import * as uuid from 'uuid'

// internal dependencies 
import { TodoItem } from "../../models/TodoItem"
import { TodoUpdate } from "../../models/TodoUpdate"
import { CreateTodoRequest } from "../../requests/CreateTodoRequest"
import { parseUserId } from "../../auth/utils"
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest"
import { TodoAccess } from "../helpers/todoAccess"

const todoAccess = new TodoAccess()
import { getUploadUrl } from "./attachmentUtils"

const bucketName = process.env.ATTACHEMENT_S3_BUCKET;

/**
 * Getting TODO items per user (from JWT Token)
 * @param jwtToken used token to identify the user 
 * @returns list of TODO items 
 */
export async function getTodosPerUser(jwtToken: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodoItems(jwtToken)
}

/**
 * Creates a new TODO item in the databases and generates a new unique ID with UUID 
 * @param createTodoRequest DTO that contains information provided by UI for a new TODO item 
 * @param jwtToken token to identify the user 
 * @returns When successful then the newely created TODO item as JSON 
 */
export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {
    const new_todo_id = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await todoAccess.createTodoItem({
        todoId: new_todo_id,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${new_todo_id}`
    })
}

/**
 * Updates an existing TODO item in database 
 * @param todoId Existing TODO items id that has to be updated 
 * @param updatedTodo DTO that contains the changes to update 
 * @param jwtToken token to identify the user 
 * @returns When successful then the updated TODO item as JSON
 */
export async function updateTodo(
    todoId: string,
    updatedTodo: UpdateTodoRequest,
    jwtToken: string
): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken)

    return await todoAccess.updateTodoItem(todoId, userId, updatedTodo)
}

/**
 * Deletes existing TODO item with provided ID 
 * @param todoId ID of TODO item that has to be deleted 
 * @param jwtToken token to identify the user 
 * @returns When successful then the updated TODO item as JSON
 */
export async function deleteTodo(todoId: string, jwtToken: string) {
    const userId = parseUserId(jwtToken)
    return await todoAccess.deleteTodoItem(todoId, userId)
}

/**
 * Returns back the signed attachement URL by using another component 
 * @param todoId ID of the affacted TODO item 
 * @returns signed S3 URL 
 */
export function generateUploadUrl(todoId: string): string {
    return getUploadUrl(todoId)
}