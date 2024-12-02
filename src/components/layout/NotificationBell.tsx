import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useForumConfigStore } from '../../stores/forumConfigStore';
import { useChatConfigStore } from '../../stores/chatConfigStore';
import { useAuthStore } from '../../stores/authStore';

interface Notification {
  id: string;
  type: 'chat' | 'forum' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { config: forumConfig } = useForumConfigStore();
  const { config: chatConfig } = useChatConfigStore();
  const { user } = useAuthStore();

  // Poll for new notifications
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        // In production, this would be an API call
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'chat',
            title: 'Nuevo mensaje',
            message: 'Tienes un nuevo mensaje en el chat',
            timestamp: new Date().toISOString(),
            read: false,
            link: `${chatConfig.settings.url}/direct/messages`,
          },
          {
            id: '2',
            type: 'forum',
            title: 'Nueva respuesta',
            message: 'Han respondido a tu tema en el foro',
            timestamp: new Date().toISOString(),
            read: false,
            link: `${forumConfig.settings.url}/latest`,
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if ((forumConfig.enabled || chatConfig.enabled) && user) {
      const interval = setInterval(pollNotifications, 30000); // Poll every 30 seconds
      pollNotifications(); // Initial fetch
      return () => clearInterval(interval);
    }
  }, [forumConfig, chatConfig, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate to link if provided
    if (notification.link) {
      window.open(notification.link, '_blank');
    }

    setShowDropdown(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'chat':
        return '💬';
      case 'forum':
        return '📢';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!forumConfig.enabled && !chatConfig.enabled) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-white focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-xl mr-2">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No hay notificaciones
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;