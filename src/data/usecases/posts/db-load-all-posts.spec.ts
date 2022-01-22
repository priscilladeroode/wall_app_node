import { LoadPostsResponseModel, PostModel } from '../../models/posts'
import { LoadAllPostsRepository } from '../../protocols/db/posts/load-all-posts-repository'
import { DBLoadAllPosts } from './db-load-all-posts'

import faker from 'faker'

interface SutTypes {
  sut: DBLoadAllPosts
  loadAllPostsRepositoryStub: LoadAllPostsRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdBy = faker.name.findName()
const createdAt = faker.datatype.datetime()

const post: PostModel = {
  id,
  title,
  content,
  createdBy,
  createdAt
}

const loadPostResponseModel: LoadPostsResponseModel = [post, post]

const makeLoadAllPostsRepositoryStub = (): LoadAllPostsRepository => {
  class LoadAllPostsRepositoryStub implements LoadAllPostsRepository {
    async loadAll (): Promise<LoadPostsResponseModel> {
      return await Promise.resolve(loadPostResponseModel)
    }
  }
  return new LoadAllPostsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAllPostsRepositoryStub = makeLoadAllPostsRepositoryStub()
  const sut = new DBLoadAllPosts(loadAllPostsRepositoryStub)
  return {
    sut,
    loadAllPostsRepositoryStub
  }
}

describe('DBLoadAllPosts', () => {
  describe('LoadAllPostsRepository', () => {
    test('Should call LoadAllPostsRepository with no value', async () => {
      const { sut, loadAllPostsRepositoryStub } = makeSut()
      const loadAllSpy = jest.spyOn(loadAllPostsRepositoryStub, 'loadAll')
      await sut.loadAll()
      expect(loadAllSpy).toHaveBeenCalledWith()
    })

    test('Should throw if LoadAllPostsRepository throws', async () => {
      const { sut, loadAllPostsRepositoryStub } = makeSut()
      jest
        .spyOn(loadAllPostsRepositoryStub, 'loadAll')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.loadAll()
      await expect(promise).rejects.toThrow()
    })
  })
})
