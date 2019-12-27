import React, { FormEvent, useState } from 'react'
import { Button, Form, Select, DatePicker, InputNumber, Row } from 'antd'

function ExpenseForm({ form }): JSX.Element {
  const { getFieldDecorator } = form
  const [formRows, updateFormRows] = useState<JSX.Element[]>([renderRow(0)])

  function renderRow(i: number) {
    return (
      <div key={`${Date.now()}--${i}`}>
        <Form.Item label="Date:">
          {getFieldDecorator(`expense_date--${i}`, {
            rules: [{ required: true, message: 'Pick a date' }],
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="Amount:">
          {getFieldDecorator(`expense_amount--${i}`, {
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
              formatter={value =>
                value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
              }
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              style={{ width: 160 }}
            />,
          )}
        </Form.Item>

        <Form.Item label="Category:">
          {getFieldDecorator(`expense_category--${i}`, {
            rules: [{ required: true, message: 'Select a category' }],
          })(
            <Select placeholder="Select a category" style={{ width: 160 }}>
              <Select.Option value="grocery">Grocery</Select.Option>
              <Select.Option value="clothes">Clothes</Select.Option>
              <Select.Option value="rent">Rent</Select.Option>
              <Select.Option value="investments">Investments</Select.Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item>
          <Button
            size="small"
            shape="circle"
            icon="plus"
            type="primary"
            htmlType="submit"
          />
        </Form.Item>
      </div>
    )
  }

  function getFormRows(amountToRender?: number) {
    for (let i = 0; i < amountToRender; i++) {
      updateFormRows([...formRows, renderRow(i)])
    }
  }

  function handleSubmit<V>(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()

    form.validateFields((err: any, vals: V) => {
      if (!err) {
        getFormRows(formRows.length + 1)
      }
    })
  }

  return (
    <section>
      <Row>
        <Form layout="inline" onSubmit={handleSubmit} style={{ width: '100%' }}>
          {renderRow(0)}
        </Form>
      </Row>

      <Row>
        <Button type="primary" onClick={() => getFormRows(formRows.length + 5)}>
          Add 5 more
        </Button>
      </Row>
    </section>
  )
}

const WrappedExpenseForm = Form.create({ name: 'expense_form' })(ExpenseForm)

export { WrappedExpenseForm as ExpenseForm }
