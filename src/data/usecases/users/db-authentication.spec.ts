import faker from 'faker'
import { LoadAccountRequestModel } from '../../models/users/load-account-request-model'
import { LoadAccountResponseModel } from '../../models/users/load-account-response-model'
import { LoadAccountByEmailRepository } from '../../protocols/db/users/load-account-by-email-repository'
import { DBAuthentication } from './db-authentication'

describe('DBAuthentication', () => {
  test('Should call encrypter with correct password', async () => {
    class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
      async load (
        accountData: LoadAccountRequestModel
      ): Promise<LoadAccountResponseModel> {
        const response: LoadAccountResponseModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          password: 'any_password'
        }
        return await Promise.resolve(response)
      }
    }
    const repository = new LoadAccountByEmailRepositoryStub()
    const sut = new DBAuthentication(repository)
    const loadSpy = jest.spyOn(repository, 'load')
    const email = faker.internet.email()
    await sut.auth({
      email: email,
      password: faker.internet.password()
    })
    expect(loadSpy).toHaveBeenCalledWith({ email: email })
  })
})
