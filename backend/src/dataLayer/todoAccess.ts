import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {

    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getTodos (userId:string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
          TableName: this.todosTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        }).promise()
      
        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(newItem: TodoItem): Promise<TodoItem> {
        await this.docClient
        .put({
          TableName: this.todosTable,
          Item: newItem
        })
        .promise()
      
        return newItem
    }

    async updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate){
        await this.docClient.update({
            TableName: this.todosTable,
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

    async deleteTodo(userId: string, todoId: string) {
        await this.docClient.delete({
            TableName:this.todosTable,
            Key:{
                "userId": userId,
                "todoId": todoId
            } 
          }).promise()
    }
    
}