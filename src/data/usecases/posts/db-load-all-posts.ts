import { LoadPostsResponseEntity } from '../../../domain/entities/posts'
import { LoadAllPostsUseCase } from '../../../domain/usecases/posts/load-all-posts-usecase'
import { LoadAllPostsRepository } from '../../protocols/db/posts/load-all-posts-repository'

export class DBLoadAllPosts implements LoadAllPostsUseCase {
  constructor (
    private readonly loadAllPostsRepository: LoadAllPostsRepository
  ) {}

  async loadAll (): Promise<LoadPostsResponseEntity> {
    const posts = await this.loadAllPostsRepository.loadAll()
    return posts
  }
}
