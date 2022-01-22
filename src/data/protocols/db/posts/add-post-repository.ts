import {
  AddPostRequestModel,
  AddPostResponseModel
} from '../../../models/posts'

export interface AddPostRepository {
  add: (post: AddPostRequestModel) => Promise<AddPostResponseModel>
}
