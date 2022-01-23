import faker from 'faker'

import { PostModel } from '../../models/posts'
import { LoadPostByIdUseCase } from '../../../domain/usecases/posts/load-post-by-id-usecase'
import { LoadPostByIdRepository } from '../../protocols/db/posts/load-post-by-id-respository'
import { DBLoadPostById } from './db-load-post-by-id'

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
  })
})
