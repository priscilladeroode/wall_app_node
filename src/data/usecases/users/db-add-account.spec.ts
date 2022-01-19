import { Encrypter } from '../../protocols/cryptography/encrypter'
import { DBAddAccount } from './db-add-account'
import faker from 'faker'
import { AddAccountRequestEntity } from '../../../domain/entities/users'

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DBAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
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
})
