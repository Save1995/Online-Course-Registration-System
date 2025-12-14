
import React, { useState, useEffect } from 'react';
import api from './services/mockApi';
import type { Announcement } from './types';
import LoadingSpinner from './contexts/components/LoadingSpinner';

const HomeView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [readAnnouncementIds, setReadAnnouncementIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
        
        // Load read status from local storage
        const storedReadIds = localStorage.getItem('readAnnouncementIds');
        if (storedReadIds) {
          try {
            const parsedIds = JSON.parse(storedReadIds);
            if (Array.isArray(parsedIds)) {
              setReadAnnouncementIds(new Set(parsedIds));
            }
          } catch (e) {
            console.error("Failed to parse read announcements", e);
          }
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleMarkAllAsRead = () => {
    const allIds = announcements.map(a => a.id);
    const newReadIds = new Set([...readAnnouncementIds, ...allIds]);
    setReadAnnouncementIds(newReadIds);
    localStorage.setItem('readAnnouncementIds', JSON.stringify(Array.from(newReadIds)));
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const getTypeStyles = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        // Using Teal (primary brand color) for Info
        return 'border-blue-600 dark:border-blue-500'; 
      case 'success':
        return 'border-green-500';
      case 'warning':
        return 'border-yellow-400';
      default:
        return 'border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const unreadCount = announcements.filter(a => !readAnnouncementIds.has(a.id)).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          ประกาศ/ประชาสัมพันธ์
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-sm">
              {unreadCount} ใหม่
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            อ่านทั้งหมดแล้ว
          </button>
        )}
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map(announcement => {
            const isUnread = !readAnnouncementIds.has(announcement.id);
            return (
              <div 
                key={announcement.id} 
                className={`
                    relative bg-white dark:bg-gray-700/40 
                    rounded-lg shadow-sm hover:shadow-md 
                    transition-all duration-300 ease-in-out
                    border border-gray-100 dark:border-gray-600
                    border-l-[6px] ${getTypeStyles(announcement.type)}
                    p-3 sm:p-4 overflow-hidden
                `}
              >
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-tight">
                                {announcement.title}
                            </h3>
                             {isUnread && (
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white shadow-sm uppercase tracking-wider">
                                    New
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {announcement.content}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-1">
                         <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         <span>โพสต์เมื่อ: {formatDate(announcement.postedDate)}</span>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">ไม่มีประกาศในขณะนี้</p>
        </div>
      )}
    </div>
  );
};

export default HomeView;
