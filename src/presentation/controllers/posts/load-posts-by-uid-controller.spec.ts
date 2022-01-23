import {
  LoadPostsResponseEntity,
  PostEntity
} from '../../../domain/entities/posts'
import { ServerError } from '../../errors'
import { ok, serverError } from '../../helpers/http'

import faker from 'faker'
import { LoadPostsByUidController } from './load-posts-by-uid-controller'
import { LoadPostsByUidUseCase } from '../../../domain/usecases/posts/load-posts-by-uid-usecase'

type SutTypes = {
  sut: LoadPostsByUidController
  loadPostsByUidUseCaseStub: LoadPostsByUidUseCase
}

const request = {
  body: {}
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdAt = faker.datatype.datetime()
const createdBy = faker.name.findName()

const postEntity: PostEntity = { id, title, content, createdAt, createdBy }

const loadPostsResponseEntity: LoadPostsResponseEntity = [
  postEntity,
  postEntity
]

const makeLoadPostsByUidUseCaseStub = (): LoadPostsByUidUseCase => {
  class LoadPostsByUidUseCaseStub implements LoadPostsByUidUseCase {
    async loadByUid (): Promise<LoadPostsResponseEntity> {
      return await Promise.resolve(loadPostsResponseEntity)
    }
  }
  return new LoadPostsByUidUseCaseStub()
}

const makeSut = (): SutTypes => {
  const loadPostsByUidUseCaseStub = makeLoadPostsByUidUseCaseStub()
  const sut = new LoadPostsByUidController(loadPostsByUidUseCaseStub)
  return {
    sut,
    loadPostsByUidUseCaseStub
  }
}

describe('LoadPostsByUidController', () => {
  test('Shoud return 500 if LoadPostsByUidUseCase throws', async () => {
    const { sut, loadPostsByUidUseCaseStub } = makeSut()
    jest
      .spyOn(loadPostsByUidUseCaseStub, 'loadByUid')
      .mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 200 if LoadAllPostsUseCase returns posts', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(loadPostsResponseEntity))
  })
})
