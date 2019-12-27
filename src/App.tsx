import React from 'react'
import { Row, Col } from 'antd'

import { ExpenseForm } from './ExpenseForm'

import './App.css'

const App: React.FC = () => {
  return (
    <Row>
      <Col span={12} offset={6}>
        <ExpenseForm />
      </Col>
    </Row>
  )
}

export default App
