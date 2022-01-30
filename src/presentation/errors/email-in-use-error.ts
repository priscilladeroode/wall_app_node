import { CustomError } from '../protocols/custom_error'

export class EmailInUseError extends CustomError {
  errorCode: string
  constructor () {
    super('The received email is already in use')
    this.name = 'EmailInUseError'
    this.errorCode = 'email_in_use'
  }
}
