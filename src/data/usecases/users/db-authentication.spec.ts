import faker from 'faker'
import { AuthenticationRequestEntity } from '../../../domain/entities/users'
import { LoadAccountRequestModel } from '../../models/users/load-account-request-model'
import { LoadAccountResponseModel } from '../../models/users/load-account-response-model'
import { UpdateAccessTokenRequestModel } from '../../models/users/update-access-token-request-model'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token_generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/users/update-access-token-repository'
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

const makeupdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (data: UpdateAccessTokenRequestModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DBAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorStub()
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeupdateAccessTokenRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DBAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.auth(makeFakeRequest())
    expect(result).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const fakeRequest = makeFakeRequest()
    await sut.auth(fakeRequest)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const fakeRequest = makeFakeRequest()
    const token = await sut.auth(fakeRequest)
    expect(token).toStrictEqual({ accessToken: 'any_token' })
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(null)
    const fakeRequest = makeFakeRequest()
    await sut.auth(fakeRequest)
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any_id',
      accessToken: 'any_token'
    })
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeRequest())
    await expect(promise).rejects.toThrow()
  })
})
