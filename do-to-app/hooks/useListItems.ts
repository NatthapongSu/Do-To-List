import { useState, useCallback } from 'react'
import type { ListItem, ApiListItem, ApiResponse } from '@/types/index'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useListItems() {
  const [list, setList] = useState<ListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_URL}/list/get`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse<ApiListItem> = await response.json()

      if (data.list && data.list.length > 0) {
        const transformedList: ListItem[] = data.list.map((item) => ({
          id: item.id,
          title: item.Title,
          date: new Date(item.Date * 1000),
        }))
        setList(transformedList)
      } else {
        setList([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching list:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addItem = useCallback(async (title: string, dateString: string) => {
    if (!title.trim() || !dateString) return

    setError(null)

    try {
      const date = new Date(dateString)
      const response = await fetch(`${API_URL}/list/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list: {
            title,
            date: Math.floor(date.getTime() / 1000)
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      console.error('Error adding item:', err)
      throw err
    }
  }, [fetchList])

  const updateItem = useCallback(async (id: string, title: string, dateString: string) => {
    if (!title.trim()) return

    setError(null)

    try {
      const date = new Date(dateString)
      const response = await fetch(`${API_URL}/list/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list: {
            id,
            title,
            date: Math.floor(date.getTime() / 1000)
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Update failed')
      }

      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      console.error('Error updating item:', err)
      throw err
    }
  }, [fetchList])

  const deleteItem = useCallback(async (id: string) => {
    setError(null)

    try {
      const response = await fetch(`${API_URL}/list/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Delete failed')
      }

      await fetchList()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
      console.error('Error deleting item:', err)
      throw err
    }
  }, [fetchList])

  return {
    list,
    isLoading,
    error,
    fetchList,
    addItem,
    updateItem,
    deleteItem
  }
}