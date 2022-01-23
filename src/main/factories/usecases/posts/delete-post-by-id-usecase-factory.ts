import { DBDeletePost } from '../../../../data/usecases/posts/db-delete-post'
import { DeletePostUseCase } from '../../../../domain/usecases/posts/delete-post-usecase'
import { PostMongoRepository } from '../../../../infra/db/mongodb/post-mongo-repository'

export const makeDeletePostByIdUseCase = (): DeletePostUseCase => {
  const repository = new PostMongoRepository()
  return new DBDeletePost(repository, repository)
}
