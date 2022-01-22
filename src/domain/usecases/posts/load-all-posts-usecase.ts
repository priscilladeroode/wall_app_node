import { LoadPostsResponseEntity } from '../../entities/posts'

export interface LoadAllPostsUseCase {
  loadAll: () => Promise<LoadPostsResponseEntity>
}
