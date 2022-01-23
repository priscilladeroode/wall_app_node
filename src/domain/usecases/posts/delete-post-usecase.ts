import {
  DeletePostRequestEntity,
  DeletePostResponseEntity
} from '../../entities/posts'

export interface DeletePostUseCase {
  delete: (entity: DeletePostRequestEntity) => Promise<DeletePostResponseEntity>
}
