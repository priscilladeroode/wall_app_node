import {
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '../../../domain/entities/posts'
import { UpdatePostUseCase } from '../../../domain/usecases/posts/update-post-usecase'
import { UpdatePostRepository } from '../../protocols/db/posts/update-post-repository'

export class DBUpdatePost implements UpdatePostUseCase {
  constructor (private readonly updatePostRepository: UpdatePostRepository) {}

  async update (
    post: UpdatePostRequestEntity
  ): Promise<UpdatePostResponseEntity> {
    await this.updatePostRepository.update(post)
    return null
  }
}
