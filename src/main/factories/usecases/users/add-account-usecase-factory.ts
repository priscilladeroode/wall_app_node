import { DBAddAccount } from '../../../../data/usecases/users/db-add-account'
import { AddAccount } from '../../../../domain/usecases/users'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter'
import { UserMongoRepository } from '../../../../infra/db/mongodb/user-mongo-repository'
import { SendGridEmailRepository } from '../../../../infra/services/send-grid-email-repository'

export const makeAddAccountUseCase = (): AddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const repository = new UserMongoRepository()
  const sendEmail = new SendGridEmailRepository()
  return new DBAddAccount(hasher, repository, sendEmail, repository)
}
