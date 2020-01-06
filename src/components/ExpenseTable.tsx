import React, { useState, useRef } from 'react'
import { Table, Button, Popconfirm, Input, Icon, Row } from 'antd'
import Highlighter from 'react-highlight-words'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb'
import moment from 'moment'

import { deleteExpense } from '../actions/expenses'
import { IExpense } from '../model/expense'

type Props = { expenses: IExpense[] }

function ExpenseTable({ expenses }: Props): React.ReactElement<Props> {
  const [searchText, updateSearchText] = useState<string>(null)
  const [searchedColumn, updateSearchedColumn] = useState<string>(null)
  // const [editing, updateEditing] = useState<string>(null)
  const searchInput = useRef(null)

  // function EditableCell({
  //   editing,
  //   dataIndex,
  //   title,
  //   inputType,
  //   record,
  //   index,
  //   children,
  //   ...rest
  // }) {
  //   return editing ? undefined : null
  // }

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
    updateSearchText(null)
  }

  function getColumnSearchProps(dataIndex: string) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder="Search categories"
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current.select())
        }
      },
      render: (text: string) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            textToHighlight={text.toString()}
            autoEscape
          />
        ) : (
          text
        ),
    }
  }
  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'),
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
      // render: (item: string): React.ReactElement => (
      //   <Input
      //     value={editing || item}
      //     onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      //       updateEditing(event.target.value)
      //     }}
      //   />
      // ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `$${text.toFixed(2)}`,
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: any): React.ReactElement => (
        <Row>
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
          <Button size="small" type="primary" style={{ marginLeft: 8 }}>
            Update
          </Button>
        </Row>
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
      .query(
        Q.where(
          'date',
          Q.like(`%${Q.sanitizeLikeString(moment().format('MM'))}%`),
        ),
      )
      .observe(),
  }))(ExpenseTable),
)

export { ObservableExpenseTable as ExpenseTable }
