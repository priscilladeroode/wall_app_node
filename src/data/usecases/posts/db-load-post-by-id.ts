import { PostEntity } from '@/domain/entities/posts'
import { LoadPostByIdUseCase } from '@/domain/usecases/posts/load-post-by-id-usecase'
import { LoadPostByIdRepository } from '../../protocols/db/posts/load-post-by-id-respository'

export class DBLoadPostById implements LoadPostByIdUseCase {
  constructor (
    private readonly loadPostByIdRepository: LoadPostByIdRepository
  ) {}

  async loadById (id: string): Promise<PostEntity> {
    const posts = await this.loadPostByIdRepository.loadById(id)
    return posts
  }
}
