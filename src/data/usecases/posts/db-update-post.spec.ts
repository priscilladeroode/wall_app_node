import {
  UpdatePostRequestModel,
  UpdatePostResponseModel
} from '../../models/posts'
import faker from 'faker'
import { UpdatePostRequestEntity } from '../../../domain/entities/posts'
import { UpdatePostRepository } from '../../protocols/db/posts/update-post-repository'
import { DBUpdatePost } from './db-update-post'

interface SutTypes {
  sut: DBUpdatePost
  updatePostRepositoryStub: UpdatePostRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const id = faker.datatype.uuid()

const request: UpdatePostRequestEntity = {
  id,
  title,
  content,
  uid
}

const updatePostRequestModel: UpdatePostRequestModel = {
  id,
  title,
  content,
  uid
}

const updatePostResponseModel: UpdatePostResponseModel = { id }

const makeUpdatePostRepository = (): UpdatePostRepository => {
  class UpdatePostRepositoryStub implements UpdatePostRepository {
    async update (
      post: UpdatePostRequestModel
    ): Promise<UpdatePostResponseModel> {
      return await Promise.resolve(updatePostResponseModel)
    }
  }
  return new UpdatePostRepositoryStub()
}

const makeSut = (): SutTypes => {
  const updatePostRepositoryStub = makeUpdatePostRepository()
  const sut = new DBUpdatePost(updatePostRepositoryStub)
  return {
    sut,
    updatePostRepositoryStub
  }
}

describe('DBUpdatePost', () => {
  describe('UpdatePostRepository', () => {
    test('Should call UpdatePostRepository with correct values', async () => {
      const { sut, updatePostRepositoryStub } = makeSut()
      const addSpy = jest.spyOn(updatePostRepositoryStub, 'update')
      await sut.update(request)
      expect(addSpy).toHaveBeenCalledWith(updatePostRequestModel)
    })

    test('Should throw if UpdatePostRepository throws', async () => {
      const { sut, updatePostRepositoryStub } = makeSut()
      jest
        .spyOn(updatePostRepositoryStub, 'update')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })
})
