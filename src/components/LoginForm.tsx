import React, { FormEvent, useEffect } from 'react'
import { Form, Icon, Input, Button, Checkbox, Row, Alert } from 'antd'

import { useAuth } from '../hooks/use-auth'

function LoginForm({ form }) {
  const { login, errors, sendPasswordResetEmail } = useAuth()
  const { getFieldDecorator } = form

  useEffect(() => {
    if (errors) {
      form.resetFields()
    }
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    form.validateFields((err: any, vals: any) => {
      const { email, password } = vals

      if (!err) {
        form.resetFields()
        login(email, password)
      }
    })
  }

  return (
    <div>
      {errors ? (
        <Alert
          type="error"
          message={errors.message}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Form onSubmit={handleSubmit} layout="horizontal">
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
            <Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
            <Button
              type="link"
              onClick={() =>
                sendPasswordResetEmail(form.getFieldValue('email'))
              }
            >
              Forgot password?
            </Button>
          </Row>
          <Row type="flex" align="stretch">
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  )
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm)

export { WrappedLoginForm as LoginForm }
