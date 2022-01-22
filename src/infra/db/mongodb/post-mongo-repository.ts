import {
  AddPostRequestModel,
  AddPostResponseModel
} from '../../../data/models/posts'
import { AddPostRepository } from '../../../data/protocols/db/posts/add-post-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

export class PostMongoRepository implements AddPostRepository {
  async add (post: AddPostRequestModel): Promise<AddPostResponseModel> {
    const collection = MongoHelper.getCollection('posts')
    const inserted = await collection.insertOne(post)
    const result: AddPostResponseModel = {
      id: inserted.insertedId.toHexString()
    }
    return result
  }
}
