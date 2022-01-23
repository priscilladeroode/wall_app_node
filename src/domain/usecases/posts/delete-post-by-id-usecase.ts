import {
  DeletePostRequestEntity,
  DeletePostResponseEntity
} from '../../entities/posts'

export interface DeletePostByIdUseCase {
  delete: (entity: DeletePostRequestEntity) => Promise<DeletePostResponseEntity>
}
