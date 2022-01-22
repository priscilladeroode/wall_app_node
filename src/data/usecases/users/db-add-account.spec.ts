import { Hasher } from '../../protocols/cryptography/hasher'
import { DBAddAccount } from './db-add-account'
import faker from 'faker'
import { AddAccountRequestEntity } from '../../../domain/entities/users'
import {
  AddAccountRequestModel,
  AddAccountResponseModel,
  CheckAccountRequestModel,
  CheckAccountResponseModel
} from '../../models/users'
import { AddAccountRepository } from '../../protocols/db/users/add-account-repository'
import { SendWelcomeEmailRepository } from '../../protocols/services/send-welcome-email-repository'
import { CheckAccountByEmailRepository } from '../../protocols/db/users/check-account-by-email-repository'

interface SutTypes {
  sut: DBAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  sendEmailWelcomeEmailRepositoryStub: SendWelcomeEmailRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new HasherStub()
}

const response: AddAccountResponseModel = {
  registered: true
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (
      accountData: AddAccountRequestModel
    ): Promise<AddAccountResponseModel> {
      return await Promise.resolve(response)
    }
  }
  return new AddAccountRepositoryStub()
}

const checkByEmailRequest: CheckAccountResponseModel = {
  exists: false
}

const makeCheckAccountRepository = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositoryStub
  implements CheckAccountByEmailRepository {
    async checkByEmail (
      data: CheckAccountRequestModel
    ): Promise<CheckAccountResponseModel> {
      return await Promise.resolve(checkByEmailRequest)
    }
  }
  return new CheckAccountByEmailRepositoryStub()
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
  const checkAccountByEmailRepositoryStub = makeCheckAccountRepository()
  const sut = new DBAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    sendEmailWelcomeEmailRepositoryStub,
    checkAccountByEmailRepositoryStub
  )
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    sendEmailWelcomeEmailRepositoryStub,
    checkAccountByEmailRepositoryStub
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

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountRequestEntity()
    const result = await sut.add(accountData)
    expect(result).toEqual(response)
  })

  test('Should call SendWelcomeEmailRepository with correct values', async () => {
    const { sut, sendEmailWelcomeEmailRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(sendEmailWelcomeEmailRepositoryStub, 'send')
    const accountData = mockAddAccountRequestEntity()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData.email, accountData.name)
  })

  test('Should throw if SendWelcomeEmailRepository throws', async () => {
    const { sut, sendEmailWelcomeEmailRepositoryStub } = makeSut()
    jest
      .spyOn(sendEmailWelcomeEmailRepositoryStub, 'send')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAddAccountRequestEntity()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAddAccountRequestEntity()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
      .mockReturnValueOnce(Promise.resolve({ exists: true }))
    const accountData = mockAddAccountRequestEntity()
    const result = await sut.add(accountData)
    expect(result).toStrictEqual({ registered: false })
  })
})
