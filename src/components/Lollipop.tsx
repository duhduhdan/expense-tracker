import React from 'react'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'

function Lollipop() {
  return <div />
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
