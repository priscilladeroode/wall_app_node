import {
  DeletePostRequestEntity,
  DeletePostResponseEntity
} from '../../../domain/entities/posts'
import { DeletePostUseCase } from '../../../domain/usecases/posts/delete-post-usecase'
import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'

export class DBDeletePost implements DeletePostUseCase {
  constructor (
    private readonly checkPostExistsByIdRepository: CheckPostExistsByIdRepository
  ) {}

  async delete (
    entity: DeletePostRequestEntity
  ): Promise<DeletePostResponseEntity> {
    await this.checkPostExistsByIdRepository.checkById(entity.id)
    return null
  }
}
