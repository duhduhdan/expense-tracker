import React, { useEffect, useState } from 'react'
import { ColumnChart } from '@opd/g2plot-react'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'
import moment from 'moment'

function Column({ expenses }) {
  const [chartConfig, setChartConfig] = useState(null)
  const config = {
    forceFit: true,
    xField: 'category',
    yField: 'cost',
    height: 400,
    padding: 'auto',
    colorField: 'category',
    xAxis: {
      label: {
        visible: false,
      },
    },
    yAxis: {
      label: {
        visible: false,
      },
    },
    tooltip: {
      visible: true,
      shared: true,
      showTitle: false,
      htmlContent: (title: string, items: any[]) =>
        `<div>
            ${title} ${items && parseFloat(items[0].value).toFixed(2)}
          </div>`,
    },
  }

  useEffect(() => {
    const data = expenses
      .map((expense: any) => ({
        category: expense.category,
        cost: expense.amount,
      }))
      .reduce((total: any[], current: any) => {
        const found = total.find(t => t.category === current.category)

        if (!found) {
          return [...total, { category: current.category, cost: current.cost }]
        } else {
          found.cost += current.cost
        }

        return total
      }, [])

    setChartConfig({ ...config, data })
  }, [expenses])

  return <ColumnChart {...chartConfig} />
}

const enhance = withObservables(['month'], ({ database, month }: any) => ({
  expenses: database.collections
    .get('expenses')
    .query(Q.where('date', Q.like(`%^${month || moment().format('MM')}%`)))
    .observe(),
}))

const ObservableColumnChart = enhance(Column)

export { ObservableColumnChart as ColumnChart }
