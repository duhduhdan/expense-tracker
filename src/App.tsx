import React, { useState } from 'react'
import { Layout, Icon, Menu, Typography, Row, PageHeader, Avatar } from 'antd'

import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseTable } from './components/ExpenseTable'
import { Lollipop } from './components/Lollipop'

const { Header, Content, Sider } = Layout
const { SubMenu } = Menu
const { Text } = Typography

function App() {
  const [collapsed, updateCollapsed] = useState<boolean>(true)

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sider collapsed={collapsed} onCollapse={updateCollapsed}>
        <Row type="flex" justify="center" align="middle">
          <Text
            style={{ color: '#fff', margin: 0, padding: '8px 0', fontSize: 16 }}
            strong
          >
            Kostnadr
          </Text>
        </Row>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Icon type="rise" />
            <span>Expenses</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="dashboard" />
            <span>Bills</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ backgroundColor: '#fff' }}>
        <Header style={{ background: '#fff', padding: '0 16px' }}>
          <Row
            type="flex"
            style={{ width: '100%' }}
            justify="space-between"
            align="middle"
          >
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => updateCollapsed(!collapsed)}
            />
            <div>
              <Avatar icon="user" size="small" />
              <Text style={{ paddingLeft: 8 }}>Username</Text>
            </div>
          </Row>
        </Header>
        <Content style={{ padding: 16 }}>
          <PageHeader
            title="Expenses"
            subTitle="December 2019"
            style={{
              border: '1px solid rgb(235, 237, 240)',
            }}
          />
          <ExpenseForm />
          <ExpenseTable />
          <Lollipop />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
