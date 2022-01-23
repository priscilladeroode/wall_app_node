import {
  LoadPostsByUidRequestModel,
  LoadPostsResponseModel
} from '../../../models/posts'

export interface LoadPostsByUidRepository {
  loadByUid: (
    model: LoadPostsByUidRequestModel
  ) => Promise<LoadPostsResponseModel>
}
