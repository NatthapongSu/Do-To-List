'use client'
import React, { useState } from 'react'

function List() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [lists, setLists] = useState([]);

    const addList = () => {
        if (title.trim()) {
            setLists([...lists, {
                id: Date.now(),
                title: title,
                date: date
            }]);

            setTitle('');
            setDate('');
        }
    }

    const removeList = (id) => {
        setLists(lists.filter(list => list.id !== id));
    }

    return (
        <div className="p-4 w-md max-w-lg mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
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
                <h3 className="text-xl font-bold mb-4 text-gray-800">Your Items ({lists.length})</h3>
                
                {lists.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No items yet. Add your first item above!</p>
                ) : (
                    <div className="space-y-3">
                        {lists.map((list) => (
                            <div key={list.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-800">{list.title}</h4>
                                        {list.date && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                📅 {new Date(list.date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeList(list.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium ml-4 p-1"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default List