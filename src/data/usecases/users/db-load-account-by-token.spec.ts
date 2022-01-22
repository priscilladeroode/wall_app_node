import { LoadAccountByTokenRequestEntity } from '../../../domain/entities/users'
import {
  LoadAccountByTokenRequestModel,
  LoadAccountByTokenResponseModel
} from '../../models/users'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/users/load-account-by-token-repository'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const decryptResponse: string = 'any_value'

const request: LoadAccountByTokenRequestEntity = {
  accessToken: 'any_token'
}

const loadByTokenRequest: LoadAccountByTokenRequestModel = {
  accessToken: 'any_token'
}

const loadByTokenResponse: LoadAccountByTokenResponseModel = {
  uid: 'any_id'
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (plaintext: string): Promise<string> {
      return await Promise.resolve(decryptResponse)
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository {
    async loadByToken (
      model: LoadAccountByTokenRequestModel
    ): Promise<LoadAccountByTokenResponseModel> {
      return await Promise.resolve(loadByTokenResponse)
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('Should call Descrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken(loadByTokenRequest)
    expect(decryptSpy).toHaveBeenCalledWith(loadByTokenRequest.accessToken)
  })

  test('Should return null Descrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.loadByToken(request)
    expect(result).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const decryptSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    )
    await sut.loadByToken(request)
    expect(decryptSpy).toHaveBeenCalledWith(loadByTokenRequest)
  })

  test('Should return null LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.loadByToken(request)
    expect(result).toBeNull()
  })

  test('Should return an id on success', async () => {
    const { sut } = makeSut()
    const result = await sut.loadByToken(request)
    expect(result).toBe(loadByTokenResponse)
  })

  test('Should throw if Descrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.loadByToken(request)
    await expect(promise).rejects.toThrow()
  })
})
