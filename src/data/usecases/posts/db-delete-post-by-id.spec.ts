import faker from 'faker'

import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { DBDeletePostById } from './db-delete-post-by-id'
import { CheckPostExistsResponseModel } from '../../models/posts'
import { DeletePostRequestEntity } from '../../../domain/entities/posts'
import { DeletePostByIdRepository } from '../../protocols/db/posts/delete-post-repository'
import { ResultEnum } from '../../../domain/enums/result-enums'

interface SutTypes {
  sut: DBDeletePostById
  checkPostExistsByIdRepositoryStub: CheckPostExistsByIdRepository
  deletePostByIdRepository: DeletePostByIdRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const id = faker.datatype.uuid()
const uidOtherUser = faker.datatype.uuid()

const request: DeletePostRequestEntity = { id, uid }

const checkPostExistsResponseModel: CheckPostExistsResponseModel = {
  id,
  title,
  content,
  uid
}

const checkPostExistsResponseModelWithOtherUid: CheckPostExistsResponseModel = {
  id,
  title,
  content,
  uid: uidOtherUser
}

const makeCheckPostExistsByIdRepository = (): CheckPostExistsByIdRepository => {
  class CheckPostExistsByIdRepositoryStub
  implements CheckPostExistsByIdRepository {
    async checkById (id: string): Promise<CheckPostExistsResponseModel> {
      return await Promise.resolve(checkPostExistsResponseModel)
    }
  }
  return new CheckPostExistsByIdRepositoryStub()
}

const makeDeletePostByIdRepository = (): DeletePostByIdRepository => {
  class DeletePostByIdRepositoryStub implements DeletePostByIdRepository {
    async deleteById (id: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new DeletePostByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const checkPostExistsByIdRepositoryStub = makeCheckPostExistsByIdRepository()
  const deletePostByIdRepository = makeDeletePostByIdRepository()
  const sut = new DBDeletePostById(
    checkPostExistsByIdRepositoryStub,
    deletePostByIdRepository
  )
  return {
    sut,
    checkPostExistsByIdRepositoryStub,
    deletePostByIdRepository
  }
}

describe('DBDeletePost', () => {
  describe('CheckPostExistsByIdRepository', () => {
    test('Should call CheckPostExistsByIdRepository with correct values', async () => {
      const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
      const checkByIdSpy = jest.spyOn(
        checkPostExistsByIdRepositoryStub,
        'checkById'
      )
      await sut.delete(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(id)
    })

    test('Should throw if CheckPostExistsByIdRepository throws', async () => {
      const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
      jest
        .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.delete(request)
      await expect(promise).rejects.toThrow()
    })
  })
  describe('DeletePostByIdRepository', () => {
    test('Should call DeletePostByIdRepository with correct values', async () => {
      const { sut, deletePostByIdRepository } = makeSut()
      const checkByIdSpy = jest.spyOn(deletePostByIdRepository, 'deleteById')
      await sut.delete(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(request.id)
    })

    test('Should throw if DeletePostByIdRepository throws', async () => {
      const { sut, deletePostByIdRepository } = makeSut()
      jest
        .spyOn(deletePostByIdRepository, 'deleteById')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.delete(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a message on success', async () => {
    const { sut } = makeSut()
    const result = await sut.delete(request)
    expect(result).toEqual(ResultEnum.success)
  })

  test('Should return a not found if post dont exist', async () => {
    const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
    jest
      .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.delete(request)
    expect(result).toEqual(ResultEnum.notFound)
  })

  test('Should return a forbidden if post dont belongs to the user', async () => {
    const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
    jest
      .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
      .mockReturnValueOnce(
        Promise.resolve(checkPostExistsResponseModelWithOtherUid)
      )
    const result = await sut.delete(request)
    expect(result).toEqual(ResultEnum.forbidden)
  })
})
