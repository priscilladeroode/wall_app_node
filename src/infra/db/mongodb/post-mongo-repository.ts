import { ObjectId } from 'mongodb'
import {
  AddPostRequestModel,
  AddPostResponseModel,
  CheckPostExistsResponseModel,
  LoadPostsByUidRequestModel,
  LoadPostsResponseModel,
  PostModel,
  UpdatePostRequestModel
} from '../../../data/models/posts'
import { AddPostRepository } from '../../../data/protocols/db/posts/add-post-repository'
import { CheckPostExistsByIdRepository } from '../../../data/protocols/db/posts/check-post-exists-by-id'
import { LoadAllPostsRepository } from '../../../data/protocols/db/posts/load-all-posts-repository'
import { LoadPostByIdRepository } from '../../../data/protocols/db/posts/load-post-by-id-respository'
import { LoadPostsByUidRepository } from '../../../data/protocols/db/posts/load-posts-by-uid-repository'
import { UpdatePostRepository } from '../../../data/protocols/db/posts/update-post-repository'
import { MongoHelper } from '../../helpers/mongo-helper'
import { QueryBuilder } from '../../helpers/query-builder-helper'

export class PostMongoRepository
implements
    AddPostRepository,
    LoadAllPostsRepository,
    LoadPostsByUidRepository,
    LoadPostByIdRepository,
    CheckPostExistsByIdRepository,
    UpdatePostRepository {
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
    return result.length > 0 ? MongoHelper.map(result[0]) : null
  }

  async checkById (id: string): Promise<CheckPostExistsResponseModel> {
    const collection = MongoHelper.getCollection('posts')
    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result && MongoHelper.map(result)
  }

  async update (post: UpdatePostRequestModel): Promise<void> {
    const collection = MongoHelper.getCollection('posts')
    await collection.updateOne(
      { _id: new ObjectId(post.id) },
      {
        $set: {
          title: post.title,
          content: post.content,
          uid: post.uid
        }
      }
    )
  }
}
