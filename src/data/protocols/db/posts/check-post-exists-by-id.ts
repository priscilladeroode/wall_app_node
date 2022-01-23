import {
  CheckPostExistsRequestModel,
  CheckPostExistsResponseModel
} from '../../../models/posts'

export interface CheckPostExistsByIdRepository {
  checkById: (
    id: CheckPostExistsRequestModel
  ) => Promise<CheckPostExistsResponseModel>
}
