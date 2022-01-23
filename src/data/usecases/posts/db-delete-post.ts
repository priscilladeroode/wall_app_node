import {
  DeletePostRequestEntity,
  DeletePostResponseEntity
} from '../../../domain/entities/posts'
import { DeletePostUseCase } from '../../../domain/usecases/posts/delete-post-usecase'
import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { DeletePostByIdRepository } from '../../protocols/db/posts/delete-post-repository'

export class DBDeletePost implements DeletePostUseCase {
  constructor (
    private readonly checkPostExistsByIdRepository: CheckPostExistsByIdRepository,
    private readonly deletePostByIdRepository: DeletePostByIdRepository
  ) {}

  async delete (
    entity: DeletePostRequestEntity
  ): Promise<DeletePostResponseEntity> {
    const post = await this.checkPostExistsByIdRepository.checkById(entity.id)
    if (post) {
      if (post.uid === entity.uid) {
        await this.deletePostByIdRepository.deleteById(entity.id)
        return { message: 'Post deleted succesfully' }
      }
      return { error: 'forbidden' }
    }
    return { error: 'not_found' }
  }
}
