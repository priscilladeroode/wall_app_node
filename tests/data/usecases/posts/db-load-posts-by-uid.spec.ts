import faker from 'faker'
import {
  LoadPostsByUidRequestModel,
  LoadPostsResponseModel,
  PostModel
} from '@/data/models/posts'
import { LoadPostsByUidRequestEntity } from '@/domain/entities/posts'
import { LoadPostsByUidUseCase } from '@/domain/usecases/posts/load-posts-by-uid-usecase'
import { LoadPostsByUidRepository } from '@/data/protocols/db/posts/load-posts-by-uid-repository'
import { DBLoadPostsByUid } from '@/data/usecases/posts/db-load-posts-by-uid'

interface SutTypes {
  sut: LoadPostsByUidUseCase
  loadPostsByUidRepositoryStub: LoadPostsByUidRepository
}

const uid = faker.datatype.uuid()
const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdBy = faker.name.findName()
const createdAt = faker.datatype.datetime()

const request: LoadPostsByUidRequestEntity = { uid }

const post: PostModel = {
  id,
  title,
  content,
  createdBy,
  createdAt
}

const loadPostResponseModel: LoadPostsResponseModel = [post, post]

const makeLoadPostsByUidRepositoryStub = (): LoadPostsByUidRepository => {
  class LoadPostsByUidRepositoryStub implements LoadPostsByUidRepository {
    async loadByUid (
      model: LoadPostsByUidRequestModel
    ): Promise<LoadPostsResponseModel> {
      return await Promise.resolve(loadPostResponseModel)
    }
  }
  return new LoadPostsByUidRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPostsByUidRepositoryStub = makeLoadPostsByUidRepositoryStub()
  const sut = new DBLoadPostsByUid(loadPostsByUidRepositoryStub)
  return {
    sut,
    loadPostsByUidRepositoryStub
  }
}

describe('DBLoadPostsByUid', () => {
  describe('LoadPostsByUidRepository', () => {
    test('Should call LoadPostsByUidRepository with no value', async () => {
      const { sut, loadPostsByUidRepositoryStub } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostsByUidRepositoryStub, 'loadByUid')
      await sut.loadByUid(request)
      expect(loadByUidSpy).toHaveBeenCalledWith({ uid })
    })

    test('Should throw if LoadPostsByUidRepository throws', async () => {
      const { sut, loadPostsByUidRepositoryStub } = makeSut()
      jest
        .spyOn(loadPostsByUidRepositoryStub, 'loadByUid')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.loadByUid(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a list of posts on success', async () => {
    const { sut } = makeSut()
    const result = await sut.loadByUid(request)
    expect(result).toEqual(loadPostResponseModel)
  })
})
