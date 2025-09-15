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

// Keep track of active timers
let activeTimers = [];

// Step 3: Listen for messages from your main app
self.addEventListener("message", (event) => {
  console.log("Service worker received message:", event.data);

  if (event.data.type === "SHOW_NOTIFICATION") {
    // Clear old timers first (avoid duplicate notifications)
    clearAllTimers();

    // Schedule new notifications
    notificationSet(event.data.task);
  }

  if (event.data.type === "CLEAR_NOTIFICATIONS") {
    clearAllTimers();
    console.log("All scheduled notifications cleared.");
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

    const timerId = setTimeout(() => {
      showNotification(item.id, item.title);
    }, delay);

    // Save timer so we can cancel it later
    activeTimers.push(timerId);
  });
};

function clearAllTimers() {
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];
}

function showNotification(id, message) {
  self.registration.showNotification("Task Reminder", {
    body: `Your ${message} task is due!`,
    icon: "/favicon.ico",
    tag: `reminder-${id}`,
    requireInteraction: false,
  });
}

// Step 4: Handle what happens when user clicks the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Focus your app
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow("/");
      }
    })
  );
});
