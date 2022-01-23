export interface DeletePostByIdRepository {
  deleteById: (id: string) => Promise<void>
}
