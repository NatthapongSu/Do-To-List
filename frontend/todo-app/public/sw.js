// public/sw.js - Put this exact code in your public/sw.js file

// Step 1: Install the service worker (runs once when first registered)
self.addEventListener("install", () => {
  console.log("Service worker installing...");
  self.skipWaiting(); // Activate immediately
});

// Step 2: Activate the service worker (runs after install)
self.addEventListener("activate", () => {
  console.log("Service worker activated!");
  self.clients.claim(); // Take control of all pages
});

// Step 3: Listen for messages from your main app
self.addEventListener("message", (event) => {
  console.log("Service worker received message:", event.data);

  if (event.data.type === "SHOW_NOTIFICATION") {
    // Show notification
    notificationSet(event.data.task);
  }
});

const notificationSet = (task) => {
  task.forEach((item) => {
    const targetTime = new Date(item.date).getTime();
    const currentTime = new Date().getTime();
    const delay = targetTime - currentTime;

    if (delay <= 0) {
      // Show immediately if overdue
      showNotification(item.id, item.title);
      return;
    }

    setTimeout(() => {
      showNotification(item.id, item.title);
    }, delay);
  });
};

function showNotification(id, message) {
  self.registration.showNotification("Task Reminder", {
    body: `Your ${message} task is due!`,
    icon: "/favicon.ico",
    tag: `reminder-${id}`,
    requireInteraction: false,
  });

}

// Step 4: Handle what happens when user clicks the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Focus your app
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});
