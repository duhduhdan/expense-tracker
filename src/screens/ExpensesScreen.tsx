import React, { useEffect, useState } from 'react'
import {
  Layout,
  Icon,
  Menu,
  Row,
  Avatar,
  Button,
  Dropdown,
  Typography,
  PageHeader,
  Statistic,
} from 'antd'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'
import moment from 'moment'

import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseTable } from '../components/ExpenseTable'
import { useAuth } from '../hooks/use-auth'
import { IExpense } from '../model/expense'

const { Header, Content, Sider } = Layout
const { SubMenu } = Menu
const { Text } = Typography

type Props = { expenses: IExpense[] }

function ExpensesScreen({ expenses }: Props) {
  const [minMaxExpense, updateMinMaxExpense] = useState<{
    min: number
    max: number
  }>({ min: 0.0, max: 0.0 })
  const [totalSpent, updateTotalSpent] = useState<number>(0.0)
  const [collapsed, updateCollapsed] = useState<boolean>(true)
  const { user, signout } = useAuth()

  useEffect(() => {
    updateTotalSpent(
      expenses.reduce((accum, curr) => (accum += curr.amount), 0),
    )

    updateMinMaxExpense({
      max: expenses.reduce((accum, curr) => Math.max(accum, curr.amount), 0),
      min: expenses.reduce((accum, curr) => Math.min(accum, curr.amount), 0),
    })
  }, [expenses])

  return (
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
              trigger={['click']}
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
                <Button>
                  <Avatar icon="user" size="small" />
                  <Text style={{ paddingLeft: 8 }}>
                    {user && user.email}
                  </Text>{' '}
                  <Icon type="down" />
                </Button>
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
          >
            <Row type="flex">
              <Statistic
                title="Total spent"
                prefix="$"
                value={totalSpent.toFixed(2)}
              />
              <Statistic
                title="Largest expense"
                value={minMaxExpense.max}
                prefix="$"
                style={{ margin: '0 32px' }}
              />
            </Row>
          </PageHeader>
          <Row>
            <ExpenseForm />
          </Row>
          <Row>
            <ExpenseTable />
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

const ObservableExpensesScreen = withDatabase(
  withObservables([] as never[], ({ database }) => ({
    expenses: database.collections
      .get('expenses')
      .query(
        Q.where(
          'date',
          Q.like(`%${Q.sanitizeLikeString(moment().format('MM'))}%`),
        ),
      )
      .observe(),
  }))(ExpensesScreen),
)

export { ObservableExpensesScreen as ExpensesScreen }
