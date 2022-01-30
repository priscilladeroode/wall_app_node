import { CustomError } from '../protocols/custom_error'

export class NotFoundError extends CustomError {
  errorCode: string
  constructor (paramName: string) {
    super(`Can't find ${paramName}`)
    this.name = 'NotFoundError'
    this.errorCode = 'not_found'
  }
}
