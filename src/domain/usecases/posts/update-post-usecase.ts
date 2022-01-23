import {
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '../../entities/posts'

export interface UpdatePostUseCase {
  update: (post: UpdatePostRequestEntity) => Promise<UpdatePostResponseEntity>
}
