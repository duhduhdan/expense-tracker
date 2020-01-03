import React, { useState, useRef } from 'react'
import { Table, Button, Popconfirm, Input, Icon } from 'antd'
import moment from 'moment'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

import { deleteExpense } from '../actions/expenses'
import { IExpense } from '../model/expense'

type Props = { expenses: IExpense[] }

function ExpenseTable({ expenses }: Props): React.ReactElement<Props> {
  const [searchText, updateSearchText] = useState<string>(null)
  const [searchedColumn, updateSearchedColumn] = useState<string>(null)
  const searchInput = useRef(null)

  function handleSearch(
    selectedKeys: any[],
    confirm: Function,
    dataIndex: string,
  ) {
    confirm()

    updateSearchText(selectedKeys[0])
    updateSearchedColumn(dataIndex)
  }

  function handleReset(clearFilters: Function) {
    clearFilters()
    updateSearchText('')
  }

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search categories`}
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'category')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, 'category')}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <Icon
          type="search"
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      ),
      onFilter: (value: string, record: any) =>
        record['category']
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current.select())
        }
      },
      render: (text: string) =>
        searchedColumn === 'category' ? searchText : text,
    },
    {
      title: 'Purchase date',
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
      title: '',
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
    moment.utc(b.date, 'L').diff(moment.utc(a.date, 'L')),
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
