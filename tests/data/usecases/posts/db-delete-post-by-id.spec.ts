import faker from 'faker'

import { DBDeletePostById } from '@/data/usecases/posts/db-delete-post-by-id'
import { DeletePostRequestEntity } from '@/domain/entities/posts'
import { ResultEnum } from '@/domain/enums/result-enums'
import {
  CheckPostExistsByIdRepositorySpy,
  DeletePostByIdRepositorySpy
} from '../../mocks/mock-posts'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DBDeletePostById
  checkPostExistsByIdRepositorySpy: CheckPostExistsByIdRepositorySpy
  deletePostByIdRepositorySpy: DeletePostByIdRepositorySpy
}

const request: DeletePostRequestEntity = {
  uid: faker.datatype.uuid(),
  id: faker.datatype.uuid()
}

const makeSut = (): SutTypes => {
  const checkPostExistsByIdRepositorySpy =
    new CheckPostExistsByIdRepositorySpy()
  const deletePostByIdRepositorySpy = new DeletePostByIdRepositorySpy()
  const sut = new DBDeletePostById(
    checkPostExistsByIdRepositorySpy,
    deletePostByIdRepositorySpy
  )
  return {
    sut,
    checkPostExistsByIdRepositorySpy,
    deletePostByIdRepositorySpy
  }
}

describe('DBDeletePost', () => {
  describe('CheckPostExistsByIdRepository', () => {
    test('Should call CheckPostExistsByIdRepository with correct values', async () => {
      const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
      const checkByIdSpy = jest.spyOn(
        checkPostExistsByIdRepositorySpy,
        'checkById'
      )
      await sut.delete(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(request.id)
    })

    test('Should throw if CheckPostExistsByIdRepository throws', async () => {
      const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
      jest
        .spyOn(checkPostExistsByIdRepositorySpy, 'checkById')
        .mockImplementationOnce(throwError)
      const promise = sut.delete(request)
      await expect(promise).rejects.toThrow()
    })
  })
  describe('DeletePostByIdRepository', () => {
    test('Should call DeletePostByIdRepository with correct values', async () => {
      const {
        sut,
        deletePostByIdRepositorySpy,
        checkPostExistsByIdRepositorySpy
      } = makeSut()
      checkPostExistsByIdRepositorySpy.result.id = request.id
      checkPostExistsByIdRepositorySpy.result.uid = request.uid
      const checkByIdSpy = jest.spyOn(deletePostByIdRepositorySpy, 'deleteById')
      await sut.delete(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(
        checkPostExistsByIdRepositorySpy.params
      )
    })

    test('Should throw if DeletePostByIdRepository throws', async () => {
      const {
        sut,
        deletePostByIdRepositorySpy,
        checkPostExistsByIdRepositorySpy
      } = makeSut()
      checkPostExistsByIdRepositorySpy.result.id = request.id
      checkPostExistsByIdRepositorySpy.result.uid = request.uid
      jest
        .spyOn(deletePostByIdRepositorySpy, 'deleteById')
        .mockImplementationOnce(throwError)
      const promise = sut.delete(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a message on success', async () => {
    const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
    checkPostExistsByIdRepositorySpy.result.id = request.id
    checkPostExistsByIdRepositorySpy.result.uid = request.uid
    const result = await sut.delete(request)
    expect(result).toEqual(ResultEnum.success)
  })

  test('Should return a not found if post dont exist', async () => {
    const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
    checkPostExistsByIdRepositorySpy.result = null
    const result = await sut.delete(request)
    expect(result).toEqual(ResultEnum.notFound)
  })

  test('Should return a forbidden if post dont belongs to the user', async () => {
    const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
    checkPostExistsByIdRepositorySpy.result.uid = faker.datatype.uuid()
    const result = await sut.delete(request)
    expect(result).toEqual(ResultEnum.forbidden)
  })
})
