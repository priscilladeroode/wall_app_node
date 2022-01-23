import { UpdatePostRequestModel } from '../../../models/posts'

export interface UpdatePostRepository {
  update: (post: UpdatePostRequestModel) => Promise<void>
}
