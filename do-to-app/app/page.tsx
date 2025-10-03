'use client'

import React, { useEffect, useState } from 'react'
import { AddItemForm } from '@/components/AddItemForm' 
// import { ItemsList } from './components/ItemsList'
// import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { useNotifications } from '@/hooks/useNotifications'
import { useListItems } from '@/hooks/useListItems'
// import type { ListItem } from './types'

export default function List() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDate, setEditDate] = useState('')
  const [focusId, setFocusId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { list, isLoading, fetchList, addItem, updateItem, deleteItem } = useListItems()
  const { setupNotifications } = useNotifications()

  useEffect(() => {
    setupNotifications()
    fetchList()
  }, [])

  // Update notifications when list changes
  useEffect(() => {
    if (list.length > 0) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'CLEAR_NOTIFICATIONS'
        })
        registration.active?.postMessage({
          type: 'SHOW_NOTIFICATION',
          task: list
        })
      })
    }
  }, [list])

  const handleAddItem = async (title: string, date: string) => {
    await addItem(title, date)
  }

  // const handleStartEdit = (item: ListItem) => {
  //   setEditingId(item.id)
  //   setEditTitle(item.title)
  //   setEditDate(formatToDateTimeLocal(item.date))
  // }

  const handleSaveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await updateItem(id, editTitle, editDate)
      handleCancelEdit()
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDate('')
  }

  const handleDeleteClick = (id: string) => {
    setFocusId(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (focusId) {
      await deleteItem(focusId)
      setFocusId(null)
      setIsDeleteModalOpen(false)
    }
  }

  const handleCancelDelete = () => {
    setFocusId(null)
    setIsDeleteModalOpen(false)
  }

  return (
    <div className='flex flex-col items-center px-4 py-6 min-h-screen bg-gray-50'>
      <AddItemForm onAddItem={handleAddItem} />
      
      {/* <ItemsList
        list={list}
        isLoading={isLoading}
        editingId={editingId}
        editTitle={editTitle}
        editDate={editDate}
        onEditTitleChange={setEditTitle}
        onEditDateChange={setEditDate}
        onStartEdit={handleStartEdit}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      /> */}
    </div>
  )
}

// Utility function
function formatToDateTimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}