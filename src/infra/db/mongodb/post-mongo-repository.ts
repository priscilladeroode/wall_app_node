import {
  AddPostRequestModel,
  AddPostResponseModel,
  LoadPostsResponseModel
} from '../../../data/models/posts'
import { AddPostRepository } from '../../../data/protocols/db/posts/add-post-repository'
import { LoadAllPostsRepository } from '../../../data/protocols/db/posts/load-all-posts-repository'
import { MongoHelper } from '../../helpers/mongo-helper'
import { QueryBuilder } from '../../helpers/query-builder-helper'

export class PostMongoRepository
implements AddPostRepository, LoadAllPostsRepository {
  async add (post: AddPostRequestModel): Promise<AddPostResponseModel> {
    const collection = MongoHelper.getCollection('posts')
    const inserted = await collection.insertOne(post)
    const result: AddPostResponseModel = {
      id: inserted.insertedId.toHexString()
    }
    return result
  }

  async loadAll (): Promise<LoadPostsResponseModel> {
    const collection = MongoHelper.getCollection('posts')
    const query = new QueryBuilder()
      .lookup({
        from: 'users',
        foreignField: '_id',
        localField: 'uid',
        as: 'users'
      })
      .unwind({ path: '$users' })
      .project({
        id: '$_id',
        title: '$title',
        content: '$content',
        createdBy: '$users.name',
        createdAt: { $toDate: '$_id' }
      })
      .sort({
        _id: -1
      })
      .build()

    const result = await collection.aggregate(query).toArray()
    return MongoHelper.mapCollection(result)
  }
}
