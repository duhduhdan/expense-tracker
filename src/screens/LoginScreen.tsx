import React, { useState } from 'react'
import { Layout, Typography, Row, Col, Button } from 'antd'

import { LoginForm } from '../components/LoginForm'
import { SignupForm } from '../components/SignupForm'

const { Paragraph, Title } = Typography

function LoginScreen() {
  const [signingUp, setSigningUp] = useState<boolean>(false)

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Col span={8} offset={8}>
        <Row style={{ paddingTop: 64 }}>
          <Typography style={{ textAlign: 'center', paddingBottom: 32 }}>
            <Title>Kostnadr</Title>
            <Paragraph>
              Expense tracking with a dash of data visualization
            </Paragraph>
          </Typography>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ paddingBottom: 32 }}
        >
          <Button
            size="large"
            type="link"
            onClick={() => setSigningUp(false)}
            style={{ marginRight: 32 }}
          >
            Log in
          </Button>
          <Button size="large" type="link" onClick={() => setSigningUp(true)}>
            Register
          </Button>
        </Row>
        <Row>{signingUp ? <SignupForm /> : <LoginForm />}</Row>
      </Col>
    </Layout>
  )
}

export { LoginScreen }
