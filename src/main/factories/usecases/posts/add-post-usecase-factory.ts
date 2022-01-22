import { DBAddPost } from '../../../../data/usecases/posts/db-add-post'
import { AddPostUseCase } from '../../../../domain/usecases/posts/add-post-usecase'
import { PostMongoRepository } from '../../../../infra/db/mongodb/post-mongo-repository'

export const makeAddPostUseCase = (): AddPostUseCase => {
  const repository = new PostMongoRepository()
  return new DBAddPost(repository)
}
