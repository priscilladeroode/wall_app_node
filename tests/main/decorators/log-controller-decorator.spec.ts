import faker from 'faker'

import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { serverError } from '@/presentation/helpers/http'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { ServerError } from '@/presentation/errors'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const fakeHttpResponse = {
  statusCode: 400,
  body: {
    name: faker.name.findName()
  }
}

const fakeHttpRequest = {
  body: {
    name: faker.name.findName()
  }
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new ServerError('')
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = fakeHttpResponse
      return await Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = fakeHttpRequest
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = fakeHttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(fakeHttpResponse)
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    const httpRequest = fakeHttpRequest
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
