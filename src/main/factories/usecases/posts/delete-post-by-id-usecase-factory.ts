import { DBDeletePostById } from '@/data/usecases/posts/db-delete-post-by-id'
import { DeletePostByIdUseCase } from '@/domain/usecases/posts/delete-post-by-id-usecase'
import { PostMongoRepository } from '@/infra/db/mongodb/post-mongo-repository'

export const makeDeletePostByIdUseCase = (): DeletePostByIdUseCase => {
  const repository = new PostMongoRepository()
  return new DBDeletePostById(repository, repository)
}
