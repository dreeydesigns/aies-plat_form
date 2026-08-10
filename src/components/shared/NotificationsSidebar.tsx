import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppContext } from '../../context/AppContext';

export default function NotificationsSidebar() {
  const { currentUser } = useAppContext();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', currentUser.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-neutral-200 shadow-lg rounded-xl z-50 overflow-hidden md:left-full md:top-0 md:ml-2 md:mt-0">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <h3 className="font-bold text-neutral-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-neutral-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 flex gap-3 hover:bg-neutral-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.read ? 'font-bold text-neutral-900' : 'text-neutral-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      {notif.createdAt && (
                        <p className="text-[10px] text-neutral-400 mt-2">
                          {new Date(notif.createdAt.toMillis()).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-start gap-2">
                      {!notif.read && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
