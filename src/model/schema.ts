import { appSchema, tableSchema } from '@nozbe/watermelondb'

const DATABASE_VERSION = 9

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
        { name: 'last_modified', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [{ name: 'name', type: 'string' }],
    }),
  ],
})
