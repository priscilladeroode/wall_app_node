import { ObjectId } from 'mongodb'
import {
  AddPostRequestModel,
  AddPostResponseModel,
  LoadPostsByUidRequestModel,
  LoadPostsResponseModel,
  PostModel
} from '../../../data/models/posts'
import { AddPostRepository } from '../../../data/protocols/db/posts/add-post-repository'
import { LoadAllPostsRepository } from '../../../data/protocols/db/posts/load-all-posts-repository'
import { LoadPostByIdRepository } from '../../../data/protocols/db/posts/load-post-by-id-respository'
import { LoadPostsByUidRepository } from '../../../data/protocols/db/posts/load-posts-by-uid-repository'
import { MongoHelper } from '../../helpers/mongo-helper'
import { QueryBuilder } from '../../helpers/query-builder-helper'

export class PostMongoRepository
implements
    AddPostRepository,
    LoadAllPostsRepository,
    LoadPostsByUidRepository,
    LoadPostByIdRepository {
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
    if (result.length > 0) {
      return MongoHelper.mapCollection(result)
    }
    return result as LoadPostsResponseModel
  }

  async loadByUid (
    model: LoadPostsByUidRequestModel
  ): Promise<LoadPostsResponseModel> {
    const collection = MongoHelper.getCollection('posts')
    const query = new QueryBuilder()
      .match({
        uid: new ObjectId(model.uid)
      })
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
    if (result.length > 0) {
      return MongoHelper.mapCollection(result)
    }
    return result as LoadPostsResponseModel
  }

  async loadById (model: string): Promise<PostModel> {
    const collection = MongoHelper.getCollection('posts')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(model)
      })
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
      .build()

    const result = await collection.aggregate(query).toArray()
    if (result.length > 0) {
      return MongoHelper.map(result[0])
    }
    return null
  }
}
