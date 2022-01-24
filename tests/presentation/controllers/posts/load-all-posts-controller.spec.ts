import { ServerError } from '@/presentation/errors'
import { ok, serverError } from '@/presentation/helpers/http'
import { LoadAllPostsController } from '@/presentation/controllers/posts/load-all-posts-controller'
import { LoadAllPostsUseCaseSpy } from '../../mocks/mock-post'
import { throwError } from '@/tests/domain/mocks'

type SutTypes = {
  sut: LoadAllPostsController
  loadAllPostsUseCaseSpy: LoadAllPostsUseCaseSpy
}

const request = { body: {} }

const makeSut = (): SutTypes => {
  const loadAllPostsUseCaseSpy = new LoadAllPostsUseCaseSpy()
  const sut = new LoadAllPostsController(loadAllPostsUseCaseSpy)
  return {
    sut,
    loadAllPostsUseCaseSpy
  }
}

describe('AddPostController', () => {
  test('Shoud return 500 if LoadAllPostsUseCase throws', async () => {
    const { sut, loadAllPostsUseCaseSpy } = makeSut()
    jest
      .spyOn(loadAllPostsUseCaseSpy, 'loadAll')
      .mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Shoud return 200 if LoadAllPostsUseCase returns posts', async () => {
    const { sut, loadAllPostsUseCaseSpy } = makeSut()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(loadAllPostsUseCaseSpy.result))
  })
})
