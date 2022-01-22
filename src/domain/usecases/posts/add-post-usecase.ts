import {
  AddPostRequestEntity,
  AddPostResponseEntity
} from '../../entities/posts'

export interface AddPostUseCase {
  add: (post: AddPostRequestEntity) => Promise<AddPostResponseEntity>
}
