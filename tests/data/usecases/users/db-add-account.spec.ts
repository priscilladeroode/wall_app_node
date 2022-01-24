import faker from 'faker'
import { Hasher } from '@/data/protocols/cryptography/hasher'
import { DBAddAccount } from '@/data/usecases/users/db-add-account'
import {
  AddAccountRepositorySpy,
  CheckAccountByEmailRepositorySpy,
  SendWelcomeEmailRepositorySpy
} from '../../mocks/mock-accounts'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DBAddAccount
  hasherStub: Hasher
  addAccountRepositorySpy: AddAccountRepositorySpy
  sendWelcomeEmailRepositorySpy: SendWelcomeEmailRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const sendWelcomeEmailRepositorySpy = new SendWelcomeEmailRepositorySpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy()
  const sut = new DBAddAccount(
    hasherStub,
    addAccountRepositorySpy,
    sendWelcomeEmailRepositorySpy,
    checkAccountByEmailRepositorySpy
  )
  return {
    sut,
    hasherStub,
    addAccountRepositorySpy,
    sendWelcomeEmailRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

const request = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}

describe('DBAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(request)
    expect(encryptSpy).toHaveBeenCalledWith(request.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositorySpy, 'add')
    await sut.add(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    const result = await sut.add(request)
    expect(result).toEqual(addAccountRepositorySpy.result)
  })

  test('Should call SendWelcomeEmailRepository with correct values', async () => {
    const { sut, sendWelcomeEmailRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(sendWelcomeEmailRepositorySpy, 'send')
    await sut.add(request)
    expect(addSpy).toHaveBeenCalledWith({
      email: request.email,
      name: request.name
    })
  })

  test('Should throw if SendWelcomeEmailRepository throws', async () => {
    const { sut, sendWelcomeEmailRepositorySpy } = makeSut()
    jest
      .spyOn(sendWelcomeEmailRepositorySpy, 'send')
      .mockImplementationOnce(throwError)
    const promise = sut.add(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.add(request)
    await expect(promise).rejects.toThrow()
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result.exists = true
    const result = await sut.add(request)
    expect(result).toStrictEqual({ registered: false })
  })
})
