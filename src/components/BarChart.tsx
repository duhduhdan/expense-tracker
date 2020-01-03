import React, { useRef, useEffect } from 'react'
import { Bar } from '@antv/g2plot'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

import { IExpense } from '../model/expense'

type Props = { expenses: IExpense[] }

function BarChart({ expenses }: Props): React.ReactElement<Props> {
  const chart = useRef(null)

  useEffect(() => {
    if (!chart.current) {
      return
    }

    const totals = expenses
      .map(expense => ({
        category: expense.category,
        cost: expense.amount,
      }))
      .reduce((total, current) => {
        const found = total.find(t => t.category === current.category)

        if (!found) {
          return [...total, { category: current.category, cost: current.cost }]
        } else {
          found.cost += current.cost
        }

        return total
      }, [])

    const graph = new Bar(chart.current, {
      title: {
        visible: true,
        text: 'Bar',
      },
      forceFit: true,
      data: totals,
      xField: 'cost',
      yField: 'category',
    })

    graph.render()
  }, [expenses])

  return <div ref={chart} />
}

const ObservableBarChart = withDatabase(
  withObservables([] as never[], ({ database }) => ({
    expenses: database.collections
      .get('expenses')
      .query()
      .observe(),
  }))(BarChart),
)

export { ObservableBarChart as BarChart }
