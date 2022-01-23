import { PostEntity } from '../../entities/posts'

export interface LoadPostsByIdUseCase {
  loadById: (id: string) => Promise<PostEntity>
}
