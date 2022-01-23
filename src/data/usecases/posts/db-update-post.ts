import {
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '../../../domain/entities/posts'
import { UpdatePostUseCase } from '../../../domain/usecases/posts/update-post-usecase'
import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { UpdatePostRepository } from '../../protocols/db/posts/update-post-repository'

export class DBUpdatePost implements UpdatePostUseCase {
  constructor (
    private readonly checkPostExistsByIdRepository: CheckPostExistsByIdRepository,
    private readonly updatePostRepository: UpdatePostRepository
  ) {}

  async update (
    post: UpdatePostRequestEntity
  ): Promise<UpdatePostResponseEntity> {
    const exists = await this.checkPostExistsByIdRepository.checkById(post.id)
    if (exists) {
      await this.updatePostRepository.update(post)
    }
    return null
  }
}
