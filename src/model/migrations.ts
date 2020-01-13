import {
  schemaMigrations,
  createTable,
} from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 10,
      steps: [
        createTable({
          name: 'expenses',
          columns: [
            { name: 'date', type: 'string' },
            { name: 'item', type: 'string' },
            { name: 'amount', type: 'number' },
            { name: 'category', type: 'string' },
            { name: 'last_modified', type: 'number' },
          ],
        }),
        createTable({
          name: 'categories',
          columns: [{ name: 'name', type: 'string' }],
        }),
      ],
    },
  ],
})
