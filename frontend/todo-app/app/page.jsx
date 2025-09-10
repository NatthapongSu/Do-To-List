import React from 'react'
import TopBar from '@/component/topBar'
import List from '@/component/list'

export default function page() {
  return (
    <div className='flex flex-col mt-6 justify-center items-center gap-5'>
      <TopBar/>
      <List/>

    </div>
  )
}
