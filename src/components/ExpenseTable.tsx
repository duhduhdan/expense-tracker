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
} from 'antd'
import Highlighter from 'react-highlight-words'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb'
import moment from 'moment'

import { deleteExpense, updateExpense } from '../actions/expenses'
import { IExpense } from '../model/expense'

type Props = { expenses: IExpense[] }

const EditableContext = createContext(null)

class EditableCell extends React.Component<any> {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />
    }
    return <Input />
  }

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    )
  }
}

function ExpenseTable({ expenses, form }): React.ReactElement {
  const sortedExpenses = expenses.sort((a: any, b: any) =>
    moment.utc(b.date, 'L').diff(moment.utc(a.date, 'L')),
  )
  const [searchText, updateSearchText] = useState<string>(null)
  const [searchedColumn, updateSearchedColumn] = useState<string>(null)
  const [editingKey, setEditingKey] = useState<string>(null)
  const [dataSource, updateDataSource] = useState<any>(sortedExpenses)
  const searchInput = useRef(null)

  async function handleConfirm(id: string): Promise<void> {
    await deleteExpense({ id })
  }

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

  const tableColumns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category'),
      editable: true,
    },
    {
      title: 'Purchase date',
      dataIndex: 'date',
      key: 'date',
      editable: true,
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
              onConfirm={() => handleConfirm(record['_raw'].id)}
            >
              <Button size="small" type="danger">
                <Icon type="delete" />
              </Button>
            </Popconfirm>
            {editable ? (
              <Button
                size="small"
                type="ghost"
                style={{ marginLeft: 8 }}
                onClick={() => save(form, record['_raw'].id)}
              >
                <Icon type="edit" />
              </Button>
            ) : (
              <Button
                size="small"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => edit(record.key)}
              >
                <Icon type="edit" />
              </Button>
            )}
          </Row>
        )
      },
    },
  ]

  function isEditing(record) {
    return record.key === editingKey
  }

  function cancel() {
    setEditingKey('')
  }

  function edit(key) {
    setEditingKey(key)
  }

  function save(form, id) {
    form.validateFields(async (err: any, vals: any) => {
      if (!err) {
        const expense = {
          date: vals.expense_date.format('L'),
          item: vals.expense_item,
          amount: vals.expense_amount,
          category: vals.expense_category,
        }

        updateDataSource([
          ...dataSource,
          {
            key: Date.now(),
            ...expense,
          },
        ])

        await updateExpense({ id, ...expense })

        form.setFieldsValue({
          expense_amount: '',
          expense_category: '',
          expense_date: null,
          expense_item: '',
        })
      }
    })
  }

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

  return (
    <EditableContext.Provider value={form}>
      <Table
        components={components}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          onChange: cancel,
        }}
        rowKey={(record: any, index: number) => `${record.date}--${index}`}
      />
    </EditableContext.Provider>
  )
}

const EditableFormTable = Form.create()(ExpenseTable)

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
  }))(EditableFormTable),
)

export { ObservableExpenseTable as ExpenseTable }
