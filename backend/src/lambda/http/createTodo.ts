import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { createLogger } from '../../utils/logger'
import {getUserId} from '../utils'

const logger = createLogger('getTodos')

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.TODOS_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing event", event)

  // TODO: correct it for dev
  const userId = getUserId(event)
  // const userId = "admin" 

  const todoId = uuid.v4()
  
  const newItem = await createTodo(userId, todoId, event)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}


async function createTodo(userId: string, todoId: string, event: any){
  const createdAt = new Date().toISOString()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = {
    userId: userId,
    createdAt: createdAt,
    todoId: todoId,
    done: false,
    ...newTodo,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  logger.info('Storing new item', newItem)

  await docClient
  .put({
    TableName: todosTable,
    Item: newItem
  })
  .promise()

  return newItem
}