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
import { AreaChart } from '../components/AreaChart'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseTable } from '../components/ExpenseTable'
import { Screen } from '../components/Screen'
import { useAuth } from '../hooks/use-auth'
import { IExpense } from '../model/expense'
import { getExpenses } from '../services/request/expense'

const { Content } = Layout
const { Text } = Typography

type Props = { expenses: IExpense[]; database: any }

function ExpensesScreen({ expenses, database }: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [monthToView, setMonthToView] = useState<string>(null)
  const [currentMonth, setCurrentMonth] = useState<string>(null)
  const [totalSpent, setTotalSpent] = useState<number>(0.0)
  const { user } = useAuth()
  const latestTimestamp =
    expenses && expenses.length
      ? expenses.sort(
          (a: any, b: any): any => a.last_modified < b.last_modified,
        )[0].last_modified
      : 1

  function setMonthYear(date: Moment) {
    setMonthToView(moment(date, 'L').format('MM'))
    setCurrentMonth(moment(date, 'L').format('MMMM YYYY'))
    setModalVisible(false)
  }

  useEffect(() => {
    setTotalSpent(expenses.reduce((accum, curr) => (accum += curr.amount), 0))
  }, [expenses])

  useEffect(() => {
    async function create() {
      if (user && latestTimestamp) {
        const { expenses: expensesRes } = await getExpenses({
          uid: user.uid,
          since: latestTimestamp,
        })

        if (expensesRes) {
          expensesRes.forEach(async expense => {
            await createExpense(expense)
          })
        }
      }
    }
    // create()
  }, [user])

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
        <Row type="flex">
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

        <Row type="flex" style={{ paddingTop: 32 }}>
          <Col span={24}>
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
                prefix="$"
                value={totalSpent}
                precision={2}
                valueStyle={{ fontSize: 32 }}
              />
              {/* <AreaChart month={monthToView} database={database} /> */}
            </Card>
          </Col>
        </Row>
      </Content>
    </Screen>
  )
}

const enhance = withObservables(['month'], ({ database, month }: any) => ({
  expenses: database.collections
    .get('expenses')
    .query(Q.where('date', Q.like(`%^${month || moment().format('MM')}%`)))
    .observe(),
}))

const ObservableExpensesScreen = enhance(ExpensesScreen)

export { ObservableExpensesScreen as ExpensesScreen }
