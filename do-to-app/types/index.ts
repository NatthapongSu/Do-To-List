export interface ListItem {
  id: string
  title: string
  date: Date
}

export interface ApiListItem {
  id: string
  Title: string
  Date: number
}

export interface ApiResponse<T = any> {
  success: boolean
  error?: string
  list?: T[]
}