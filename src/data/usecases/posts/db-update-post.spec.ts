import {
  CheckPostExistsResponseModel,
  UpdatePostRequestModel,
  UpdatePostResponseModel
} from '../../models/posts'
import faker from 'faker'
import { UpdatePostRequestEntity } from '../../../domain/entities/posts'
import { UpdatePostRepository } from '../../protocols/db/posts/update-post-repository'
import { DBUpdatePost } from './db-update-post'
import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'

interface SutTypes {
  sut: DBUpdatePost
  checkPostExistsByIdRepositoryStub: CheckPostExistsByIdRepository
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

const makeCheckPostExistsByIdRepository = (): CheckPostExistsByIdRepository => {
  class CheckPostExistsByIdRepositoryStub
  implements CheckPostExistsByIdRepository {
    async checkById (id: string): Promise<CheckPostExistsResponseModel> {
      return await Promise.resolve(true)
    }
  }
  return new CheckPostExistsByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const checkPostExistsByIdRepositoryStub = makeCheckPostExistsByIdRepository()
  const updatePostRepositoryStub = makeUpdatePostRepository()
  const sut = new DBUpdatePost(
    checkPostExistsByIdRepositoryStub,
    updatePostRepositoryStub
  )
  return {
    sut,
    checkPostExistsByIdRepositoryStub,
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

  describe('CheckPostExistsByIdRepository', () => {
    test('Should call CheckPostExistsByIdRepository with correct values', async () => {
      const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
      const checkByIdSpy = jest.spyOn(
        checkPostExistsByIdRepositoryStub,
        'checkById'
      )
      await sut.update(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(id)
    })

    test('Should throw if CheckPostExistsByIdRepository throws', async () => {
      const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
      jest
        .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })
})
