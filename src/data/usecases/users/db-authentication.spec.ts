import faker from 'faker'
import { AuthenticationRequestEntity } from '../../../domain/entities/users'
import { LoadAccountRequestModel } from '../../models/users/load-account-request-model'
import { LoadAccountResponseModel } from '../../models/users/load-account-response-model'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'
import { DBAuthentication } from './db-authentication'

const email = faker.internet.email()

const makeFakeAccount = (): LoadAccountResponseModel => ({
  id: 'any_id',
  name: 'any_name',
  email: email,
  password: 'hashed_password'
})

const makeFakeRequest = (): AuthenticationRequestEntity => ({
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
  hashComparerStub: HashComparer
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparer()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DBAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub
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

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null)
    const result = await sut.auth(makeFakeRequest())
    expect(result).toBeNull()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(null)
    const fakeRequest = makeFakeRequest()
    await sut.auth(fakeRequest)
    expect(compareSpy).toHaveBeenCalledWith(
      fakeRequest.password,
      'hashed_password'
    )
  })
})
