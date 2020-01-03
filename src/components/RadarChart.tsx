import React, { useRef, useEffect } from 'react'
import { Radar } from '@antv/g2plot'
import moment from 'moment'
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

import { IExpense } from '../model/expense'

type Props = { expenses: IExpense[] }

function RadarChart({ expenses }: Props): React.ReactElement<Props> {
  const chart = useRef(null)

  useEffect(() => {
    if (!chart.current) {
      return
    }

    const totals = expenses
      .map(expense => ({
        category: expense.category,
        cost: expense.amount,
        date: expense.date,
      }))
      .reduce((total, current) => {
        const found = total.find(t => t.category === current.category)

        if (!found) {
          return [
            ...total,
            {
              category: current.category,
              cost: current.cost,
              month: moment(current.date).format('MMMM'),
            },
          ]
        } else {
          found.cost += current.cost
        }

        return total
      }, [])

    const graph = new Radar(chart.current, {
      title: {
        visible: true,
        text: 'Radar',
      },
      forceFit: true,
      data: totals,
      angleField: 'category',
      radiusField: 'cost',
      seriesField: 'month',
    })

    graph.render()
  }, [expenses])

  return <div ref={chart} />
}

const ObservableRadarChart = withDatabase(
  withObservables([] as never[], ({ database }) => ({
    expenses: database.collections
      .get('expenses')
      .query()
      .observe(),
  }))(RadarChart),
)

export { ObservableRadarChart as RadarChart }
