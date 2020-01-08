import React, { FormEvent, useRef, useState, RefObject } from 'react'
import { Button, Form, Select, DatePicker, InputNumber, Input } from 'antd'
import { Moment } from 'moment'

import { createExpense } from '../actions/expenses'

type Vals = {
  expense_date: Moment
  expense_item: string
  expense_amount: number
  expense_category: string
}

function ExpenseForm({ form }): React.ReactElement {
  const { getFieldDecorator } = form

  const [dataSource, updateDataSource] = useState<any>([])

  const itemInput: RefObject<Input> = useRef()

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    form.validateFields(async (err: any, vals: Vals) => {
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

        await createExpense(expense)

        form.setFieldsValue({
          expense_amount: '',
          expense_item: '',
        })

        if (itemInput && itemInput.current) {
          itemInput.current.focus()
        }
      }
    })
  }

  return (
    <Form
      layout="inline"
      onSubmit={handleSubmit}
      style={{ width: '100%', padding: '16px 0 32px' }}
      labelCol={{ xs: 24, sm: 8 }}
      wrapperCol={{ xs: 24, sm: 16 }}
    >
      <Form.Item label="Category:">
        {getFieldDecorator(`expense_category`, {
          rules: [{ required: true, message: 'Select a category' }],
        })(
          <Select
            placeholder="Select a category"
            style={{ width: 160 }}
            autoFocus
            showSearch
          >
            <Select.Option value="Grocery">Grocery</Select.Option>
            <Select.Option value="Snack">Snack</Select.Option>
            <Select.Option value="Clothes">Clothes</Select.Option>
            <Select.Option value="Living">Living</Select.Option>
            <Select.Option value="Investments">Investments</Select.Option>
            <Select.Option value="Entertainment">Entertainment</Select.Option>
            <Select.Option value="Transportation">Transportation</Select.Option>
            <Select.Option value="Subscriptions">Subscriptions</Select.Option>
            <Select.Option value="Medical">Medical</Select.Option>
            <Select.Option value="Misc">Misc</Select.Option>
            <Select.Option value="Bills">Bills</Select.Option>
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
        })(<Input placeholder="Enter an item" ref={itemInput} />)}
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
              value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
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
  )
}

const WrappedExpenseForm = Form.create({ name: 'expense_form' })(ExpenseForm)

export { WrappedExpenseForm as ExpenseForm }
