import { CustomError } from '../protocols/custom_error'

export class InvalidParamError extends CustomError {
  errorCode: string
  constructor (paramName: string) {
    super(`Invalid ${paramName}`)
    this.name = 'InvalidParamError'
    this.message = `Invalid ${paramName}`
    this.errorCode = `invalid_${paramName}`
  }
}
