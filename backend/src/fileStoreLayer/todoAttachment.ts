import * as AWS  from 'aws-sdk'


export class TodoAttachment {
    constructor(
        private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
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