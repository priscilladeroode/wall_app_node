import {
  AddAccountRequestEntity,
  AddAccountResponseEntity
} from '../../entities/users'

export interface AddAccount {
  add: (account: AddAccountRequestEntity) => AddAccountResponseEntity
}
