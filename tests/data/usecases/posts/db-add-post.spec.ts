import faker from 'faker'

import { AddPostRequestEntity } from '@/domain/entities/posts'
import { DBAddPost } from '@/data/usecases/posts/db-add-post'
import { AddPostRepositorySpy } from '../../mocks/mock-posts'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DBAddPost
  addPostRepositorySpy: AddPostRepositorySpy
}

const request: AddPostRequestEntity = {
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(),
  uid: faker.datatype.uuid()
}

const makeSut = (): SutTypes => {
  const addPostRepositorySpy = new AddPostRepositorySpy()
  const sut = new DBAddPost(addPostRepositorySpy)
  return {
    sut,
    addPostRepositorySpy
  }
}

describe('AddPostUseCase', () => {
  describe('AddPostRepository', () => {
    test('Should call AddPostRepository with correct values', async () => {
      const { sut, addPostRepositorySpy } = makeSut()
      const addSpy = jest.spyOn(addPostRepositorySpy, 'add')
      await sut.add(request)
      expect(addSpy).toHaveBeenCalledWith(request)
    })

    test('Should throw if AddPostRepository throws', async () => {
      const { sut, addPostRepositorySpy } = makeSut()
      jest.spyOn(addPostRepositorySpy, 'add').mockImplementationOnce(throwError)
      const promise = sut.add(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return an id on success', async () => {
    const { sut, addPostRepositorySpy } = makeSut()
    const result = await sut.add(request)
    expect(result).toEqual(addPostRepositorySpy.result)
  })
})
