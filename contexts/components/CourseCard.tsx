
import React from 'react';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onRegisterClick: (course: Course) => void;
  onViewDetailClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRegisterClick, onViewDetailClick }) => {
  const today = new Date();
  const regStart = new Date(course.registrationStart);
  const regEnd = new Date(course.registrationEnd);
  
  // Status Logic
  const isActive = today >= regStart && today <= regEnd;
  const isUpcoming = today < regStart;
  const isClosed = today > regEnd;

  let statusText = '';
  let statusBadgeClass = '';
  let borderColorClass = '';
  let buttonClass = '';
  let buttonText = '';
  let isButtonDisabled = false;

  // Configuration based on status
  if (isActive) {
      statusText = 'เปิดรับสมัคร';
      statusBadgeClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 ring-1 ring-green-600/20';
      // Blue border for active
      borderColorClass = 'border-l-4 border-l-blue-600 dark:border-l-blue-500';
      buttonText = 'ลงทะเบียน';
      buttonClass = 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95';
      isButtonDisabled = false;
  } else if (isUpcoming) {
      statusText = 'เร็วๆ นี้';
      statusBadgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 ring-1 ring-yellow-600/20';
      // Orange border for upcoming
      borderColorClass = 'border-l-4 border-l-orange-400 dark:border-l-orange-500';
      buttonText = 'Coming Soon';
      buttonClass = 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md cursor-default opacity-90';
      isButtonDisabled = true;
  } else {
      // Closed (Though ideally these are filtered out by parent)
      statusText = 'ปิดรับสมัคร';
      statusBadgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-1 ring-red-600/20';
      borderColorClass = 'border-l-4 border-l-gray-300 dark:border-l-gray-600';
      buttonText = 'ปิดรับสมัคร';
      buttonClass = 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-80';
      isButtonDisabled = true;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  // Calculate percentage for progress bar
  const percentFull = Math.min((course.currentParticipants / course.maxParticipants) * 100, 100);
  const remainingSeats = Math.max(0, course.maxParticipants - course.currentParticipants);

  return (
    <div className={`group flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden relative ${borderColorClass}`}>
      
      {/* Content */}
      <div className="p-4 flex-grow flex flex-col space-y-3">
        {/* Header: Title & Status */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2" title={course.courseName}>
            {course.courseName}
          </h3>
          <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass}`}>
            {statusText}
          </span>
        </div>

        {/* Metadata Compact Row */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-y-1 gap-x-4 items-center">
            <span className="flex items-center gap-1">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                 รุ่นที่ {course.courseGen}
            </span>
             <span className="flex items-center gap-1 truncate max-w-[150px]" title={course.location}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {course.location}
            </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
          {course.description}
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 border border-gray-100 dark:border-gray-700/50 mt-auto">
            <div className="flex justify-between items-center text-xs mb-2">
                 <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-medium">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                     <span>รับสมัคร: {formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}</span>
                 </div>
            </div>

            {/* Capacity Bar */}
             <div className="flex items-center gap-2">
                  <div className="flex-grow bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${percentFull >= 100 ? 'bg-red-500' : 'bg-blue-600'}`} 
                        style={{ width: `${percentFull}%` }}
                      ></div>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium min-w-[50px] text-right">
                    {remainingSeats} ท่าน
                  </span>
             </div>
        </div>
      </div>
      
      {/* Footer / Actions */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 bg-gray-50/50 dark:bg-gray-800/50">
         <button 
            onClick={() => onViewDetailClick(course)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-all border border-gray-200 dark:border-gray-600 bg-transparent"
        >
            รายละเอียด
        </button>

         <button 
            onClick={() => !isButtonDisabled && onRegisterClick(course)}
            disabled={isButtonDisabled}
            className={`px-3 py-2 rounded-lg text-xs font-bold text-white transition-all flex justify-center items-center gap-1.5 ${buttonClass}`}
        >
            <span>{buttonText}</span>
             {!isButtonDisabled && isActive && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
