// components/ItemsList.tsx

'use client'

import React from 'react'
import { ListItemCard } from './ListItemCard'
import type { ListItem } from '../types'

interface ItemsListProps {
  list: ListItem[]
  isLoading: boolean
  editingId: string | null
  editTitle: string
  editDate: string
  onEditTitleChange: (title: string) => void
  onEditDateChange: (date: string) => void
  onStartEdit: (item: ListItem) => void
  onSaveEdit: (id: string) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function ItemsList({
  list,
  isLoading,
  editingId,
  editTitle,
  editDate,
  onEditTitleChange,
  onEditDateChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}: ItemsListProps) {
  return (
    <div className="mt-6 sm:mt-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 text-center sm:text-left px-2 sm:px-0">
        Your Items ({list.length})
      </h3>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <p className="text-gray-500 text-center py-4 sm:py-8 text-base sm:text-lg">
            Loading...
          </p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <p className="text-gray-500 text-center py-4 sm:py-8 text-base sm:text-lg">
            No items yet. Add your first item above!
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {list.map((item) => (
            <ListItemCard
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              editTitle={editTitle}
              editDate={editDate}
              onEditTitleChange={onEditTitleChange}
              onEditDateChange={onEditDateChange}
              onStartEdit={() => onStartEdit(item)}
              onSaveEdit={() => onSaveEdit(item.id)}
              onCancelEdit={onCancelEdit}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}