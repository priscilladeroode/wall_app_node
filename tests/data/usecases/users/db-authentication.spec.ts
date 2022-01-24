import faker from 'faker'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import { Encrypter } from '@/data/protocols/cryptography/encrypter'
import { DBAuthentication } from '@/data/usecases/users/db-authentication'
import {
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy
} from '../../mocks/mock-accounts'

const email = faker.internet.email()

const request = {
  email: email,
  password: faker.internet.password()
}

interface SutTypes {
  sut: DBAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const sut = new DBAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositorySpy
  )
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositorySpy
  }
}

describe('DBAuthentication', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
    await sut.auth(request)
    expect(loadSpy).toHaveBeenCalledWith({ email: email })
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockReturnValueOnce(null)
    const result = await sut.auth(request)
    expect(result).toBeNull()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result.password = 'hashed_password'
    const compareSpy = jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(null)

    await sut.auth(request)
    expect(compareSpy).toHaveBeenCalledWith(request.password, 'hashed_password')
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.auth(request)
    expect(result).toBeNull()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result.id = 'any_id'
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(request)
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      loadAccountByEmailRepositorySpy
    } = makeSut()
    loadAccountByEmailRepositorySpy.result.id = 'any_id'
    const updateSpy = jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockReturnValueOnce(null)
    await sut.auth(request)
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any_id',
      accessToken: 'any_token'
    })
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an AuthenticationResponseEntity on success', async () => {
    const { sut } = makeSut()
    const result = await sut.auth(request)
    expect(result).toBeTruthy()
    expect(result.name).toBeTruthy()
    expect(result.email).toBeTruthy()
    expect(result.accessToken).toBeTruthy()
  })
})
