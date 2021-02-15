import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
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
  
  try{
    logger.info('Trying to delete item', {
      userId: userId,
      todoId: todoId
    })
    await deleteTodo(userId, todoId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }  
  }catch(e){
    logger.info('Error deleting item', {
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

async function deleteTodo(userId: string, todoId: string) {
  await docClient.delete({
    TableName:todosTable,
    Key:{
        "userId": userId,
        "todoId": todoId
    } 
  }).promise()
}

