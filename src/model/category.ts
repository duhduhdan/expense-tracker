import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export interface ICategory {
  name: string
}

export default class Expense extends Model {
  static table = 'categories'

  @field('name')
  publicname: string
}
