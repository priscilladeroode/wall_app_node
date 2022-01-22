import {
  AddPostRequestEntity,
  AddPostResponseEntity
} from '../../../domain/entities/posts'
import { AddPostUseCase } from '../../../domain/usecases/posts/add-post-usecase'
import { AddPostRepository } from '../../protocols/db/posts/add-post-repository'

export class DBAddPost implements AddPostUseCase {
  constructor (private readonly addPostRepository: AddPostRepository) {}

  async add (post: AddPostRequestEntity): Promise<AddPostResponseEntity> {
    const id = await this.addPostRepository.add(post)
    return id
  }
}
