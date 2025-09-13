// Component to test reminders
'use client'

import { useState, useEffect } from 'react';

export default function ReminderTest() {
  const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    setupServiceWorker();
    // Set default datetime to 1 minute from now for testing
    const oneMinuteFromNow = new Date(Date.now() + 60000);
    setDateTime(formatDateTimeLocal(oneMinuteFromNow));
  }, []);

  async function setupServiceWorker() {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      alert('Your browser doesn\'t support notifications');
      return;
    }

    try {
      await navigator.serviceWorker.register('/sw.js');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setIsReady(true);
        console.log('Reminders ready!');
      } else {
        alert('Please allow notifications to use reminders');
      }
    } catch (error) {
      console.error('Setup failed:', error);
    }
  }

  function scheduleReminder() {
    if (!title || !message || !dateTime) {
      alert('Please fill all fields');
      return;
    }

    const id = `reminder-${Date.now()}`;
    const reminderData = {
      id,
      title,
      message,
      dateTime
    };

    // Send to service worker
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: 'SCHEDULE_REMINDER',
        data: reminderData
      });
    });

    // Add to local list
    setReminders([...reminders, {
      ...reminderData,
      scheduledAt: new Date().toLocaleString()
    }]);

    // Clear form
    setTitle('');
    setMessage('');
    
    alert(`Reminder scheduled for ${new Date(dateTime).toLocaleString()}`);
  }

  function cancelReminder(id) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: 'CANCEL_REMINDER',
        data: { id }
      });
    });

    setReminders(reminders.filter(r => r.id !== id));
  }

  function testQuickReminder() {
    const id = `test-${Date.now()}`;
    const futureTime = new Date(Date.now() + 5000); // 5 seconds from now

    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: 'SCHEDULE_REMINDER',
        data: {
          id,
          title: 'Test Reminder',
          message: 'This is a test reminder after 5 seconds!',
          dateTime: futureTime.toISOString()
        }
      });
    });

    alert('Test reminder will show in 5 seconds!');
  }

  function showNow() {
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({
        type: 'SHOW_NOTIFICATION_NOW',
        data: {
          title: title || 'Test Title',
          message: message || 'Test message'
        }
      });
    });
  }

  function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Reminder System</h1>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        Status: {isReady ? '✅ Ready' : '❌ Not Ready'}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Reminder title (e.g., Meeting with John)"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reminder message"
          className="w-full p-2 border rounded"
        />

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={scheduleReminder}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Schedule Reminder
          </button>

          <button
            onClick={showNow}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Show Now
          </button>
        </div>

        <button
          onClick={testQuickReminder}
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
        >
          Test 5-Second Reminder
        </button>
      </div>

      {/* Active Reminders */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Scheduled Reminders ({reminders.length})</h2>
        {reminders.length === 0 ? (
          <p className="text-gray-500">No reminders scheduled</p>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="p-2 border rounded bg-gray-50">
                <div className="font-medium">{reminder.title}</div>
                <div className="text-sm text-gray-600">{reminder.message}</div>
                <div className="text-xs text-gray-500">
                  Due: {new Date(reminder.dateTime).toLocaleString()}
                </div>
                <button
                  onClick={() => cancelReminder(reminder.id)}
                  className="mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-yellow-50 p-3 rounded">
        <strong>How to test:</strong>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Click "Test 5-Second Reminder" for quick test</li>
          <li>Or set a custom time 1-2 minutes in the future</li>
          <li>Even if you close this tab, the reminder will still work!</li>
          <li>Click the notification to return to the app</li>
        </ol>
      </div>
    </div>
  );
}