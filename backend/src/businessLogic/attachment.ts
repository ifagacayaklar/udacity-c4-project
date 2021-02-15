import { TodoAttachment } from '../fileStoreLayer/todoAttachment'

const todoAttachment = new TodoAttachment()

export function getUploadUrl(todoId: string) {
    return todoAttachment.getUploadUrl(todoId)
}


