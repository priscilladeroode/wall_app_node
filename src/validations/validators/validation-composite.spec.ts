import faker from 'faker'
import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'
import { ValidationComposite } from './validation-composite'

const field = faker.random.word()

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = makeValidationStub()
  const sut = new ValidationComposite([validationStubs])
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
