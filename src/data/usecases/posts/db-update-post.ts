import {
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '../../../domain/entities/posts'
import { UpdatePostUseCase } from '../../../domain/usecases/posts/update-post-usecase'
import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { LoadPostByIdRepository } from '../../protocols/db/posts/load-post-by-id-respository'
import { UpdatePostRepository } from '../../protocols/db/posts/update-post-repository'

export class DBUpdatePost implements UpdatePostUseCase {
  constructor (
    private readonly loadPostByIdRepository: LoadPostByIdRepository,
    private readonly checkPostExistsByIdRepository: CheckPostExistsByIdRepository,
    private readonly updatePostRepository: UpdatePostRepository
  ) {}

  async update (
    post: UpdatePostRequestEntity
  ): Promise<UpdatePostResponseEntity> {
    const postCheck = await this.checkPostExistsByIdRepository.checkById(
      post.id
    )
    if (postCheck) {
      if (postCheck.uid === post.uid) {
        await this.updatePostRepository.update(post)
        const result = await this.loadPostByIdRepository.loadById(post.id)
        return result
      }
      return null
    }
    return null
  }
}
