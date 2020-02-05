import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import { LineChart } from '@opd/g2plot-react'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'

function Area({ expenses }) {
  const [chartConfig, setChartConfig] = useState(null)
  const config = {
    forceFit: true,
    xField: 'date',
    yField: 'amount',
    height: 347,
    // xAxis: {
    //   visible: false,
    // },
    // yAxis: {
    //   visible: false,
    // },
    // line: {
    //   visible: false,
    // },
    smooth: true,
    padding: 'auto',
  }

  useEffect(() => {
    const data = expenses
      .map((expense: any) => ({ date: expense.date, amount: expense.amount }))
      .reduce((accum: any[], curr: any) => {
        const found = accum.find(a => a.date === curr.date)

        if (!found) {
          return [...accum, { date: curr.date, amount: curr.amount }]
        } else {
          found.amount += curr.amount
        }

        return accum
      }, [])
      .sort((a: any, b: any): any => moment(a.date, 'L') > moment(b.date, 'L'))

    console.log({ ...config, data })

    setChartConfig({ ...config, data })
  }, [expenses])

  return <LineChart {...chartConfig} />
}

const enhance = withObservables(['month'], ({ database, month }: any) => ({
  expenses: database.collections
    .get('expenses')
    .query(Q.where('date', Q.like(`%^${month || moment().format('MM')}%`)))
    .observe(),
}))

const ObservableAreaChart = enhance(Area)

export { ObservableAreaChart as AreaChart }
