import faker from 'faker'

import { LogControllerDecorator } from './log-controller-decorator'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
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
})
