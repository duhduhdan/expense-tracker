import React, { FormEvent, useEffect, useState } from 'react'
import {
  Button,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Table,
  Input,
} from 'antd'

function ExpenseForm({ form }): JSX.Element {
  const { getFieldDecorator } = form
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
    },
  ]
  const categoryRef = React.createRef()
  const [dataSource, updateDataSource] = useState<any>([])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    form.validateFields(async (err: any, vals: any) => {
      if (!err) {
        const newData = {
          date: vals['expense_date'].utc().format(),
          item: vals['expense_item'],
          amount: vals['expense_amount'],
          category: vals['expense_category'],
        }

        updateDataSource([...dataSource, newData])

        form.setFieldsValue({
          expense_amount: '',
          expense_category: '',
          expense_date: null,
          expense_item: '',
        })
      }
    })
  }

  return (
    <>
      <Row>
        <Form
          layout="inline"
          onSubmit={handleSubmit}
          style={{ width: '100%', padding: '16px 0 32px' }}
        >
          <Form.Item label="Category:">
            {getFieldDecorator(`expense_category`, {
              rules: [{ required: true, message: 'Select a category' }],
            })(
              <Select
                placeholder="Select a category"
                style={{ width: 160 }}
                autoFocus
              >
                <Select.Option value="Grocery">Grocery</Select.Option>
                <Select.Option value="Clothes">Clothes</Select.Option>
                <Select.Option value="Living">Living</Select.Option>
                <Select.Option value="Investments">Investments</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Date:">
            {getFieldDecorator(`expense_date`, {
              rules: [{ required: true, message: 'Pick a date' }],
            })(<DatePicker />)}
          </Form.Item>

          <Form.Item label="Item:">
            {getFieldDecorator(`expense_item`, {
              rules: [
                {
                  required: true,
                  message: 'Provide an item',
                },
              ],
            })(<Input placeholder="Enter an item" />)}
          </Form.Item>

          <Form.Item label="Amount:">
            {getFieldDecorator(`expense_amount`, {
              rules: [
                {
                  required: true,
                  message: 'Provide an amount',
                },
              ],
            })(
              <InputNumber
                placeholder="Enter an amount"
                step={0.01}
                style={{ width: 160 }}
                max={Infinity}
                formatter={value =>
                  value
                    ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : ''
                }
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button icon="plus" type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Row>

      <Row>
        <Table columns={columns} dataSource={dataSource} />
      </Row>
    </>
  )
}

const WrappedExpenseForm = Form.create({ name: 'expense_form' })(ExpenseForm)

export { WrappedExpenseForm as ExpenseForm }
