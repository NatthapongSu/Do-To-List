'use client'
import React, { useEffect, useState } from 'react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

function List() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [focusId, setFocusId] = useState(null);
  let [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
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
    setEditDate(new Date(list.date).toISOString().split('T')[0]);
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

  return (
    <div className='flex flex-col items-center' >
      <div className="bg-white p-6 rounded-lg shadow-lg w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Item</h2>

        <div className='flex flex-col gap-4'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input
              className='w-full h-10 text-lg pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              value={title}
              placeholder="Enter title..."
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input
              className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <button
          className='w-full text-xl mt-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg cursor-pointer text-center transition-colors duration-200 font-medium'
          onClick={addList}
        >
          Add Item
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Your Items ({list.length})</h3>

        {list.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No items yet. Add your first item above!</p>
        ) : (
          <div className="space-y-3">
            {list.map((list) => (
              <div key={list.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                {editingId === list.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div>
                      <input
                        className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        className='w-full text-lg p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(list.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        ✓ Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 max-w-2xl overflow-auto">{list.title}</h4>
                      {list.date && (
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(list.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(list)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium p-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => confirmModal(true, list.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium p-1"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">Remove List ?</DialogTitle>
            <Description>This will permanently remove this list.</Description>
            <div className="flex gap-4">
              <button className='text-blue-500 hover:text-blue-700 font-medium' onClick={() => { confirmModal(false, list.id) }}>Cancel</button>
              <button className='text-red-500 hover:text-red-700 font-medium' onClick={() => removeList(focusId)}>Remove</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

    </div>
  )
}

export default List