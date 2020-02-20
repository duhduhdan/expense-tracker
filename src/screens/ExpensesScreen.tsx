import React, { useEffect, useState } from 'react'
import {
  Layout,
  Icon,
  Row,
  Col,
  Typography,
  Statistic,
  Card,
  Modal,
  Calendar,
} from 'antd'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'
import moment, { Moment } from 'moment'

import { createExpense } from '../actions/expenses'
import { ColumnChart } from '../components/ColumnChart'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseTable } from '../components/ExpenseTable'
import { Screen } from '../components/Screen'
import { useAuth } from '../hooks/use-auth'
import { IExpense } from '../model/expense'
import { getExpenses } from '../services/request/expense'
import { calculateMonthOverMonth } from '../utils/statistics'

const { Content } = Layout
const { Text } = Typography

type Props = {
  expenses: IExpense[]
  lastMonthExpenses: IExpense[]
  database: any
}

function ExpensesScreen({ expenses, lastMonthExpenses, database }: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [monthToView, setMonthToView] = useState<string>(null)
  const [currentMonth, setCurrentMonth] = useState<string>(null)
  const [totalSpent, setTotalSpent] = useState<number>(0.0)
  const [monthOverMonth, setMonthOverMonth] = useState<number>(0)
  const { user } = useAuth()

  function setMonthYear(date: Moment) {
    setMonthToView(moment(date, 'L').format('MM'))
    setCurrentMonth(moment(date, 'L').format('MMMM YYYY'))
    setModalVisible(false)
  }

  useEffect(() => {
    setTotalSpent(expenses.reduce((accum, curr) => (accum += curr.amount), 0))

    if (lastMonthExpenses) {
      setMonthOverMonth(() =>
        calculateMonthOverMonth(expenses, lastMonthExpenses),
      )
    }

    const latestTimestamp =
      expenses && expenses.length
        ? expenses.sort(
            (a: any, b: any): any => a.last_modified < b.last_modified,
          )[0].last_modified
        : 1

    async function create() {
      if (user && latestTimestamp) {
        const { expenses: expensesRes } = await getExpenses({
          uid: user.uid,
          since: latestTimestamp,
        })

        if (expensesRes.length > 0) {
          expensesRes.forEach(async expense => {
            await createExpense(expense)
          })
        }
      }
    }

    // create()
  }, [expenses, lastMonthExpenses, user])

  return (
    <Screen showModal={() => setModalVisible(true)} month={currentMonth}>
      <Modal
        title="View month"
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <Calendar mode="year" onSelect={setMonthYear} />
      </Modal>

      <Content style={{ padding: 32 }}>
        <Row type="flex" gutter={32}>
          <Col span={12}>
            <Card
              title={
                <Row type="flex" align="middle">
                  <Icon
                    type="calculator"
                    style={{ fontSize: 24, marginRight: 8 }}
                  />
                  <Text>Total spent</Text>
                </Row>
              }
            >
              <Statistic
                prefix={<Icon type="dollar" style={{ marginRight: 8 }} />}
                value={totalSpent}
                precision={2}
                valueStyle={{ fontSize: 32 }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title={
                <Row type="flex" align="middle">
                  <Icon type="fall" style={{ fontSize: 24, marginRight: 8 }} />
                  <Text>MoM change</Text>
                </Row>
              }
            >
              <Statistic
                prefix={
                  <Icon
                    type={monthOverMonth > 0 ? 'frown' : 'smile'}
                    style={{ marginRight: 8 }}
                  />
                }
                value={monthOverMonth}
                precision={0}
                valueStyle={{
                  fontSize: 32,
                }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        <Row type="flex" style={{ paddingTop: 32 }}>
          <Col span={24}>
            <Card
              title={
                <Row type="flex" align="middle">
                  <Icon
                    type="bar-chart"
                    style={{ fontSize: 24, marginRight: 8 }}
                  />
                  <Text>Expenses breakdown</Text>
                </Row>
              }
            >
              <ColumnChart month={monthToView} database={database} />
            </Card>
          </Col>
        </Row>

        <Row type="flex" style={{ paddingTop: 32 }}>
          <Col span={24}>
            <Card
              title={
                <Row type="flex" align="middle">
                  <Icon
                    type="schedule"
                    style={{ fontSize: 24, marginRight: 8 }}
                  />
                  <Text>Manage expenses</Text>
                </Row>
              }
            >
              <Col span={24}>
                <ExpenseForm />
              </Col>
              <Col span={24}>
                <ExpenseTable month={monthToView} database={database} />
              </Col>
            </Card>
          </Col>
        </Row>
      </Content>
    </Screen>
  )
}

const enhance = withObservables(['month'], ({ database, month }: any) => ({
  lastMonthExpenses: database.collections
    .get('expenses')
    .query(
      Q.where(
        'date',
        Q.like(
          `%^${moment()
            .subtract(1, 'months')
            .format('MM')}%`,
        ),
      ),
    )
    .observe(),
  expenses: database.collections
    .get('expenses')
    .query(Q.where('date', Q.like(`%^${month || moment().format('MM')}%`)))
    .observe(),
}))

const ObservableExpensesScreen = enhance(ExpensesScreen)

export { ObservableExpensesScreen as ExpensesScreen }
