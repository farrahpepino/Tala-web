import React, { useState, useEffect } from 'react';
import DefaultUserIcon from '../../assets/tala/user.png';
import { User } from '../../utils/User/UserType';
import { getUserData } from '../../utils/User/GetUserData';
interface Notification {
  _id: string;
  message: string;
  relatedPostId?: string;
  isRead: boolean;
  createdAt: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentLoggedIn: User = await getUserData();
        setUserId(currentLoggedIn._id || currentLoggedIn.userId);
        fetchNotifications(currentLoggedIn._id || currentLoggedIn.userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const response = await fetch(`/api/notifications/${userId}`);
      const data = await response.json();
      setNotifications(data.notifications); // Assuming data.notifications is of type Notification[]
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/markNotificationsAsRead/${userId}`, { method: 'POST' });
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await fetch(`/api/clearAllNotifications/${userId}`, { method: 'DELETE' });
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  if (isLoading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="relative font-[sans-serif] w-max mx-auto">
      <div
        id="dropdownMenu"
        className="absolute block -right-10 shadow-lg bg-white py-4 z-[1000] min-w-full rounded-lg w-[35vh] sm-[70vh] max-h-[500px] overflow-auto mt-2"
      >
        <div className="flex items-center justify-between px-4 mb-4">
          <p
            onClick={clearAllNotifications}
            className="text-xs text-black cursor-pointer hover:underline"
          >
            Clear all
          </p>
          <p
            onClick={markAllAsRead}
            className="text-xs text-black cursor-pointer hover:underline"
          >
            Mark all as read
          </p>
        </div>

        <ul className="divide-y">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <li key={notification._id} className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
                <img
                  src={DefaultUserIcon}
                  className="w-12 h-12 rounded-full shrink-0"
                  alt="User"
                />
                <div className="ml-6">
                  <h3 className="text-sm text-[#333] font-semibold">
                    {notification.message}
                  </h3>
                  {notification.relatedPostId && (
                    <p className="text-xs text-gray-500 mt-2">Related post: {notification.relatedPostId}</p>
                  )}
                  <p className="text-xs text-black leading-3 mt-2">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-xs text-gray-500">No new notifications.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
