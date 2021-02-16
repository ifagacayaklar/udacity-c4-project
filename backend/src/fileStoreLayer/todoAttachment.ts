import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAttachment {
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = process.env.TODOS_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }

    getUploadUrl(todoId: string) {
        return this.s3.getSignedUrl('putObject', {
          Bucket: this.bucketName,
          Key: todoId,
          Expires: parseInt(this.urlExpiration)
        })
    }
}