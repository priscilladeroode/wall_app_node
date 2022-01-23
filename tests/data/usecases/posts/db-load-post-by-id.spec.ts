import faker from 'faker'

import { PostModel } from '@/data/models/posts'
import { LoadPostByIdUseCase } from '@/domain/usecases/posts/load-post-by-id-usecase'
import { LoadPostByIdRepository } from '@/data/protocols/db/posts/load-post-by-id-respository'
import { DBLoadPostById } from '@/data/usecases/posts/db-load-post-by-id'

interface SutTypes {
  sut: LoadPostByIdUseCase
  loadPostsByIdRepositoryStub: LoadPostByIdRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const id = faker.datatype.uuid()
const createdBy = faker.name.findName()
const createdAt = faker.datatype.datetime()

const request: string = id

const post: PostModel = {
  id,
  title,
  content,
  createdBy,
  createdAt
}

const makeLoadPostByIdRepositoryStub = (): LoadPostByIdRepository => {
  class LoadPostByIdRepositoryStub implements LoadPostByIdRepository {
    async loadById (id: string): Promise<PostModel> {
      return await Promise.resolve(post)
    }
  }
  return new LoadPostByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPostsByIdRepositoryStub = makeLoadPostByIdRepositoryStub()
  const sut = new DBLoadPostById(loadPostsByIdRepositoryStub)
  return {
    sut,
    loadPostsByIdRepositoryStub
  }
}

describe('DBLoadPostById', () => {
  describe('LoadPostByIdRepository', () => {
    test('Should call LoadPostByIdRepository with corret value', async () => {
      const { sut, loadPostsByIdRepositoryStub } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostsByIdRepositoryStub, 'loadById')
      await sut.loadById(request)
      expect(loadByUidSpy).toHaveBeenCalledWith(id)
    })

    test('Should throw if LoadPostByIdRepository throws', async () => {
      const { sut, loadPostsByIdRepositoryStub } = makeSut()
      jest
        .spyOn(loadPostsByIdRepositoryStub, 'loadById')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.loadById(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a list a post on success', async () => {
    const { sut } = makeSut()
    const result = await sut.loadById(request)
    expect(result).toEqual(post)
  })

  test('Should return null if there is no post', async () => {
    const { sut, loadPostsByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadPostsByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.loadById(request)
    expect(result).toBeNull()
  })
})
