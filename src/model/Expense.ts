import { Model } from '@nozbe/watermelondb'
import { action, field } from '@nozbe/watermelondb/decorators'
import { Q } from '@nozbe/watermelondb'
import moment from 'moment'

export interface IExpense {
  date: string
  item: string
  amount: number
  category: string
  last_modified: number
  getExpenses: (month_begin: string) => Promise<void>
}

export default class Expense extends Model {
  static table = 'expenses'

  @field('last_modified')
  public last_modified: number

  @field('date')
  public date: string

  @field('item')
  public item: string

  @field('amount')
  public amount: number

  @field('category')
  public category: string

  @action async getExpenses(month_begin: string) {
    return await this.collections
      .get('expenses')
      .query(
        Q.where('date', Q.like(`%^${month_begin || moment().format('MM')}%`)),
      )
  }
}
