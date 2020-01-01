import React, { FormEvent, useState } from 'react'
import { Form, Input, Button, Icon } from 'antd'

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

  function compareToFirstPassword(
    _rule: never,
    value: string,
    cb: (args?: string) => void,
  ) {
    if (value && value !== form.getFieldValue('password')) {
      cb("Passwords don't match")
    } else {
      cb()
    }
  }

  function validateToNextPassword(
    _rule: never,
    value: string,
    cb: (args?: string) => void,
  ) {
    if (value && confirmDirty) {
      form.validateFields('confirm', { force: true })
    }

    cb()
  }

  function handleConfirmBlur(event: any) {
    const { value } = event.target

    updateConfirmDirty({ confirmDirty: confirmDirty || !!value })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
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
        })(
          <Input
            type="email"
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
          />,
        )}
      </Form.Item>
      <Form.Item hasFeedback>
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
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item hasFeedback>
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
        })(
          <Input.Password
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onBlur={handleConfirmBlur}
            placeholder="Confirm password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

const WrappedSignupForm = Form.create({ name: 'signup' })(SignupForm)

export { WrappedSignupForm as SignupForm }
