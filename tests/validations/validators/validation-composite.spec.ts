import faker from 'faker'

import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from '@/validations/validators/'
import { ValidationSpy } from '@/tests/presentation/mocks/mock-validation'

const field = faker.random.word()

type SutTypes = {
  sut: ValidationComposite
  validationSpies: Validation[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    jest
      .spyOn(validationSpies[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    jest
      .spyOn(validationSpies[0], 'validate')
      .mockReturnValueOnce(new Error(''))
    jest
      .spyOn(validationSpies[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new Error(''))
  })

  test('Should not return if validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
