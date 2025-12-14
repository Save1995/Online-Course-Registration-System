
import React from 'react';
import type { Course } from '../../types';

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
  onRegister: (course: Course) => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose, onRegister }) => {
  const today = new Date();
  const regStart = new Date(course.registrationStart);
  const regEnd = new Date(course.registrationEnd);
  
  let statusText = '';
  let statusBadgeClass = '';
  let canRegister = false;

  if (today >= regStart && today <= regEnd) {
      statusText = 'เปิดรับสมัคร';
      statusBadgeClass = 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 ring-1 ring-green-600/20';
      canRegister = true;
  } else if (today < regStart) {
      statusText = 'เร็วๆ นี้';
      statusBadgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 ring-1 ring-yellow-600/20';
  } else {
      statusText = 'ปิดรับสมัคร';
      statusBadgeClass = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 ring-1 ring-red-600/20';
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const percentFull = Math.min((course.currentParticipants / course.maxParticipants) * 100, 100);
  const remainingSeats = Math.max(0, course.maxParticipants - course.currentParticipants);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-start bg-gray-50/50 dark:bg-gray-700/20">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusBadgeClass}`}>
                        {statusText}
                    </span>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">รุ่นที่ {course.courseGen}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug">{course.courseName}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">วันที่อบรม</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(course.startDate)} - {formatDate(course.endDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">สถานที่</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{course.location}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">วิทยากร</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{course.instructor}</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.25-1.259-.685-1.707M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.25-1.259.685-1.707M12 12a3 3 0 100-6 3 3 0 000 6zM12 12h.01M17 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ผู้ลงทะเบียน</p>
                             <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{course.currentParticipants} / {course.maxParticipants} คน</p>
                                <span className="text-xs text-gray-500">(ว่าง {remainingSeats})</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 border-b dark:border-gray-700 pb-2">รายละเอียดหลักสูตร</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {course.description}
                </p>
            </div>

            {/* Registration Period Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <div>
                         <p className="text-sm font-bold text-blue-900 dark:text-blue-300">ช่วงเวลาเปิดรับสมัคร</p>
                         <p className="text-blue-800 dark:text-blue-200">{formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}</p>
                     </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 flex justify-end gap-3 rounded-b-2xl">
             <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
             >
                ปิดหน้าต่าง
             </button>
             <button 
                onClick={() => onRegister(course)}
                disabled={!canRegister}
                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
                    ${canRegister 
                      ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5' 
                      : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-80 shadow-none'}
                `}
             >
                {canRegister ? 'ลงทะเบียนทันที' : statusText}
                {canRegister && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
             </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;
