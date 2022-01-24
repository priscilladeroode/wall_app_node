import { LoadAccountByTokenRequestEntity } from '@/domain/entities/users'
import { Decrypter } from '@/data/protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from '@/data/usecases/users/db-load-account-by-token'
import { throwError } from '@/tests/domain/mocks'
import { LoadAccountByTokenRepositorySpy } from '../../mocks/mock-accounts'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const decryptResponse: string = 'any_value'

const request: LoadAccountByTokenRequestEntity = {
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
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositorySpy
  )
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositorySpy
  }
}

describe('DbLoadAccountByToken', () => {
  describe('Descrypter', () => {
    test('Should call Descrypter with correct value', async () => {
      const { sut, decrypterStub } = makeSut()
      const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
      await sut.loadByToken(request)
      expect(decryptSpy).toHaveBeenCalledWith(request.accessToken)
    })

    test('Should return null Descrypter returns null', async () => {
      const { sut, decrypterStub } = makeSut()
      jest
        .spyOn(decrypterStub, 'decrypt')
        .mockReturnValueOnce(Promise.resolve(null))
      const result = await sut.loadByToken(request)
      expect(result).toBeNull()
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

  describe('Descrypter', () => {
    test('Should call LoadAccountByTokenRepository with correct value', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut()
      const decryptSpy = jest.spyOn(
        loadAccountByTokenRepositorySpy,
        'loadByToken'
      )
      await sut.loadByToken(request)
      expect(decryptSpy).toHaveBeenCalledWith(request)
    })

    test('Should return null LoadAccountByTokenRepository returns null', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut()
      jest
        .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
        .mockReturnValueOnce(Promise.resolve(null))
      const result = await sut.loadByToken(request)
      expect(result).toBeNull()
    })

    test('Should throw if LoadAccountByTokenRepository throws', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut()
      jest
        .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
        .mockImplementationOnce(throwError)
      const promise = sut.loadByToken(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return an id on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const result = await sut.loadByToken(request)
    expect(result).toStrictEqual(loadAccountByTokenRepositorySpy.result)
  })
})
