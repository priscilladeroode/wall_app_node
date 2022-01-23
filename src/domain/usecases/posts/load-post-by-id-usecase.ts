import { PostEntity } from '../../entities/posts'

export interface LoadPostByIdUseCase {
  loadById: (id: string) => Promise<PostEntity>
}
