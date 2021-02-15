import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils'

const logger = createLogger('getTodos')

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)

  // TODO: correct it for dev
  const userId = getUserId(event)  
  // const userId = "admin" 
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try{
    logger.info('Trying to update item', {
      userId: userId,
      todoId: todoId
    })
    await updateTodo(userId, todoId, updatedTodo)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }  
  }catch(e){
    logger.info('Error updating item', {
      message: e.message
    })
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }

}


async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
  await docClient.update({
    TableName:todosTable,
    Key:{
        "userId": userId,
        "todoId": todoId
    }, 
    UpdateExpression: "set #namefield = :name, dueDate = :dueDate, done = :done",
    ExpressionAttributeValues:{
      ":name": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
    },
    ExpressionAttributeNames:
    { "#namefield": "name" },
  }).promise()
}

