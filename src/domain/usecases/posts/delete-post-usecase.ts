import { DeletePostResponseEntity } from '../../entities/posts/delete-post-response-entity'

export interface DeletePostUseCase {
  delete: (postId: string) => Promise<DeletePostResponseEntity>
}
