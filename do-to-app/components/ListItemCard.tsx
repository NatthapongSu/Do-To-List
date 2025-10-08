// components/ListItemCard.tsx

'use client'

import React, { useEffect, useState } from 'react'
import type { ListItem } from '../types'

interface ListItemCardProps {
  item: ListItem
  isEditing: boolean
  editTitle: string
  editDate: string
  onEditTitleChange: (title: string) => void
  onEditDateChange: (date: string) => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
}

export function ListItemCard({
  item,
  isEditing,
  editTitle,
  editDate,
  onEditTitleChange,
  onEditDateChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}: ListItemCardProps) {
  const [minDateTime, setMinDateTime] = useState('')

  useEffect(() => {
    const now = new Date()
    const minValue = now.toISOString().slice(0, 16)
    setMinDateTime(minValue)
  }, [])

  const isOverdue = () => {
    const targetTime = new Date(item.date).getTime()
    const currentTime = new Date().getTime()
    return targetTime - currentTime <= 0
  }

  if (isEditing) {
    return (
      <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md border border-gray-200 mx-2 sm:mx-0">
        <div className="space-y-3">
          <div>
            <input
              className='w-full text-base sm:text-lg p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              type="text"
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              placeholder="Enter title..."
            />
          </div>
          <div>
            <input
              className='w-full text-base sm:text-lg p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              type="datetime-local"
              value={editDate}
              min={minDateTime}
              onChange={(e) => onEditDateChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onSaveEdit}
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded text-sm sm:text-base font-medium transition-colors touch-manipulation flex-1 sm:flex-none"
            >
              ✓ Save
            </button>
            <button
              onClick={onCancelEdit}
              className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded text-sm sm:text-base font-medium transition-colors touch-manipulation flex-1 sm:flex-none"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  const overdue = isOverdue()

  return (
    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md border border-gray-200 mx-2 sm:mx-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h4 className={`text-base w-[300px] sm:text-lg md:text-xl font-semibold break-words ${overdue ? "text-red-600" : "text-gray-800"}`}>
            {item.title}
          </h4>
          {item.date && (
            <div className="mt-1 sm:mt-2">
              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                  📅 {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                </span>
                {overdue && (
                  <span className="text-xs sm:text-sm text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full">
                    Overdue!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row sm:flex-col lg:flex-row gap-2 sm:gap-1 lg:gap-2 flex-shrink-0 justify-end sm:justify-start lg:justify-end">
          <button
            onClick={onStartEdit}
            className="text-blue-500 hover:text-blue-700 active:text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-blue-50 active:bg-blue-100 transition-all touch-manipulation min-w-0"
            aria-label="Edit item"
          >
            <span className="hidden sm:inline">✏️ Edit</span>
            <span className="sm:hidden">✏️</span>
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 active:text-red-800 text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-red-50 active:bg-red-100 transition-all touch-manipulation min-w-0"
            aria-label="Remove item"
          >
            <span className="hidden sm:inline">✕ Remove</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      </div>
    </div>
  )
}