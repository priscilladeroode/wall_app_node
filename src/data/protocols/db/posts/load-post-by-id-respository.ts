import {
  LoadPostByIdRequestModel,
  LoadPostByIdResponseModel
} from '../../../models/posts'
export interface LoadPostByIdRepository {
  loadById: (
    model: LoadPostByIdRequestModel
  ) => Promise<LoadPostByIdResponseModel>
}
