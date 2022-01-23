import { LoadPostsResponseEntity } from '../../entities/posts'

export interface LoadPostsByUidUseCase {
  loadByUid: () => Promise<LoadPostsResponseEntity>
}
