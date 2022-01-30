import { CustomError } from './custom_error'

export interface Validation {
  validate: (input: any) => CustomError
}
