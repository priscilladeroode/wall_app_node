import {
  DeletePostRequestEntity,
  DeletePostResponseEntity
} from '@/domain/entities/posts'
import { ResultEnum } from '@/domain/enums/result-enums'
import { DeletePostByIdUseCase } from '@/domain/usecases/posts/delete-post-by-id-usecase'
import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { DeletePostByIdRepository } from '../../protocols/db/posts/delete-post-repository'

export class DBDeletePostById implements DeletePostByIdUseCase {
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
        return ResultEnum.success
      }
      return ResultEnum.forbidden
    }
    return ResultEnum.notFound
  }
}
