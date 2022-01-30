import { CustomError } from '../protocols/custom_error'

export class ServerError extends CustomError {
  errorCode: string
  constructor (stack: string) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = stack
    this.errorCode = 'server_error'
  }
}
