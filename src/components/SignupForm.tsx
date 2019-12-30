import React, { FormEvent, useState } from 'react'
import { Form, Input } from 'antd'

import { useAuth } from '../hooks/use-auth'

function SignupForm({ form }) {
  const [confirmDirty, updateConfirmDirty] = useState()
  const { signup } = useAuth()
  const { getFieldDecorator } = form

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    form.validateFields((err: any, vals: any) => {
      const { email, password } = vals

      if (!err) {
        signup(email, password)
      }
    })
  }

  function compareToFirstPassword(rule, value, cb) {
    if (value && value !== form.getFieldValue('password')) {
      cb("Passwords don't match")
    } else {
      cb()
    }
  }

  function validateToNextPassword(rule, value, cb) {
    if (value && confirmDirty) {
      form.validateFields('confirm', { force: true })
    }

    cb()
  }

  function handleConfirmBlur(event) {
    const { value } = event.target

    updateConfirmDirty({ confirmDirty: confirmDirty || !!value })
  }

  return (
    <Form onSubmit={handleSubmit} className="signup-form" layout="horizontal">
      <Form.Item label="E-mail">
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'This is not a valid email address',
            },
            {
              required: true,
              message: 'Please type your email',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Password" hasFeedback>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please type a password',
            },
            {
              validator: validateToNextPassword,
            },
          ],
        })(<Input.Password />)}
      </Form.Item>
      <Form.Item label="Confirm password" hasFeedback>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password',
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(<Input.Password onBlur={handleConfirmBlur} />)}
      </Form.Item>
    </Form>
  )
}

const WrappedSignupForm = Form.create({ name: 'signup' })(SignupForm)

export { WrappedSignupForm as SignupForm }
