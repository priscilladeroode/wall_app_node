import { DBLoadAllPosts } from '@/data/usecases/posts/db-load-all-posts'
import { throwError } from '@/tests/domain/mocks'
import { LoadAllPostsRepositorySpy } from '../../mocks/mock-posts'

interface SutTypes {
  sut: DBLoadAllPosts
  loadAllPostsRepositorySpy: LoadAllPostsRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAllPostsRepositorySpy = new LoadAllPostsRepositorySpy()
  const sut = new DBLoadAllPosts(loadAllPostsRepositorySpy)
  return {
    sut,
    loadAllPostsRepositorySpy
  }
}

describe('DBLoadAllPosts', () => {
  describe('LoadAllPostsRepository', () => {
    test('Should call LoadAllPostsRepository with no value', async () => {
      const { sut, loadAllPostsRepositorySpy } = makeSut()
      const loadAllSpy = jest.spyOn(loadAllPostsRepositorySpy, 'loadAll')
      await sut.loadAll()
      expect(loadAllSpy).toHaveBeenCalledWith()
    })

    test('Should throw if LoadAllPostsRepository throws', async () => {
      const { sut, loadAllPostsRepositorySpy } = makeSut()
      jest
        .spyOn(loadAllPostsRepositorySpy, 'loadAll')
        .mockImplementationOnce(throwError)
      const promise = sut.loadAll()
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a list of posts on success', async () => {
    const { sut, loadAllPostsRepositorySpy } = makeSut()
    const result = await sut.loadAll()
    expect(result).toEqual(loadAllPostsRepositorySpy.result)
  })
})
