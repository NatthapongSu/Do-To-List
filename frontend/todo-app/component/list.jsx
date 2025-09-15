'use client'
import React, { useEffect, useState } from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { formatToDateTimeLocal } from '@/function/utils';

function List() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [focusId, setFocusId] = useState(null);
  let [isOpen, setIsOpen] = useState(false)
  const [minDateTime, setMinDateTime] = useState(null)

  useEffect(() => {

    const now = new Date();
    const minValue = now.toISOString().slice(0, 16);
    setMinDateTime(minValue);

    async function setupServiceWorker() {
      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        alert('Your browser doesn\'t support notifications');
        return;
      }

      try {
        await navigator.serviceWorker.register('/sw.js');
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          // setIsReady(true);
          console.log('Reminders ready!');
        } else {
          alert('Please allow notifications to use reminders');
        }
      } catch (error) {
        console.error('Setup failed:', error);
      }
    }
    setupServiceWorker();
    fetchToDoList();


  }, []);

  const fetchToDoList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getList`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.list && data.list.length > 0) {
        // console.log('Lists found:', data.list);
        let listTemp = [];
        data.list.forEach((item) => {
          listTemp.push({
            id: item.id,
            title: item.Title,
            date: new Date(item.Date * 1000),
          })
        })
        setList(listTemp);

        navigator.serviceWorker.ready.then(registration => {
          registration.active.postMessage({
            type: 'CLEAR_NOTIFICATIONS'
          });
        });

        // const taskDate = new Date('2025-09-12 00:54');
        // const now = new Date();
        // const delay = taskDate.getTime() - now.getTime();


        // Tell service worker to show notification
        navigator.serviceWorker.ready.then(registration => {
          registration.active.postMessage({
            type: 'SHOW_NOTIFICATION',
            task: listTemp
          });
        });


      }

    } catch (error) {
      console.log('error', error)
    }
  }

  const addList = async () => {

    try {
      if (title.trim() && date) {
        // setList([...list, {
        //   id: new Date().toString(), // Simple ID generation
        //   title: title,
        //   date: date,
        // }]);

        console.log('date :>> ', date);
        const d = new Date(date)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            list: {
              title: title,
              date: Math.floor(d.getTime() / 1000)
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Clear inputs after adding
        setTitle('');
        setDate('');
        fetchToDoList();
      }

    } catch (error) {
      console.error('Error addList:', error);
    }
  }

  const removeList = async (id) => {
    // setList(list.filter(list => list.id !== id));

    try {
      setIsOpen(false);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(`Api error! ${data.error}`);
      }

      setFocusId(null);
      fetchToDoList();

    } catch (error) {
      console.error('Error removeList:', error);
    }
  }

  const confirmModal = (isOpen, id) => {
    setIsOpen(isOpen);
    setFocusId(isOpen ? id : null);
  }

  const startEdit = (list) => {
    setEditingId(list.id);
    setEditTitle(list.title);
    setEditDate(formatToDateTimeLocal(list.date));
  }

  const saveEdit = async (id) => {

    try {
      if (editTitle.trim()) {
        // setList(list.map(list =>
        //   list.id === id
        //     ? { ...list, title: editTitle, date: editDate }
        //     : list
        // ));

        const d = new Date(editDate)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            list: {
              id: id,
              title: editTitle,
              date: Math.floor(d.getTime() / 1000)
            }
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(`Api error! ${data.error}`);
        }
        fetchToDoList();
        setEditingId(null);
        setEditTitle('');
        setEditDate('');
      }

    } catch (error) {
      console.error('Error saveEdit:', error);
    }
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDate('');
  }

  const overDueCheck = (date) => {
    const targetTime = new Date(date).getTime();
    const currentTime = new Date().getTime();
    const delay = targetTime - currentTime;

    return delay <= 0
  }

  return (
    <div className='flex flex-col items-center px-4 py-6 min-h-screen bg-gray-50'>
      {/* Add New Item Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center sm:text-left">Add New Item</h2>

        <div className='flex flex-col gap-3 sm:gap-4'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input
              className='w-full h-10 sm:h-12 text-base sm:text-lg pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              type="text"
              value={title}
              placeholder="Enter title..."
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date:</label>
            <input
              className='w-full text-base sm:text-lg p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
              type="datetime-local"
              value={date}
              min={minDateTime}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <button
          className='w-full text-lg sm:text-xl mt-4 sm:mt-6 bg-blue-500 hover:bg-blue-600 text-white p-3 sm:p-4 rounded-lg cursor-pointer text-center transition-colors duration-200 font-medium active:bg-blue-700 touch-manipulation'
          onClick={addList}
        >
          Add Item
        </button>
      </div>

      {/* Items List */}
      <div className="mt-6 sm:mt-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 text-center sm:text-left px-2 sm:px-0">
          Your Items ({list.length})
        </h3>

        {list.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <p className="text-gray-500 text-center py-4 sm:py-8 text-base sm:text-lg">
              No items yet. Add your first item above!
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {list.map((listItem) => (
              <div key={listItem.id} className="bg-white p-3 sm:p-4 md:p-5 rounded-lg shadow-md border border-gray-200 mx-2 sm:mx-0">
                {editingId === listItem.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div>
                      <input
                        className='w-full text-base sm:text-lg p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        className='w-full text-base sm:text-lg p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                        type="datetime-local"
                        value={editDate}
                        min={minDateTime}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => saveEdit(listItem.id)}
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded text-sm sm:text-base font-medium transition-colors touch-manipulation flex-1 sm:flex-none"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded text-sm sm:text-base font-medium transition-colors touch-manipulation flex-1 sm:flex-none"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-base w-[300px] sm:text-lg md:text-xl font-semibold break-words ${overDueCheck(listItem.date) ? "text-red-600" : "text-gray-800"}`}>
                        {listItem.title}
                      </h4>
                      {listItem.date && (
                        <div className="mt-1 sm:mt-2">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                            <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                              📅 {`${new Date(listItem.date).toLocaleDateString()} ${new Date(listItem.date).toLocaleTimeString()}`}
                            </span>
                            {overDueCheck(listItem.date) && (
                              <span className="text-xs sm:text-sm text-red-600 font-semibold bg-red-50 px-2 py-1 rounded-full">
                                Overdue!
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row sm:flex-col lg:flex-row gap-2 sm:gap-1 lg:gap-2 flex-shrink-0 justify-end sm:justify-start lg:justify-end">
                      <button
                        onClick={() => startEdit(listItem)}
                        className="text-blue-500 hover:text-blue-700 active:text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-blue-50 active:bg-blue-100 transition-all touch-manipulation min-w-0"
                      >
                        <span className="hidden sm:inline">✏️ Edit</span>
                        <span className="sm:hidden">✏️</span>
                      </button>
                      <button
                        onClick={() => confirmModal(true, listItem.id)}
                        className="text-red-500 hover:text-red-700 active:text-red-800 text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-2 rounded hover:bg-red-50 active:bg-red-100 transition-all touch-manipulation min-w-0"
                      >
                        <span className="hidden sm:inline">✕ Remove</span>
                        <span className="sm:hidden">✕</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-xs sm:max-w-md space-y-4 border bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-lg shadow-xl">
            <DialogTitle className="font-bold text-lg sm:text-xl text-gray-800">Remove Item?</DialogTitle>
            <Description className="text-sm sm:text-base text-gray-600">
              This will permanently remove this item from your list.
            </Description>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                className='text-blue-500 hover:text-blue-700 active:text-blue-800 font-medium py-2 sm:py-1 px-4 hover:bg-blue-50 active:bg-blue-100 rounded transition-all touch-manipulation flex-1 sm:flex-none'
                onClick={() => { confirmModal(false, listItem.id) }}
              >
                Cancel
              </button>
              <button
                className='text-red-500 hover:text-red-700 active:text-red-800 font-medium py-2 sm:py-1 px-4 hover:bg-red-50 active:bg-red-100 rounded transition-all touch-manipulation flex-1 sm:flex-none'
                onClick={() => removeList(focusId)}
              >
                Remove
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default List