import faker from 'faker'
import {
  AddPostRequestEntity,
  AddPostResponseEntity,
  DeletePostRequestEntity,
  DeletePostResponseEntity,
  LoadPostsResponseEntity,
  PostEntity,
  UpdatePostRequestEntity,
  UpdatePostResponseEntity
} from '@/domain/entities/posts'
import { AddPostUseCase } from '@/domain/usecases/posts/add-post-usecase'
import { DeletePostByIdUseCase } from '@/domain/usecases/posts/delete-post-by-id-usecase'
import { ResultEnum } from '@/domain/enums/result-enums'
import { LoadAllPostsUseCase } from '@/domain/usecases/posts/load-all-posts-usecase'
import { LoadPostByIdUseCase } from '@/domain/usecases/posts/load-post-by-id-usecase'
import { LoadPostsByUidUseCase } from '@/domain/usecases/posts/load-posts-by-uid-usecase'
import { UpdatePostUseCase } from '@/domain/usecases/posts/update-post-usecase'

export class AddPostUseCaseSpy implements AddPostUseCase {
  params: AddPostRequestEntity
  result = {
    id: faker.datatype.uuid()
  }

  async add (
    authRequestEntity: AddPostRequestEntity
  ): Promise<AddPostResponseEntity> {
    this.params = authRequestEntity
    return this.result
  }
}

export class DeletePostByIdUseCaseSpy implements DeletePostByIdUseCase {
  params: DeletePostRequestEntity
  result = ResultEnum.success

  async delete (
    entity: DeletePostRequestEntity
  ): Promise<DeletePostResponseEntity> {
    this.params = entity
    return this.result
  }
}

export class LoadAllPostsUseCaseSpy implements LoadAllPostsUseCase {
  result = [
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      id: faker.datatype.uuid(),
      createdAt: faker.datatype.datetime(),
      createdBy: faker.name.findName()
    }
  ]

  async loadAll (): Promise<LoadPostsResponseEntity> {
    return this.result
  }
}

export class LoadPostByIdUseCaseSpy implements LoadPostByIdUseCase {
  params: string
  result = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    id: faker.datatype.uuid(),
    createdAt: faker.datatype.datetime(),
    createdBy: faker.name.findName()
  }

  async loadById (id: string): Promise<PostEntity> {
    this.params = id
    return this.result
  }
}

export class LoadPostsByUidUseCaseSpy implements LoadPostsByUidUseCase {
  result = [
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      id: faker.datatype.uuid(),
      createdAt: faker.datatype.datetime(),
      createdBy: faker.name.findName()
    }
  ]

  async loadByUid (): Promise<LoadPostsResponseEntity> {
    return this.result
  }
}

export class UpdatePostUseCaseSpy implements UpdatePostUseCase {
  params: UpdatePostRequestEntity
  result = {
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    createdBy: faker.name.findName(),
    createdAt: faker.datatype.datetime()
  }

  async update (
    post: UpdatePostRequestEntity
  ): Promise<UpdatePostResponseEntity> {
    this.params = post
    return this.result
  }
}
