'use client';

import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';

interface Notification {
  message: string;
  timestamp: string;
}

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load notifications from localStorage when the component mounts
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('sellerNotifications') || '[]');
    setNotifications(storedNotifications);

    // Listen for storage events to sync notifications across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sellerNotifications') {
        setNotifications(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const clearNotifications = () => {
    localStorage.removeItem('sellerNotifications');
    setNotifications([]);
  };

  return (
    <div className="relative">
      <button onClick={toggleNotifications} className="flex items-center">
        <FaBell className="text-2xl" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Notifications</h3>
            <button onClick={clearNotifications} className="text-sm text-red-600">
              Clear All
            </button>
          </div>
          {notifications.length > 0 ? (
            notifications.map((note, index) => (
              <div key={index} className="border-b py-2">
                {note.message} at {new Date(note.timestamp).toLocaleString()}
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerNotifications;
