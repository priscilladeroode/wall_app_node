import {
  LoadPostsByUidRequestEntity,
  LoadPostsResponseEntity
} from '../../../domain/entities/posts'
import { LoadPostsByUidUseCase } from '../../../domain/usecases/posts/load-posts-by-uid-usecase'
import { LoadPostsByUidRepository } from '../../protocols/db/posts/load-posts-by-uid-repository'

export class DBLoadPostsByUid implements LoadPostsByUidUseCase {
  constructor (
    private readonly loadPostsByUidRepository: LoadPostsByUidRepository
  ) {}

  async loadByUid (
    entity: LoadPostsByUidRequestEntity
  ): Promise<LoadPostsResponseEntity> {
    const posts = await this.loadPostsByUidRepository.loadByUid({
      uid: entity.uid
    })
    return posts
  }
}
