import { appSchema, tableSchema } from '@nozbe/watermelondb'

const DATABASE_VERSION = 4

export default appSchema({
  version: DATABASE_VERSION,
  tables: [
    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'date', type: 'string' },
        { name: 'item', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'category', type: 'string' },
      ],
    }),
  ],
})
