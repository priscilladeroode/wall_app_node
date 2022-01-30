import { CustomError } from '../protocols/custom_error'

export class AccessDeniedError extends CustomError {
  errorCode: string
  constructor () {
    super('Access denied')
    this.name = 'AccessDeniedError'
    this.errorCode = 'access_denied'
  }
}
