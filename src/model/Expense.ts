import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export default class Expense extends Model {
  static table = 'expenses'

  @field('date') date: string
  @field('item') item: string
  @field('amount') amount: number
  @field('category') category: string
}
