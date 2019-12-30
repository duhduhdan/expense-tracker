import React, { FormEvent } from 'react'
import { Form, Icon, Input, Button, Checkbox, Row } from 'antd'

import { useAuth } from '../hooks/use-auth'

function LoginForm({ form }) {
  const { signin } = useAuth()
  const { getFieldDecorator } = form

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    form.validateFields((err: any, vals: any) => {
      const { email, password } = vals

      if (!err) {
        signin(email, password)
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit} className="login-form" layout="horizontal">
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
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [
            { required: true, message: 'Oopsie doopsie, we need a password' },
          ],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Row type="flex" justify="space-between" align="middle">
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Row>
        <Row type="flex" align="stretch">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: '100%' }}
          >
            Log in
          </Button>
        </Row>
      </Form.Item>
    </Form>
  )
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm)

export { WrappedLoginForm as LoginForm }
