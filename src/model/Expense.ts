import { Model } from '@nozbe/watermelondb'
import { field } from '@nozbe/watermelondb/decorators'

export interface IExpense {
  date: string
  item: string
  amount: number
  category: string
}

export default class Expense extends Model {
  static table = 'expenses'

  @field('date')
  public date: string

  @field('item')
  public item: string

  @field('amount')
  public amount: number

  @field('category')
  public category: string
}
