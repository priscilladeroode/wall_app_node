import { CheckPostExistsByIdRepository } from '../../protocols/db/posts/check-post-exists-by-id'
import { DBDeletePost } from './db-delete-post'

import faker from 'faker'
import { CheckPostExistsResponseModel } from '../../models/posts'
import { DeletePostRequestEntity } from '../../../domain/entities/posts'

interface SutTypes {
  sut: DBDeletePost
  checkPostExistsByIdRepositoryStub: CheckPostExistsByIdRepository
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

const makeSut = (): SutTypes => {
  const checkPostExistsByIdRepositoryStub = makeCheckPostExistsByIdRepository()

  const sut = new DBDeletePost(checkPostExistsByIdRepositoryStub)
  return {
    sut,
    checkPostExistsByIdRepositoryStub
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
})
