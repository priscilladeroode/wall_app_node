import { AddPostRequestModel, AddPostResponseModel } from '../../models/posts'
import { AddPostRepository } from '../../protocols/db/posts/add-post-repository'

import faker from 'faker'
import {
  AddPostRequestEntity,
  AddPostResponseEntity
} from '../../../domain/entities/posts'
import { DBAddPost } from './db-add-post'

interface SutTypes {
  sut: DBAddPost
  addPostRepositoryStub: AddPostRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const id = faker.datatype.uuid()

const request: AddPostRequestEntity = {
  title,
  content,
  uid
}

const response: AddPostResponseEntity = { id }

const addPostRequest: AddPostRequestModel = {
  title,
  content,
  uid
}

const addPostResponse: AddPostResponseModel = { id }

const makeAddPostRepository = (): AddPostRepository => {
  class AddPostRepositoryStub implements AddPostRepository {
    async add (post: AddPostRequestModel): Promise<AddPostResponseModel> {
      return await Promise.resolve(addPostResponse)
    }
  }
  return new AddPostRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addPostRepositoryStub = makeAddPostRepository()
  const sut = new DBAddPost(addPostRepositoryStub)
  return {
    sut,
    addPostRepositoryStub
  }
}

describe('AddPostUseCase', () => {
  describe('AddPostRepository', () => {
    test('Should call AddPostRepository with correct values', async () => {
      const { sut, addPostRepositoryStub } = makeSut()
      const addSpy = jest.spyOn(addPostRepositoryStub, 'add')
      await sut.add(request)
      expect(addSpy).toHaveBeenCalledWith(addPostRequest)
    })

    test('Should throw if AddPostRepository throws', async () => {
      const { sut, addPostRepositoryStub } = makeSut()
      jest
        .spyOn(addPostRepositoryStub, 'add')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.add(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return an id on success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(request)
    expect(result).toEqual(response)
  })
})
