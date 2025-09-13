import React from 'react'
import TopBar from '@/component/topBar'
import List from '@/component/list'
import ReminderTest from '@/component/TestNoti'
// import TodoApp from '@/component/todo'

export default function page() {
  return (
    <div className='flex flex-col mt-6 justify-center items-center gap-5'>
      <TopBar/>
      <List/>

      {/* <ReminderTest/> */}

    </div>
    // <main className="min-h-screen bg-gray-100 py-8">
    //   <TodoApp/>
    // </main>
  )
}
