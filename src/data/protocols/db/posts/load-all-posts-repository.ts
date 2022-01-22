import { LoadPostsResponseModel } from '../../../models/posts'

export interface LoadAllPostsRepository {
  loadAll: () => Promise<LoadPostsResponseModel>
}
