import faker from 'faker'

import { LoadPostsByUidRequestEntity } from '@/domain/entities/posts'
import { LoadPostsByUidUseCase } from '@/domain/usecases/posts/load-posts-by-uid-usecase'
import { DBLoadPostsByUid } from '@/data/usecases/posts/db-load-posts-by-uid'
import { throwError } from '@/tests/domain/mocks'
import { LoadPostsByUidRepositorySpy } from '../../mocks/mock-posts'

interface SutTypes {
  sut: LoadPostsByUidUseCase
  loadPostsByUidRepositorySpy: LoadPostsByUidRepositorySpy
}

const request: LoadPostsByUidRequestEntity = { uid: faker.datatype.uuid() }

const makeSut = (): SutTypes => {
  const loadPostsByUidRepositorySpy = new LoadPostsByUidRepositorySpy()
  const sut = new DBLoadPostsByUid(loadPostsByUidRepositorySpy)
  return {
    sut,
    loadPostsByUidRepositorySpy
  }
}

describe('DBLoadPostsByUid', () => {
  describe('LoadPostsByUidRepository', () => {
    test('Should call LoadPostsByUidRepository with no value', async () => {
      const { sut, loadPostsByUidRepositorySpy } = makeSut()
      const loadByUidSpy = jest.spyOn(loadPostsByUidRepositorySpy, 'loadByUid')
      await sut.loadByUid(request)
      expect(loadByUidSpy).toHaveBeenCalledWith(request)
    })

    test('Should throw if LoadPostsByUidRepository throws', async () => {
      const { sut, loadPostsByUidRepositorySpy } = makeSut()
      jest
        .spyOn(loadPostsByUidRepositorySpy, 'loadByUid')
        .mockImplementationOnce(throwError)
      const promise = sut.loadByUid(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a list of posts on success', async () => {
    const { sut, loadPostsByUidRepositorySpy } = makeSut()
    const result = await sut.loadByUid(request)
    expect(result).toEqual(loadPostsByUidRepositorySpy.result)
  })
})
