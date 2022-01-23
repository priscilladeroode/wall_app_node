import { DBLoadPostById } from '../../../../data/usecases/posts/db-load-post-by-id'
import { LoadPostByIdUseCase } from '../../../../domain/usecases/posts/load-post-by-id-usecase'
import { PostMongoRepository } from '../../../../infra/db/mongodb/post-mongo-repository'

export const makeLoadPostByIdUseCase = (): LoadPostByIdUseCase => {
  const repository = new PostMongoRepository()
  return new DBLoadPostById(repository)
}
