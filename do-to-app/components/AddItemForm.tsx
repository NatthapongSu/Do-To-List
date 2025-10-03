'use client'

import React, { useState, useEffect } from 'react'

interface AddItemFormProps {
  onAddItem: (title: string, date: string) => Promise<void>
}

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [minDateTime, setMinDateTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const now = new Date()
    const minValue = now.toISOString().slice(0, 16)
    setMinDateTime(minValue)
  }, [])

  const handleSubmit = async () => {
    if (!title.trim() || !date) {
      return
    }

    setIsSubmitting(true)
    try {
      await onAddItem(title, date)
      setTitle('')
      setDate('')
    } catch (error) {
      console.error('Failed to add item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit()
    }
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center sm:text-left">
        Add New Item
      </h2>

      <div className='flex flex-col gap-3 sm:gap-4'>
        <div>
          <label htmlFor="title-input" className="block text-sm font-medium text-gray-700 mb-1">
            Title:
          </label>
          <input
            id="title-input"
            className='w-full h-10 sm:h-12 text-base sm:text-lg pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            type="text"
            value={title}
            placeholder="Enter title..."
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown ={handleKeyPress}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="date-input" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date:
          </label>
          <input
            id="date-input"
            className='w-full text-base sm:text-lg p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            type="datetime-local"
            value={date}
            min={minDateTime}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <button
        className='w-full text-lg sm:text-xl mt-4 sm:mt-6 bg-blue-500 hover:bg-blue-600 text-white p-3 sm:p-4 rounded-lg cursor-pointer text-center transition-colors duration-200 font-medium active:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed touch-manipulation'
        onClick={handleSubmit}
        disabled={isSubmitting || !title.trim() || !date}
      >
        {isSubmitting ? 'Adding...' : 'Add Item'}
      </button>
    </div>
  )
}