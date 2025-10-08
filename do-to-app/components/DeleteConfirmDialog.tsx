'use client'

import React from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ isOpen, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xs sm:max-w-md space-y-4 border bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-lg shadow-xl">
          <DialogTitle className="font-bold text-lg sm:text-xl text-gray-800">
            Remove Item?
          </DialogTitle>
          <Description className="text-sm sm:text-base text-gray-600">
            This will permanently remove this item from your list.
          </Description>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              className='text-blue-500 hover:text-blue-700 active:text-blue-800 font-medium py-2 sm:py-1 px-4 hover:bg-blue-50 active:bg-blue-100 rounded transition-all touch-manipulation flex-1 sm:flex-none'
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className='text-red-500 hover:text-red-700 active:text-red-800 font-medium py-2 sm:py-1 px-4 hover:bg-red-50 active:bg-red-100 rounded transition-all touch-manipulation flex-1 sm:flex-none'
              onClick={onConfirm}
            >
              Remove
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}