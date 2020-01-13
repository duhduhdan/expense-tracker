import { Model } from '@nozbe/watermelondb'

import { database } from '../db'

interface CategoryModel extends Model {
  category: string
}

type Category = { category?: string; id?: string }

export async function createCategory({
  category: name,
}: Category): Promise<void> {
  const collection = database.collections.get('categories')

  await database.action(async () => {
    await collection.create((category: CategoryModel) => {
      category.category = name
    })
  })
}

export async function deleteCategory({ id }: Category): Promise<void> {
  if (!id) {
    throw new Error('Need an id to delete the category')
  }

  const collection = database.collections.get('categories')

  await database.action(async () => {
    const category = await collection.find(id)

    await category.markAsDeleted()
  })
}
