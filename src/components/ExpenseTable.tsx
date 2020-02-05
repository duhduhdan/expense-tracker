import React, { createContext, useState, useRef } from 'react'
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  Icon,
  Row,
  Tooltip,
} from 'antd'
import Highlighter from 'react-highlight-words'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'
import moment from 'moment'

import { deleteExpense, updateExpense } from '../actions/expenses'

const EditableContext = createContext(null)

function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...rest
}) {
  function getInput(): React.ReactElement<InputNumber | Input> {
    if (inputType === 'number') {
      return <InputNumber />
    }

    return <Input />
  }

  function renderCell({
    getFieldDecorator,
  }): React.ReactElement<HTMLTableDataCellElement> {
    return (
      <td {...rest}>
        {editing ? (
          <Form.Item style={{ margin: 0, padding: 0 }}>
            {getFieldDecorator(dataIndex, {
              initialValue: record[dataIndex],
            })(getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
}

function ExpenseTable({ expenses, form }): React.ReactElement {
  const sortedExpenses = expenses.sort((a: any, b: any) =>
    moment.utc(b.date, 'L').diff(moment.utc(a.date, 'L')),
  )
  const [searchText, updateSearchText] = useState<string>(null)
  const [searchedColumn, updateSearchedColumn] = useState<string>(null)
  const [editingKey, setEditingKey] = useState<string>(null)
  const searchInput = useRef(null)

  const tableColumns = [
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
      editable: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `$${text.toFixed(2)}`,
      editable: true,
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: any): React.ReactElement => {
        const editable = isEditing(record)

        return (
          <Row>
            <Popconfirm
              title="Are you sure you want to delete this expense?"
              okText="Yes"
              cancelText="No"
              onConfirm={async () =>
                await deleteExpense({ id: record['_raw'].id })
              }
            >
              <Tooltip
                title="Delete"
                placement="bottom"
                trigger={editable ? 'focus' : 'hover'}
              >
                <Button size="small" type="danger">
                  <Icon type="delete" />
                </Button>
              </Tooltip>
            </Popconfirm>
            {editable ? (
              <>
                <EditableContext.Consumer>
                  {form => (
                    <Tooltip title="Save" placement="bottom" trigger="focus">
                      <Button
                        size="small"
                        type="primary"
                        style={{ marginLeft: 8 }}
                        onClick={() => save(form, record['_raw'].id)}
                      >
                        <Icon type="save" />
                      </Button>
                    </Tooltip>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="Are you sure you want to cancel?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => setEditingKey('')}
                >
                  <Tooltip title="Cancel" placement="bottom" trigger="focus">
                    <Button size="small" style={{ marginLeft: 8 }}>
                      <Icon type="stop" />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </>
            ) : (
              <Tooltip title="Edit" placement="bottom">
                <Button
                  size="small"
                  type="primary"
                  style={{ marginLeft: 8 }}
                  disabled={editingKey && record['_raw'].id !== editingKey}
                  onClick={() => setEditingKey(record['_raw'].id)}
                >
                  <Icon type="edit" />
                </Button>
              </Tooltip>
            )}
          </Row>
        )
      },
    },
  ]

  const components = {
    body: {
      cell: EditableCell,
    },
  }

  const columns = tableColumns.map((col: any) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'amount' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  function handleSearch(
    selectedKeys: any[],
    confirm: () => void,
    dataIndex: string,
  ): void {
    confirm()
    updateSearchText(selectedKeys[0])
    updateSearchedColumn(dataIndex)
  }

  function handleReset(clearFilters: () => void): void {
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
      onFilter: (value: string, record: any) => {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
      },
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

  function isEditing(record: any): boolean {
    return record['_raw'].id === editingKey
  }

  function save(form: any, id: string): void {
    form.validateFields(async (err: any, vals: any) => {
      if (!err) {
        const expense = {
          item: vals.item,
          amount: vals.amount,
        }

        await updateExpense({ id, ...expense })

        setEditingKey(null)
      }
    })
  }

  return (
    <EditableContext.Provider value={form}>
      <Table
        components={components}
        columns={columns}
        dataSource={sortedExpenses}
        pagination={{
          onChange: () => setEditingKey(null),
        }}
        rowKey={(record: any, index: number) => `${record.date}--${index}`}
      />
    </EditableContext.Provider>
  )
}

const EditableFormTable = Form.create()(ExpenseTable)

const enhance = withObservables(['month'], ({ database, month }: any) => ({
  expenses: database.collections
    .get('expenses')
    .query(Q.where('date', Q.like(`%^${month || moment().format('MM')}%`)))
    .observe(),
}))

const ObservableExpenseTable = enhance(EditableFormTable)

export { ObservableExpenseTable as ExpenseTable }
