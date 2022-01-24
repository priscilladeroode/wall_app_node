import faker from 'faker'

import { LoadPostByIdUseCase } from '@/domain/usecases/posts/load-post-by-id-usecase'
import { DBLoadPostById } from '@/data/usecases/posts/db-load-post-by-id'
import { LoadPostByIdRepositorySpy } from '../../mocks/mock-posts'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: LoadPostByIdUseCase
  loadPostByIdRepositorySpy: LoadPostByIdRepositorySpy
}

const request: string = faker.datatype.uuid()

const makeSut = (): SutTypes => {
  const loadPostByIdRepositorySpy = new LoadPostByIdRepositorySpy()
  const sut = new DBLoadPostById(loadPostByIdRepositorySpy)
  return {
    sut,
    loadPostByIdRepositorySpy
  }
}

describe('DBLoadPostById', () => {
  describe('LoadPostByIdRepository', () => {
    test('Should call LoadPostByIdRepository with corret value', async () => {
      const { sut, loadPostByIdRepositorySpy } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostByIdRepositorySpy, 'loadById')
      await sut.loadById(request)
      expect(loadByUidSpy).toHaveBeenCalledWith(request)
    })

    test('Should throw if LoadPostByIdRepository throws', async () => {
      const { sut, loadPostByIdRepositorySpy } = makeSut()
      jest
        .spyOn(loadPostByIdRepositorySpy, 'loadById')
        .mockImplementationOnce(throwError)
      const promise = sut.loadById(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a list a post on success', async () => {
    const { sut, loadPostByIdRepositorySpy } = makeSut()
    const result = await sut.loadById(request)
    expect(result).toEqual(loadPostByIdRepositorySpy.result)
  })

  test('Should return null if there is no post', async () => {
    const { sut, loadPostByIdRepositorySpy } = makeSut()
    loadPostByIdRepositorySpy.result = null
    const result = await sut.loadById(request)
    expect(result).toBeNull()
  })
})
