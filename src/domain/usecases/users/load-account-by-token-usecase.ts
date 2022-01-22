import {
  LoadAccountByTokenRequestEntity,
  LoadAccountByTokenResponseEntity
} from '../../entities/users'

export interface LoadAccountByTokenUseCase {
  loadByToken: (
    entity: LoadAccountByTokenRequestEntity
  ) => Promise<LoadAccountByTokenResponseEntity>
}
