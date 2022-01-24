import faker from 'faker'

import { AddPostRepository } from '@/data/protocols/db/posts/add-post-repository'
import {
  AddPostRequestModel,
  AddPostResponseModel,
  CheckPostExistsResponseModel,
  LoadPostsByUidRequestModel,
  LoadPostsResponseModel,
  PostModel,
  UpdatePostRequestModel
} from '@/data/models/posts'
import { CheckPostExistsByIdRepository } from '@/data/protocols/db/posts/check-post-exists-by-id'
import { DeletePostByIdRepository } from '@/data/protocols/db/posts/delete-post-repository'
import { LoadAllPostsRepository } from '@/data/protocols/db/posts/load-all-posts-repository'
import { LoadPostByIdRepository } from '@/data/protocols/db/posts/load-post-by-id-respository'
import { LoadPostsByUidRepository } from '@/data/protocols/db/posts/load-posts-by-uid-repository'
import { UpdatePostRepository } from '@/data/protocols/db/posts/update-post-repository'

export class AddPostRepositorySpy implements AddPostRepository {
  params: AddPostRequestModel
  result = { id: faker.datatype.uuid() }
  async add (post: AddPostRequestModel): Promise<AddPostResponseModel> {
    this.params = post
    return this.result
  }
}

export class CheckPostExistsByIdRepositorySpy
implements CheckPostExistsByIdRepository {
  params: string
  result = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    uid: faker.datatype.uuid(),
    id: faker.datatype.uuid()
  }

  async checkById (id: string): Promise<CheckPostExistsResponseModel> {
    this.params = id
    return this.result
  }
}

export class DeletePostByIdRepositorySpy implements DeletePostByIdRepository {
  params: string
  async deleteById (id: string): Promise<void> {
    this.params = id
  }
}

export class LoadAllPostsRepositorySpy implements LoadAllPostsRepository {
  result = [
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      id: faker.datatype.uuid(),
      createdBy: faker.name.findName(),
      createdAt: faker.datatype.datetime()
    }
  ]

  async loadAll (): Promise<LoadPostsResponseModel> {
    return this.result
  }
}

export class LoadPostByIdRepositorySpy implements LoadPostByIdRepository {
  params: string
  result = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    id: faker.datatype.uuid(),
    createdBy: faker.name.findName(),
    createdAt: faker.datatype.datetime()
  }

  async loadById (id: string): Promise<PostModel> {
    this.params = id
    return this.result
  }
}

export class LoadPostsByUidRepositorySpy implements LoadPostsByUidRepository {
  params: LoadPostsByUidRequestModel
  result = [
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      id: faker.datatype.uuid(),
      createdBy: faker.name.findName(),
      createdAt: faker.datatype.datetime()
    }
  ]

  async loadByUid (
    model: LoadPostsByUidRequestModel
  ): Promise<LoadPostsResponseModel> {
    this.params = model
    return this.result
  }
}

export class UpdatePostRepositorySpy implements UpdatePostRepository {
  params: UpdatePostRequestModel
  async update (post: UpdatePostRequestModel): Promise<void> {
    this.params = post
  }
}
