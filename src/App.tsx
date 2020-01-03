import React, { useState } from 'react'
import {
  Layout,
  Icon,
  Menu,
  Typography,
  Row,
  PageHeader,
  Avatar,
  Modal,
  Button,
  Dropdown,
  Col,
} from 'antd'
import moment from 'moment'

import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseTable } from './components/ExpenseTable'
import { LoginForm } from './components/LoginForm'
import { SignupForm } from './components/SignupForm'
import { BarChart } from './components/BarChart'
import { RadarChart } from './components/RadarChart'
import { useAuth } from './hooks/use-auth'

const { Header, Content, Sider } = Layout
const { SubMenu } = Menu
const { Text } = Typography

function App() {
  const [signingUp, updateSigningUp] = useState<boolean>(false)
  const [collapsed, updateCollapsed] = useState<boolean>(true)
  const { user, signout } = useAuth()

  return (
    <>
      <Modal
        title={
          signingUp ? (
            <>
              <Button
                shape="circle"
                icon="left"
                size="small"
                onClick={() => updateSigningUp(false)}
                style={{ marginRight: 8 }}
              />{' '}
              <Text>Register</Text>
            </>
          ) : (
            <Text>Login</Text>
          )
        }
        visible={!user}
        footer={null}
      >
        {signingUp ? (
          <SignupForm />
        ) : (
          <>
            <LoginForm />
            <Row>
              <Button type="link" onClick={() => updateSigningUp(true)}>
                Register now!
              </Button>
            </Row>
          </>
        )}
      </Modal>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Sider collapsed={collapsed} onCollapse={updateCollapsed}>
          <Row type="flex" justify="center" align="middle">
            <Text
              style={{
                color: '#fff',
                margin: 0,
                padding: '8px 0',
                fontSize: 16,
              }}
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
          <Header
            style={{ background: '#fff', padding: '0 16px', width: '100%' }}
          >
            <Row type="flex" justify="space-between" align="middle">
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={() => updateCollapsed(!collapsed)}
              />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Button type="link" onClick={signout}>
                        Sign out
                      </Button>
                    </Menu.Item>
                  </Menu>
                }
              >
                <div>
                  <Avatar icon="user" size="small" />
                  <Text style={{ paddingLeft: 8 }}>
                    {user && user.email}
                  </Text>{' '}
                  <Icon type="down" />
                </div>
              </Dropdown>
            </Row>
          </Header>
          <Content style={{ padding: 16 }}>
            <PageHeader
              title="Expenses"
              subTitle={moment().format('MMMM YYYY')}
              style={{
                border: '1px solid rgb(235, 237, 240)',
              }}
            />
            <Row>
              <Col span={12}>
                <BarChart />
              </Col>
              <Col span={12}>
                <RadarChart />
              </Col>
            </Row>
            <Row>
              <ExpenseForm />
            </Row>
            <Row>
              <ExpenseTable />
            </Row>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
