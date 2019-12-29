import React from 'react'
import { Table, Button, Popconfirm } from 'antd'
import moment from 'moment'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

import { deleteExpense } from '../actions/expenses'
import { IExpense } from '../model/Expense'

function ExpenseTable({
  expenses,
}: {
  expenses: IExpense[]
}): React.ReactElement {
  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string) =>
        `$${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: any) => (
        <Popconfirm
          title="Are you sure you want to delete this expense?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleConfirm(record['_raw'].id)}
        >
          <Button size="small" type="danger">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const sortedExpenses = expenses.sort((a: any, b: any) =>
    moment.utc(b.date).diff(moment.utc(a.date)),
  )

  async function handleConfirm(id: string): Promise<void> {
    await deleteExpense({ id })
  }

  return (
    <Table
      columns={columns}
      dataSource={sortedExpenses}
      rowKey={(record, index) => `${record.date}--${index}`}
    />
  )
}

const ObservableExpenseTable = withDatabase(
  withObservables([] as never[], ({ database }) => ({
    expenses: database.collections
      .get('expenses')
      .query()
      .observe(),
  }))(ExpenseTable),
)

export { ObservableExpenseTable as ExpenseTable }
