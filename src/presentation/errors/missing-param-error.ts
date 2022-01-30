import { CustomError } from '../protocols/custom_error'

export class MissingParamError extends CustomError {
  errorCode: string
  constructor (paramName: string) {
    super(`Missing ${paramName}`)
    this.name = 'MissingParamError'
    this.message = `Missing ${paramName}`
    this.errorCode = `missing_${paramName}`
  }
}
