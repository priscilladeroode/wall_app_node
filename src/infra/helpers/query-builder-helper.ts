export class QueryBuilder {
  private readonly query = []

  private addStep (step: string, data: object): QueryBuilder {
    this.query.push({
      [step]: data
    })
    return this
  }

  sort (data: object): QueryBuilder {
    return this.addStep('$sort', data)
  }

  unwind (data: object): QueryBuilder {
    return this.addStep('$unwind', data)
  }

  lookup (data: object): QueryBuilder {
    return this.addStep('$lookup', data)
  }

  project (data: object): QueryBuilder {
    return this.addStep('$project', data)
  }

  match (data: object): QueryBuilder {
    return this.addStep('$match', data)
  }

  build (): object[] {
    return this.query
  }
}
