// @ts-nocheck
import { synchronize } from '@nozbe/watermelondb/sync'
import { Database } from '@nozbe/watermelondb'

async function sync({ database }: { database: Database }): Promise<void> {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }): Promise<void> => {
      console.log(lastPulledAt)
    },
    pushChanges: async ({ changes }): Promise<void> => {
      console.log('changes', changes)
    },
  })
}

export { sync }
