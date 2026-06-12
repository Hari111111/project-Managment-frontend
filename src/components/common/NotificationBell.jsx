import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { fetchNotifications, markNotificationsRead } from "../../features/notifications/notificationSlice";

dayjs.extend(relativeTime);

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useAppDispatch();
  const { items, unreadCount } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && unreadCount > 0) {
      dispatch(markNotificationsRead());
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 z-50 animate-fade-in origin-top-right">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No notifications yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {items.map((notification) => (
                  <div
                    key={notification._id}
                    className={`px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                      !notification.isRead ? "bg-brand-50/50 dark:bg-brand-900/10" : ""
                    }`}
                  >
                    <p className={`text-sm ${!notification.isRead ? "font-medium text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-brand-600/80 dark:text-brand-400/80">
                      {dayjs(notification.createdAt).fromNow() === "a few seconds ago" ? "Just now" : dayjs(notification.createdAt).fromNow()}
                    </p>
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
