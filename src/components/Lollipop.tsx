import React, { LegacyRef } from 'react'
import * as d3 from 'd3'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'

class Lollipop extends React.Component<{ expenses: any }> {
  ref

  render() {
    const { expenses } = this.props
    const margin = { top: 10, right: 30, bottom: 40, left: 100 }
    const width = 460 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svg = d3
      .select(this.ref)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x = d3
      .scaleLinear()
      .domain([0, 13000])
      .range([0, width])

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end')

    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(
        expenses.map(function(d) {
          return d.category
        }),
      )
      .padding(1)

    svg.append('g').call(d3.axisLeft(y))

    svg
      .selectAll('myline')
      .data(expenses)
      .enter()
      .append('line')
      .attr('x1', function(d) {
        return x(d.amount)
      })
      .attr('x2', x(0))
      .attr('y1', function(d) {
        return y(d.category)
      })
      .attr('y2', function(d) {
        return y(d.category)
      })
      .attr('stroke', 'grey')

    svg
      .selectAll('mycircle')
      .data(expenses)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return x(d.amount)
      })
      .attr('cy', function(d) {
        return y(d.category)
      })
      .attr('r', '4')
      .style('fill', '#69b3a2')
      .attr('stroke', 'black')

    return <div ref={ref => (this.ref = ref)} />
  }
}

const ObservableLollipop = withDatabase(
  withObservables([] as never[], ({ database }) => ({
    expenses: database.collections
      .get('expenses')
      .query()
      .observe(),
  }))(Lollipop),
)

export { ObservableLollipop as Lollipop }
