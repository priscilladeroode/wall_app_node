import { DBLoadAllPosts } from '../../../../data/usecases/posts/db-load-all-posts'
import { LoadAllPostsUseCase } from '../../../../domain/usecases/posts/load-all-posts-usecase'
import { PostMongoRepository } from '../../../../infra/db/mongodb/post-mongo-repository'

export const makeLoadAllPostUseCase = (): LoadAllPostsUseCase => {
  const repository = new PostMongoRepository()
  return new DBLoadAllPosts(repository)
}
