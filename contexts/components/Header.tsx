
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import type { Page, AdminView } from '../../types';
import { 
  SunIcon, 
  MoonIcon, 
  UserCircleIcon, 
  LogoutIcon, 
  SettingsIcon, 
  CmsIcon, 
  ContactIcon, 
  FaqIcon, 
  ChevronDownIcon 
} from './icons/Icons';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLoginClick: () => void;
  setActivePage: (page: Page) => void;
  setActiveAdminView: (view: AdminView) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  onLoginClick,
  setActivePage,
  setActiveAdminView
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setActivePage('home');
    setIsDropdownOpen(false);
  };

  const handleAdminNavigate = (view: AdminView) => {
    setActiveAdminView(view);
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b-4 border-blue-600 dark:border-blue-700 shadow-sm sticky top-0 z-20">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 dark:text-gray-400 focus:outline-none md:hidden mr-3">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex flex-col">
            <h1 className="text-lg sm:text-2xl font-bold text-blue-800 dark:text-blue-400 leading-none">
                วิทยาลัยนักบริหารสาธารณสุข
            </h1>
            <h2 className="text-xs sm:text-base font-medium text-gray-600 dark:text-gray-300 mt-1 leading-none tracking-widest">
                ระบบรับสมัครอบรมออนไลน์
            </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold leading-none">{user.username}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
              <UserCircleIcon />
              <ChevronDownIcon />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 animate-fadeIn">
                 {/* User Info Mobile */}
                 <div className="px-4 py-2 border-b dark:border-gray-700 sm:hidden">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                 </div>

                 {/* System Settings Group */}
                 <div className="px-2 py-2">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">ตั้งค่าระบบ</p>
                    <button onClick={() => handleAdminNavigate('cms')} className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
                        <CmsIcon /> <span className="ml-2">จัดการประกาศ</span>
                    </button>
                    <button onClick={() => handleAdminNavigate('settings_contact')} className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
                        <ContactIcon /> <span className="ml-2">ข้อมูลการติดต่อ</span>
                    </button>
                    <button onClick={() => handleAdminNavigate('settings_faq')} className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
                        <FaqIcon /> <span className="ml-2">ข้อมูล FAQs</span>
                    </button>
                 </div>

                 <div className="border-t dark:border-gray-700 my-1"></div>

                 {/* Theme & Logout */}
                 <div className="px-2 py-2">
                     <button
                        onClick={toggleTheme}
                        className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            <span className="ml-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        {/* Toggle Switch Visual */}
                        <div className={`w-8 h-4 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 duration-300 ease-in-out ${theme === 'dark' ? 'bg-blue-600' : ''}`}>
                             <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-3' : ''}`}></div>
                        </div>
                      </button>

                     <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center mt-1">
                        <LogoutIcon /> <span className="ml-2">ออกจากระบบ</span>
                     </button>
                 </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow-md transition-all hover:shadow-lg flex items-center"
          >
             <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
