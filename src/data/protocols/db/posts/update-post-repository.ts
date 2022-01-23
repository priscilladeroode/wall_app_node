import {
  UpdatePostRequestModel,
  UpdatePostResponseModel
} from '../../../models/posts'

export interface UpdatePostRepository {
  update: (post: UpdatePostRequestModel) => Promise<UpdatePostResponseModel>
}
