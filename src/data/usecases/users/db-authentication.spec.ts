import faker from 'faker'
import { AuthenticationRequestModel } from '../../models/users/authentication-request-model'
import { LoadAccountRequestModel } from '../../models/users/load-account-request-model'
import { LoadAccountResponseModel } from '../../models/users/load-account-response-model'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'
import { DBAuthentication } from './db-authentication'

const email = faker.internet.email()

const makeFakeAccount = (): LoadAccountResponseModel => ({
  id: 'any_id',
  name: 'any_name',
  email: email,
  password: 'any_password'
})

const makeFakeRequest = (): AuthenticationRequestModel => ({
  email: email,
  password: faker.internet.password()
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository {
    async load (
      accountData: LoadAccountRequestModel
    ): Promise<LoadAccountResponseModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DBAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DBAuthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DBAuthentication', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith({ email: email })
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })
})
