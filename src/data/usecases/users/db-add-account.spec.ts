import { Hasher } from '../../protocols/cryptography/hasher'
import { DBAddAccount } from './db-add-account'
import faker from 'faker'
import { AddAccountRequestEntity } from '../../../domain/entities/users'
import {
  AddAccountRequestModel,
  AddAccountResponseModel
} from '../../models/users'
import { AddAccountRepository } from '../../protocols/db/users/add-account-repository'
import { SendWelcomeEmailRepository } from '../../protocols/services/send-welcome-email-repository'

interface SutTypes {
  sut: DBAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  sendEmailWelcomeEmailRepositoryStub: SendWelcomeEmailRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}
const fakeMessage = {
  message: 'User successfully registered'
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (
      accountData: AddAccountRequestModel
    ): Promise<AddAccountResponseModel> {
      return await Promise.resolve(fakeMessage)
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSendWelcomeEmailRepository = (): SendWelcomeEmailRepository => {
  class SendWelcomeEmailRepositoryStub implements SendWelcomeEmailRepository {
    async send (email: string, name: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new SendWelcomeEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const sendEmailWelcomeEmailRepositoryStub = makeSendWelcomeEmailRepository()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    sendEmailWelcomeEmailRepositoryStub
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    sendEmailWelcomeEmailRepositoryStub
  }
}

export const mockAddAccountRequestEntity = (): AddAccountRequestEntity => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('DBAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = mockAddAccountRequestEntity()
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAddAccountRequestEntity()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAddAccountRequestEntity()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: 'hashed_password'
    })
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAddAccountRequestEntity()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountRequestEntity()
    const result = await sut.add(accountData)
    expect(result).toEqual(fakeMessage)
  })

  test('Should call SendWelcomeEmailRepository with correct values', async () => {
    const { sut, sendEmailWelcomeEmailRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(sendEmailWelcomeEmailRepositoryStub, 'send')
    const accountData = mockAddAccountRequestEntity()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData.email, accountData.name)
  })
})
