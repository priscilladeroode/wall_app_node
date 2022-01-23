import {
  LoadPostsByUidRequestEntity,
  LoadPostsResponseEntity
} from '../../entities/posts'

export interface LoadPostsByUidUseCase {
  loadByUid: (
    entity: LoadPostsByUidRequestEntity
  ) => Promise<LoadPostsResponseEntity>
}
