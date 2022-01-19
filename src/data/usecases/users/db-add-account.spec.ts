import { Encrypter } from '../../protocols/cryptography/encrypter'
import { DBAddAccount } from './db-add-account'
import faker from 'faker'
import { AddAccountRequestEntity } from '../../../domain/entities/users'
import {
  AddAccountRequestModel,
  AddAccountResponseModel
} from '../../models/users'
import { AddAccountRepository } from '../../protocols/db/users/add-account-repository'

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (
      accountData: AddAccountRequestModel
    ): Promise<AddAccountResponseModel> {
      const account = mockAddAccountRequestEntity()
      const fakeAccount = {
        id: 'valid_id',
        name: account.name,
        email: account.email,
        password: 'hashed_password'
      }
      return await Promise.resolve(fakeAccount)
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

export const mockAddAccountRequestEntity = (): AddAccountRequestEntity => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('DBAddAccount Usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = mockAddAccountRequestEntity()
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
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
})
