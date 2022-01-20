import { LogErrorRepository } from '../../../data/protocols/db/log/log-error-repository'
import { MongoHelper } from '../../helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('error')
    await collection.insertOne({ stack, date: new Date() })
  }
}
