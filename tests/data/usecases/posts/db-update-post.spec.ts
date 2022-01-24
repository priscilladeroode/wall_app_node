import faker from 'faker'

import { UpdatePostRequestEntity } from '@/domain/entities/posts'
import { DBUpdatePost } from '@/data/usecases/posts/db-update-post'
import { ResultEnum } from '@/domain/enums/result-enums'
import {
  CheckPostExistsByIdRepositorySpy,
  LoadPostByIdRepositorySpy,
  UpdatePostRepositorySpy
} from '../../mocks/mock-posts'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DBUpdatePost
  checkPostExistsByIdRepositorySpy: CheckPostExistsByIdRepositorySpy
  updatePostRepositorySpy: UpdatePostRepositorySpy
  loadPostByIdRepositorySpy: LoadPostByIdRepositorySpy
}

const request: UpdatePostRequestEntity = {
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(),
  uid: faker.datatype.uuid(),
  id: faker.datatype.uuid()
}

const makeSut = (): SutTypes => {
  const loadPostByIdRepositorySpy = new LoadPostByIdRepositorySpy()
  const checkPostExistsByIdRepositorySpy =
    new CheckPostExistsByIdRepositorySpy()
  const updatePostRepositorySpy = new UpdatePostRepositorySpy()
  const sut = new DBUpdatePost(
    loadPostByIdRepositorySpy,
    checkPostExistsByIdRepositorySpy,
    updatePostRepositorySpy
  )
  return {
    sut,
    checkPostExistsByIdRepositorySpy,
    updatePostRepositorySpy,
    loadPostByIdRepositorySpy
  }
}

describe('DBUpdatePost', () => {
  describe('UpdatePostRepository', () => {
    test('Should call UpdatePostRepository with correct values', async () => {
      const { sut, updatePostRepositorySpy, checkPostExistsByIdRepositorySpy } =
        makeSut()
      checkPostExistsByIdRepositorySpy.result.id = request.id
      checkPostExistsByIdRepositorySpy.result.uid = request.uid
      const addSpy = jest.spyOn(updatePostRepositorySpy, 'update')
      await sut.update(request)
      expect(addSpy).toHaveBeenCalledWith(request)
    })

    test('Should throw if UpdatePostRepository throws', async () => {
      const { sut, updatePostRepositorySpy, checkPostExistsByIdRepositorySpy } =
        makeSut()
      checkPostExistsByIdRepositorySpy.result.id = request.id
      checkPostExistsByIdRepositorySpy.result.uid = request.uid
      jest
        .spyOn(updatePostRepositorySpy, 'update')
        .mockImplementationOnce(throwError)
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('CheckPostExistsByIdRepository', () => {
    test('Should call CheckPostExistsByIdRepository with correct values', async () => {
      const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
      const checkByIdSpy = jest.spyOn(
        checkPostExistsByIdRepositorySpy,
        'checkById'
      )
      await sut.update(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(request.id)
    })

    test('Should throw if CheckPostExistsByIdRepository throws', async () => {
      const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
      jest
        .spyOn(checkPostExistsByIdRepositorySpy, 'checkById')
        .mockImplementationOnce(throwError)
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadPostByIdRepository', () => {
    test('Should call loadPostByIdRepository with correct values', async () => {
      const {
        sut,
        loadPostByIdRepositorySpy,
        checkPostExistsByIdRepositorySpy
      } = makeSut()
      checkPostExistsByIdRepositorySpy.result.id = request.id
      checkPostExistsByIdRepositorySpy.result.uid = request.uid
      const checkByIdSpy = jest.spyOn(loadPostByIdRepositorySpy, 'loadById')
      await sut.update(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(request.id)
    })

    test('Should throw if loadPostByIdRepository throws', async () => {
      const {
        sut,
        loadPostByIdRepositorySpy,
        checkPostExistsByIdRepositorySpy
      } = makeSut()
      checkPostExistsByIdRepositorySpy.result.id = request.id
      checkPostExistsByIdRepositorySpy.result.uid = request.uid
      jest
        .spyOn(loadPostByIdRepositorySpy, 'loadById')
        .mockImplementationOnce(throwError)
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a post on success', async () => {
    const { sut, loadPostByIdRepositorySpy, checkPostExistsByIdRepositorySpy } =
      makeSut()
    checkPostExistsByIdRepositorySpy.result.id = request.id
    checkPostExistsByIdRepositorySpy.result.uid = request.uid
    const result = await sut.update(request)
    expect(result).toEqual(loadPostByIdRepositorySpy.result)
  })

  test('Should return a not found if post dont exist', async () => {
    const { sut, checkPostExistsByIdRepositorySpy } = makeSut()
    checkPostExistsByIdRepositorySpy.result = null
    const result = await sut.update(request)
    expect(result).toEqual(ResultEnum.notFound)
  })

  test('Should return a forbidden if post dont belongs to the user', async () => {
    const { sut } = makeSut()
    const result = await sut.update(request)
    expect(result).toEqual(ResultEnum.forbidden)
  })
})
