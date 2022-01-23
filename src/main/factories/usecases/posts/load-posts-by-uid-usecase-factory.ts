import { DBLoadPostsByUid } from '../../../../data/usecases/posts/db-load-posts-by-uid'
import { LoadPostsByUidUseCase } from '../../../../domain/usecases/posts/load-posts-by-uid-usecase'
import { PostMongoRepository } from '../../../../infra/db/mongodb/post-mongo-repository'

export const makeLoadPostsByUidUseCase = (): LoadPostsByUidUseCase => {
  const repository = new PostMongoRepository()
  return new DBLoadPostsByUid(repository)
}
