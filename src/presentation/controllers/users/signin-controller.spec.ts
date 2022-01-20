import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'
import { SignInController } from './signin-controller'

interface SutTypes {
  sut: SignInController
}

const makeSut = (): SutTypes => {
  const sut = new SignInController()
  return {
    sut
  }
}

describe('Sign In Controller', () => {
  test('Shoud return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
