import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils'
import {deleteTodo} from '../../businessLogic/todos';

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)
  const userId = getUserId(event)  
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

