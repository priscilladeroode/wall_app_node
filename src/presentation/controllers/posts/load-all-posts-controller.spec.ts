import {
  LoadPostsResponseEntity,
  PostEntity
} from '../../../domain/entities/posts'
import { LoadAllPostsUseCase } from '../../../domain/usecases/posts/load-all-posts-usecase'
import { ServerError } from '../../errors'
import { serverError } from '../../helpers/http'
import { LoadAllPostsController } from './load-all-posts-controller'

import faker from 'faker'

type SutTypes = {
  sut: LoadAllPostsController
  loadAllPostsUseCaseStub: LoadAllPostsUseCase
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

const makeLoadAllPostsUseCase = (): LoadAllPostsUseCase => {
  class LoadAllPostsUseCaseStub implements LoadAllPostsUseCase {
    async loadAll (): Promise<LoadPostsResponseEntity> {
      return await Promise.resolve(loadPostsResponseEntity)
    }
  }
  return new LoadAllPostsUseCaseStub()
}

const makeSut = (): SutTypes => {
  const loadAllPostsUseCaseStub = makeLoadAllPostsUseCase()
  const sut = new LoadAllPostsController(loadAllPostsUseCaseStub)
  return {
    sut,
    loadAllPostsUseCaseStub
  }
}

describe('AddPostController', () => {
  test('Shoud return 500 if LoadAllPostsUseCase throws', async () => {
    const { sut, loadAllPostsUseCaseStub } = makeSut()
    jest
      .spyOn(loadAllPostsUseCaseStub, 'loadAll')
      .mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })
    const request = {
      body: {}
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })
})
