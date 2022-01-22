import { LoadAccountByTokenRequestEntity } from '../../../domain/entities/users'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const decryptResponse: string = 'any_value'

const loadByTokenRequest: LoadAccountByTokenRequestEntity = {
  accessToken: 'any_token'
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (plaintext: string): Promise<string> {
      return await Promise.resolve(decryptResponse)
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
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
    const result = await sut.loadByToken(loadByTokenRequest)
    expect(result).toBeNull()
  })
})
