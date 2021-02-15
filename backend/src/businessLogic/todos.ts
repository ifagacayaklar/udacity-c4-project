import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()
const bucketName = process.env.TODOS_S3_BUCKET

export async function getTodos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getTodos(userId)
}

export async function createTodo(
    userId: string,
    newTodo: CreateTodoRequest,    
): Promise<TodoItem> {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()

    const newItem = {
        userId: userId,
        createdAt: createdAt,
        todoId: todoId,
        done: false,
        ...newTodo,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
      }
    
   return await todoAccess.createTodo(newItem) 
}

export async function updateTodo(
    userId: string, 
    todoId: string, 
    updatedTodo: UpdateTodoRequest 
){
    await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(
    userId: string, 
    todoId: string, 
     
){
    await todoAccess.deleteTodo(userId, todoId)
}





