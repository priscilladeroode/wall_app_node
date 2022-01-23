import { DBUpdatePost } from '../../../../data/usecases/posts/db-update-post'
import { UpdatePostUseCase } from '../../../../domain/usecases/posts/update-post-usecase'
import { PostMongoRepository } from '../../../../infra/db/mongodb/post-mongo-repository'

export const makeUpdatePostUseCase = (): UpdatePostUseCase => {
  const repository = new PostMongoRepository()
  return new DBUpdatePost(repository, repository, repository)
}
