import { Validation } from '../../protocols/validation'
import { AddPostController } from './add-post-controller'

import faker from 'faker'
import { HttpRequest } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http'

type SutTypes = {
  sut: AddPostController
  validationStub: Validation
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()

const request: HttpRequest = {
  body: {
    title,
    content,
    uid
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddPostController(validationStub)
  return {
    sut,
    validationStub
  }
}

describe('AddPostController', () => {
  describe('Validation', () => {
    test('Shoud call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(request)
      expect(validateSpy).toHaveBeenCalledWith(request.body)
    })

    test('Shoud return 400 if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest
        .spyOn(validationStub, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'))
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field'))
      )
    })
  })
})
