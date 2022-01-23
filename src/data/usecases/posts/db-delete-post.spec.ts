import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { DBDeletePost } from './db-delete-post'

import faker from 'faker'
import { CheckPostExistsResponseModel } from '../../models/posts'
import { DeletePostRequestEntity } from '../../../domain/entities/posts'
import { DeletePostByIdRepository } from '../../protocols/db/posts/delete-post-repository'

interface SutTypes {
  sut: DBDeletePost
  checkPostExistsByIdRepositoryStub: CheckPostExistsByIdRepository
  deletePostByIdRepository: DeletePostByIdRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const id = faker.datatype.uuid()

const request: DeletePostRequestEntity = { id, uid }

const checkPostExistsResponseModel: CheckPostExistsResponseModel = {
  id,
  title,
  content,
  uid
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
  const sut = new DBDeletePost(
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
  })
})
