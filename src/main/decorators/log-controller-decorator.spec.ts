import faker from 'faker'

import { LogControllerDecorator } from './log-controller-decorator'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const password = faker.internet.password()
        const httpResponse: HttpResponse = {
          statusCode: 400,
          body: {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: password,
            passwordConfirmation: password
          }
        }
        return await Promise.resolve(httpResponse)
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const password = faker.internet.password()
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
