import { CustomError } from '../protocols/custom_error'

export class UnauthorizedError extends CustomError {
  errorCode: string
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
    this.errorCode = 'unauthorized'
  }
}
