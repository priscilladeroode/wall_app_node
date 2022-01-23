import faker from 'faker'
import {
  CheckPostExistsResponseModel,
  LoadPostByIdRequestModel,
  LoadPostByIdResponseModel,
  PostModel,
  UpdatePostRequestModel
} from '@/data/models/posts'
import { UpdatePostRequestEntity } from '@/domain/entities/posts'
import { UpdatePostRepository } from '@/data/protocols/db/posts/update-post-repository'
import { DBUpdatePost } from '@/data/usecases/posts/db-update-post'
import { CheckPostExistsByIdRepository } from '@/data/protocols/db/posts/check-post-exists-by-id'
import { LoadPostByIdRepository } from '@/data/protocols/db/posts/load-post-by-id-respository'
import { ResultEnum } from '@/domain/enums/result-enums'

interface SutTypes {
  sut: DBUpdatePost
  checkPostExistsByIdRepositoryStub: CheckPostExistsByIdRepository
  updatePostRepositoryStub: UpdatePostRepository
  loadPostByIdRepositoryStub: LoadPostByIdRepository
}

const title = faker.lorem.sentence()
const content = faker.lorem.paragraphs()
const uid = faker.datatype.uuid()
const id = faker.datatype.uuid()
const createdBy = faker.name.findName()
const createdAt = faker.datatype.datetime()
const uidOtherUser = faker.datatype.uuid()

const request: UpdatePostRequestEntity = {
  id,
  title,
  content,
  uid
}

const updatePostRequestModel: UpdatePostRequestModel = {
  id,
  title,
  content,
  uid
}

const checkPostExistsResponseModel: CheckPostExistsResponseModel = {
  id,
  title,
  content,
  uid
}

const checkPostExistsResponseModelWithOtherUid: CheckPostExistsResponseModel = {
  id,
  title,
  content,
  uid: uidOtherUser
}

const loadPostByIdRequestModel: LoadPostByIdRequestModel = id

const post: PostModel = {
  id,
  title,
  content,
  createdBy,
  createdAt
}

const loadPostByIdResponseModel: LoadPostByIdResponseModel = post

const makeUpdatePostRepository = (): UpdatePostRepository => {
  class UpdatePostRepositoryStub implements UpdatePostRepository {
    async update (post: UpdatePostRequestModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdatePostRepositoryStub()
}

const makeCheckPostExistsByIdRepository = (): CheckPostExistsByIdRepository => {
  class CheckPostExistsByIdRepositoryStub
  implements CheckPostExistsByIdRepository {
    async checkById (id: string): Promise<CheckPostExistsResponseModel> {
      return await Promise.resolve(checkPostExistsResponseModel)
    }
  }
  return new CheckPostExistsByIdRepositoryStub()
}

const makeLoadPostByIdRepository = (): LoadPostByIdRepository => {
  class LoadPostByIdRepositoryStub implements LoadPostByIdRepository {
    async loadById (
      model: LoadPostByIdRequestModel
    ): Promise<LoadPostByIdResponseModel> {
      return await Promise.resolve(loadPostByIdResponseModel)
    }
  }
  return new LoadPostByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPostByIdRepositoryStub = makeLoadPostByIdRepository()
  const checkPostExistsByIdRepositoryStub = makeCheckPostExistsByIdRepository()
  const updatePostRepositoryStub = makeUpdatePostRepository()
  const sut = new DBUpdatePost(
    loadPostByIdRepositoryStub,
    checkPostExistsByIdRepositoryStub,
    updatePostRepositoryStub
  )
  return {
    sut,
    checkPostExistsByIdRepositoryStub,
    updatePostRepositoryStub,
    loadPostByIdRepositoryStub
  }
}

describe('DBUpdatePost', () => {
  describe('UpdatePostRepository', () => {
    test('Should call UpdatePostRepository with correct values', async () => {
      const { sut, updatePostRepositoryStub } = makeSut()
      const addSpy = jest.spyOn(updatePostRepositoryStub, 'update')
      await sut.update(request)
      expect(addSpy).toHaveBeenCalledWith(updatePostRequestModel)
    })

    test('Should throw if UpdatePostRepository throws', async () => {
      const { sut, updatePostRepositoryStub } = makeSut()
      jest
        .spyOn(updatePostRepositoryStub, 'update')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('CheckPostExistsByIdRepository', () => {
    test('Should call CheckPostExistsByIdRepository with correct values', async () => {
      const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
      const checkByIdSpy = jest.spyOn(
        checkPostExistsByIdRepositoryStub,
        'checkById'
      )
      await sut.update(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(id)
    })

    test('Should throw if CheckPostExistsByIdRepository throws', async () => {
      const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
      jest
        .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadPostByIdRepository', () => {
    test('Should call loadPostByIdRepository with correct values', async () => {
      const { sut, loadPostByIdRepositoryStub } = makeSut()
      const checkByIdSpy = jest.spyOn(loadPostByIdRepositoryStub, 'loadById')
      await sut.update(request)
      expect(checkByIdSpy).toHaveBeenCalledWith(loadPostByIdRequestModel)
    })

    test('Should throw if loadPostByIdRepository throws', async () => {
      const { sut, loadPostByIdRepositoryStub } = makeSut()
      jest
        .spyOn(loadPostByIdRepositoryStub, 'loadById')
        .mockReturnValueOnce(Promise.reject(new Error()))
      const promise = sut.update(request)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return a post on success', async () => {
    const { sut } = makeSut()
    const result = await sut.update(request)
    expect(result).toEqual(loadPostByIdResponseModel)
  })

  test('Should return a not found if post dont exist', async () => {
    const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
    jest
      .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
      .mockReturnValueOnce(Promise.resolve(null))
    const result = await sut.update(request)
    expect(result).toEqual(ResultEnum.notFound)
  })

  test('Should return a forbidden if post dont belongs to the user', async () => {
    const { sut, checkPostExistsByIdRepositoryStub } = makeSut()
    jest
      .spyOn(checkPostExistsByIdRepositoryStub, 'checkById')
      .mockReturnValueOnce(
        Promise.resolve(checkPostExistsResponseModelWithOtherUid)
      )
    const result = await sut.update(request)
    expect(result).toEqual(ResultEnum.forbidden)
  })
})
