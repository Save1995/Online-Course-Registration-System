
import React, { useState } from 'react';
import type { Course, Registration } from '../../types';
import { ExportIcon } from './icons/Icons';

interface CourseRegistrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  registrations: Registration[];
  onCancelRegistration: (reg: Registration) => void;
  onExportCsv: (course: Course, registrations: Registration[]) => void;
}

const CourseRegistrationsModal: React.FC<CourseRegistrationsModalProps> = ({ 
    isOpen, 
    onClose, 
    course, 
    registrations, 
    onCancelRegistration,
    onExportCsv
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !course) return null;

  const filteredRegistrations = registrations.filter(reg => 
    reg.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">รายชื่อผู้ลงทะเบียน</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    หลักสูตร: <span className="font-semibold text-blue-600 dark:text-blue-400">{course.courseName}</span> (รุ่นที่ {course.courseGen})
                </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl">&times;</button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-auto flex-grow max-w-md">
                <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ, สกุล, หรือองค์กร..." 
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-4">
                 <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    จำนวน: <span className="font-bold text-gray-800 dark:text-gray-200">{filteredRegistrations.length}</span> / {course.maxParticipants} คน
                </div>
                <button 
                    onClick={() => onExportCsv(course, filteredRegistrations)} 
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={filteredRegistrations.length === 0}
                >
                    <ExportIcon />
                    <span>Export CSV</span>
                </button>
            </div>
        </div>

        {/* Table Content */}
        <div className="overflow-auto flex-grow p-0">
            <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 shadow-sm z-10">
                    <tr className="text-gray-700 dark:text-gray-300">
                        <th className="py-3 px-4 text-left font-semibold">ชื่อ-นามสกุล</th>
                        <th className="py-3 px-4 text-left font-semibold">องค์กร/ตำแหน่ง</th>
                        <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">เบอร์โทรศัพท์</th>
                        <th className="py-3 px-4 text-left font-semibold hidden lg:table-cell">อีเมล</th>
                        <th className="py-3 px-4 text-center font-semibold">สถานะ</th>
                        <th className="py-3 px-4 text-center font-semibold">จัดการ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map(reg => (
                            <tr key={reg.registrationId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                                    {reg.firstName} {reg.lastName}
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                                    <div className="font-medium">{reg.organization}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{reg.position}</div>
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-400">{reg.phone}</td>
                                <td className="py-3 px-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">{reg.email}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        reg.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                        reg.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    }`}>
                                        {reg.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {reg.status !== 'cancelled' && (
                                        <button 
                                            onClick={() => onCancelRegistration(reg)} 
                                            className="text-red-600 hover:text-red-800 text-xs font-bold border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                        >
                                            ยกเลิก
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-10 text-center text-gray-500 dark:text-gray-400">
                                ไม่พบข้อมูลผู้ลงทะเบียน
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
                ปิดหน้าต่าง
            </button>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistrationsModal;
