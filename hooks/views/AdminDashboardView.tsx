import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/mockApi';
import type { Course, Registration, AdminView, Faq, ContactInfo, Announcement } from '../../types';
import CourseModal from '../../contexts/components/CourseModal';
import FaqModal from '../../contexts/components/FaqModal';
import AnnouncementModal from '../../contexts/components/AnnouncementModal';
import ConfirmationModal from '../../contexts/components/ConfirmationModal';
import CourseRegistrationsModal from '../../contexts/components/CourseRegistrationsModal';
import { EditIcon, DeleteIcon, ChevronRightIcon, ViewListIcon } from '../../contexts/components/icons/Icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import LoadingSpinner from '../../contexts/components/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

interface AdminDashboardViewProps {
    activeView: AdminView;
}

const ITEMS_PER_PAGE = 10;

const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border-l-4 ${color}`}>
        <div className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
    </div>
);

// Helper for Sort Icon
const SortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
    return (
        <span className={`ml-2 inline-block transition-opacity duration-200 ${direction ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'}`}>
             {direction === 'asc' ? '↑' : '↓'}
        </span>
    );
};

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ activeView }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ phone: '', email: '', address: '' });
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Course Filtering & Sorting State
    const [courseSearch, setCourseSearch] = useState('');
    const [courseStatusFilter, setCourseStatusFilter] = useState<'all' | Course['status']>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Course; direction: 'asc' | 'desc' } | null>({ key: 'registrationStart', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);

    // Course Modals State
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

    // Registration Modal State
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [viewingRegistrationsCourse, setViewingRegistrationsCourse] = useState<Course | null>(null);
    const [isRegConfirmModalOpen, setIsRegConfirmModalOpen] = useState(false);
    const [cancelingRegistration, setCancelingRegistration] = useState<Registration | null>(null);

    // FAQ Modals State
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [isFaqConfirmModalOpen, setIsFaqConfirmModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [deletingFaq, setDeletingFaq] = useState<Faq | null>(null);

    // CMS Modals State
    const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
    const [isCmsConfirmModalOpen, setIsCmsConfirmModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
    
    const addToast = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [coursesData, registrationsData, contactData, faqsData, announcementsData] = await Promise.all([
                api.getCourses(),
                api.getRegistrations(),
                api.getContactInfo(),
                api.getFaqs(),
                api.getAnnouncements()
            ]);
            setCourses(coursesData);
            setRegistrations(registrationsData);
            setContactInfo(contactData);
            setFaqs(faqsData);
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            addToast('Failed to load dashboard data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset pagination when filters or view change
    useEffect(() => {
        setCurrentPage(1);
    }, [courseSearch, courseStatusFilter, activeView]);

    // Computed Courses with Filter and Sort
    const filteredAndSortedCourses = useMemo(() => {
        let result = [...courses];

        // 1. Filter by Status
        if (courseStatusFilter !== 'all') {
            result = result.filter(c => c.status === courseStatusFilter);
        }

        // 2. Filter by Search Text
        if (courseSearch) {
            const lowerTerm = courseSearch.toLowerCase();
            result = result.filter(c => 
                c.courseName.toLowerCase().includes(lowerTerm) ||
                c.courseGen.toLowerCase().includes(lowerTerm)
            );
        }

        // 3. Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [courses, courseSearch, courseStatusFilter, sortConfig]);

    // Paginate Courses
    const paginatedCourses = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedCourses, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE);

    const handleSort = (key: keyof Course) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Pagination Controls Component
    const PaginationControls = () => {
        if (filteredAndSortedCourses.length === 0) return null;

        return (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 sm:px-6 rounded-b-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-gray-700 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedCourses.length)}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{filteredAndSortedCourses.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <div className="h-4 w-4 rotate-180 transform flex items-center justify-center">
                                     <ChevronRightIcon />
                                </div>
                            </button>
                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)).map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && <span className="relative inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0">...</span>}
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        aria-current={currentPage === page ? 'page' : undefined}
                                        className={`relative inline-flex items-center px-3 py-1 text-xs font-semibold ${currentPage === page ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0'}`}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-1 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <div className="h-4 w-4 flex items-center justify-center">
                                    <ChevronRightIcon />
                                </div>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    // Course Handlers
    const handleOpenAddModal = () => {
        setEditingCourse(null);
        setIsCourseModalOpen(true);
    };
    const handleOpenEditModal = (course: Course) => {
        setEditingCourse(course);
        setIsCourseModalOpen(true);
    };
    const handleOpenDeleteConfirm = (course: Course) => {
        setDeletingCourse(course);
        setIsConfirmModalOpen(true);
    };
    const handleOpenRegistrations = (course: Course) => {
        setViewingRegistrationsCourse(course);
        setIsRegModalOpen(true);
    };

    const handleCloseCourseModals = () => {
        setIsCourseModalOpen(false);
        setIsConfirmModalOpen(false);
        setEditingCourse(null);
        setDeletingCourse(null);
    };

    const handleCloseRegViewModal = () => {
        setIsRegModalOpen(false);
        setViewingRegistrationsCourse(null);
    };

    const handleSaveCourse = async (courseData: Omit<Course, 'courseId' | 'currentParticipants'> | Course) => {
        const isUpdating = 'courseId' in courseData;
        try {
            if (isUpdating) {
                await api.updateCourse(courseData as Course);
            } else {
                await api.addCourse(courseData);
            }
            addToast(isUpdating ? 'แก้ไขข้อมูลหลักสูตรสำเร็จ!' : 'เพิ่มหลักสูตรใหม่สำเร็จ!', 'success');
            await fetchData();
            handleCloseCourseModals();
        } catch (error) {
            console.error("Failed to save course:", error);
            addToast('ไม่สามารถบันทึกข้อมูลได้', 'error');
        }
    };
    const handleDeleteCourse = async () => {
        if (deletingCourse) {
            try {
                await api.deleteCourse(deletingCourse.courseId);
                addToast('ลบหลักสูตรสำเร็จ!', 'success');
                await fetchData();
            } catch(e) {
                addToast('ไม่สามารถลบหลักสูตรได้', 'error');
            }
        }
        handleCloseCourseModals();
    };
    
    // Registration Handlers (Now called from Modal)
    const handleExportCourseCsv = (course: Course, courseRegistrations: Registration[]) => {
        if (courseRegistrations.length === 0) {
            addToast(`ไม่มีข้อมูลการลงทะเบียนสำหรับหลักสูตร "${course.courseName}"`, 'error');
            return;
        }

        const headers: (keyof Registration)[] = ['registrationId', 'courseName', 'firstName', 'lastName', 'idCard', 'birthDate', 'phone', 'email', 'organization', 'position', 'address', 'registrationDate', 'status'];
        const csvContent = [
            headers.join(','),
            ...courseRegistrations.map(reg => 
                headers.map(header => `"${reg[header]}"`).join(',')
            )
        ].join('\n');

        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            const filename = `registrations_${course.courseName.replace(/[\s/]/g, '_')}.csv`;
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast(`ส่งออกข้อมูล CSV สำหรับหลักสูตร "${course.courseName}" สำเร็จ!`, 'success');
        }
    };
    
    const handleOpenCancelRegConfirm = (reg: Registration) => {
        setCancelingRegistration(reg);
        setIsRegConfirmModalOpen(true);
    };

    const handleCloseRegConfirmModal = () => {
        setIsRegConfirmModalOpen(false);
        setCancelingRegistration(null);
    };

    const handleCancelRegistration = async () => {
        if (cancelingRegistration) {
            try {
                await api.cancelRegistration(cancelingRegistration.registrationId);
                addToast('ยกเลิกการลงทะเบียนสำเร็จ', 'success');
                await fetchData();
            } catch (e) {
                 addToast('ไม่สามารถยกเลิกการลงทะเบียนได้', 'error');
            }
        }
        handleCloseRegConfirmModal();
    };

    // Settings Handlers
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setContactInfo(prev => ({ ...prev!, [id]: value }));
    };
    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.updateContactInfo(contactInfo);
            addToast('บันทึกข้อมูลการติดต่อสำเร็จ!', 'success');
        } catch (error) {
            addToast('ไม่สามารถบันทึกข้อมูลการติดต่อได้', 'error');
        }
    };
    const handleOpenAddFaqModal = () => {
        setEditingFaq(null);
        setIsFaqModalOpen(true);
    };
    const handleOpenEditFaqModal = (faq: Faq) => {
        setEditingFaq(faq);
        setIsFaqModalOpen(true);
    };
    const handleOpenDeleteFaqConfirm = (faq: Faq) => {
        setDeletingFaq(faq);
        setIsFaqConfirmModalOpen(true);
    };
    const handleCloseFaqModals = () => {
        setIsFaqModalOpen(false);
        setIsFaqConfirmModalOpen(false);
        setEditingFaq(null);
        setDeletingFaq(null);
    };
    const handleSaveFaq = async (faqData: Omit<Faq, 'id'> | Faq) => {
        const isUpdating = 'id' in faqData;
        try {
            if (isUpdating) {
                await api.updateFaq(faqData as Faq);
            } else {
                await api.addFaq(faqData);
            }
            addToast(isUpdating ? 'แก้ไข FAQ สำเร็จ!' : 'เพิ่ม FAQ ใหม่สำเร็จ!', 'success');
            await fetchData();
            handleCloseFaqModals();
        } catch (error) {
            addToast('ไม่สามารถบันทึก FAQ ได้', 'error');
        }
    };
    const handleDeleteFaq = async () => {
        if (deletingFaq) {
            try {
                await api.deleteFaq(deletingFaq.id);
                addToast('ลบ FAQ สำเร็จ!', 'success');
                await fetchData();
            } catch(e) {
                addToast('ไม่สามารถลบ FAQ ได้', 'error');
            }
        }
        handleCloseFaqModals();
    };

    // CMS Handlers
    const handleOpenAddCmsModal = () => {
        setEditingAnnouncement(null);
        setIsCmsModalOpen(true);
    };
    const handleOpenEditCmsModal = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsCmsModalOpen(true);
    };
    const handleOpenDeleteCmsConfirm = (announcement: Announcement) => {
        setDeletingAnnouncement(announcement);
        setIsCmsConfirmModalOpen(true);
    };
    const handleCloseCmsModals = () => {
        setIsCmsModalOpen(false);
        setIsCmsConfirmModalOpen(false);
        setEditingAnnouncement(null);
        setDeletingAnnouncement(null);
    };
    const handleSaveAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'postedDate'> | Announcement) => {
        const isUpdating = 'id' in announcementData;
        try {
            if (isUpdating) {
                await api.updateAnnouncement(announcementData as Announcement);
            } else {
                await api.addAnnouncement(announcementData as Omit<Announcement, 'id' | 'postedDate'>);
            }
            addToast(isUpdating ? 'แก้ไขประกาศสำเร็จ!' : 'เพิ่มประกาศใหม่สำเร็จ!', 'success');
            await fetchData();
            handleCloseCmsModals();
        } catch (error) {
            addToast('ไม่สามารถบันทึกประกาศได้', 'error');
        }
    };
    const handleDeleteAnnouncement = async () => {
        if (deletingAnnouncement) {
            try {
                await api.deleteAnnouncement(deletingAnnouncement.id);
                addToast('ลบประกาศสำเร็จ!', 'success');
                await fetchData();
            } catch(e) {
                addToast('ไม่สามารถลบประกาศได้', 'error');
            }
        }
        handleCloseCmsModals();
    };


    // Data for charts
    const lineChartData = [
        { name: 'ม.ค.', registrations: 12 }, { name: 'ก.พ.', registrations: 19 }, { name: 'มี.ค.', registrations: 3 },
        { name: 'เม.ย.', registrations: 5 }, { name: 'พ.ค.', registrations: 2 }, { name: 'มิ.ย.', registrations: 3 },
    ];
    const barChartData = courses.map(c => ({
        name: c.courseName.length > 20 ? c.courseName.substring(0, 20) + '...' : c.courseName,
        ผู้ลงทะเบียน: c.currentParticipants
    }));

    const statusStyles: Record<Course['status'], string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };
    const viewTitles: Record<AdminView, string> = {
        dashboard: "Admin Dashboard",
        courses: "จัดการหลักสูตร",
        cms: "จัดการประกาศ/ประชาสัมพันธ์",
        settings_contact: "ตั้งค่า: ข้อมูลการติดต่อ",
        settings_faq: "ตั้งค่า: ข้อมูล FAQs"
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{viewTitles[activeView]}</h2>
            
            {activeView === 'dashboard' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="ผู้ลงทะเบียนทั้งหมด" value={registrations.length} color="border-blue-500" />
                        <StatCard title="หลักสูตรเปิดรับสมัคร" value={courses.filter(c => c.status === 'active').length} color="border-green-500" />
                        <StatCard title="หลักสูตรกำลังจะเปิด" value={courses.filter(c => c.status === 'upcoming').length} color="border-yellow-500" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">สถิติการลงทะเบียน</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={lineChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{fontSize: 10}} /><YAxis tick={{fontSize: 10}} /><Tooltip /><Legend wrapperStyle={{fontSize: '12px'}}/ ><Line type="monotone" dataKey="registrations" stroke="#3b82f6" activeDot={{ r: 6 }} /></LineChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">ผู้ลงทะเบียนตามหลักสูตร</h3>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{fontSize: 10}} /><YAxis type="category" dataKey="name" width={100} tick={{fontSize: 10}} /><Tooltip /><Legend wrapperStyle={{fontSize: '12px'}} /><Bar dataKey="ผู้ลงทะเบียน" fill="#3b82f6" barSize={20} /></BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeView === 'courses' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col">
                    <div className="p-4 pb-0">
                         <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-2">
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto flex-1">
                                 <div className="relative flex-1 max-w-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ค้นหา..."
                                        className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                        value={courseSearch}
                                        onChange={(e) => setCourseSearch(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer transition-colors"
                                    value={courseStatusFilter}
                                    onChange={(e) => setCourseStatusFilter(e.target.value as any)}
                                >
                                    <option value="all">สถานะทั้งหมด</option>
                                    <option value="active">Active</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <button onClick={handleOpenAddModal} className="w-full md:w-auto bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition shadow-sm font-medium flex items-center justify-center">
                                <span className="mr-1">+</span> เพิ่มหลักสูตร
                            </button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto text-gray-800 dark:text-gray-300">
                        <table className="min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600">
                                <tr className="text-gray-700 dark:text-gray-300">
                                    <th 
                                        scope="col"
                                        aria-sort={sortConfig?.key === 'courseName' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        className="py-2 px-3 text-left font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group select-none"
                                        onClick={() => handleSort('courseName')}
                                    >
                                        <button className="flex items-center focus:outline-none font-semibold">
                                            ชื่อหลักสูตร
                                            <SortIcon direction={sortConfig?.key === 'courseName' ? sortConfig.direction : null} />
                                        </button>
                                    </th>
                                    <th 
                                        scope="col"
                                        aria-sort={sortConfig?.key === 'registrationStart' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        className="py-2 px-3 text-left font-semibold hidden md:table-cell cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group select-none"
                                        onClick={() => handleSort('registrationStart')}
                                    >
                                        <button className="flex items-center focus:outline-none font-semibold">
                                            วันที่รับสมัคร
                                            <SortIcon direction={sortConfig?.key === 'registrationStart' ? sortConfig.direction : null} />
                                        </button>
                                    </th>
                                    <th 
                                        scope="col"
                                        aria-sort={sortConfig?.key === 'currentParticipants' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        className="py-2 px-3 text-left font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group select-none"
                                        onClick={() => handleSort('currentParticipants')}
                                    >
                                        <button className="flex items-center focus:outline-none font-semibold">
                                            ผู้ลงทะเบียน
                                            <SortIcon direction={sortConfig?.key === 'currentParticipants' ? sortConfig.direction : null} />
                                        </button>
                                    </th>
                                    <th 
                                        scope="col"
                                        aria-sort={sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                        className="py-2 px-3 text-left font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group select-none"
                                        onClick={() => handleSort('status')}
                                    >
                                        <button className="flex items-center focus:outline-none font-semibold">
                                            สถานะ
                                            <SortIcon direction={sortConfig?.key === 'status' ? sortConfig.direction : null} />
                                        </button>
                                    </th>
                                    <th scope="col" className="py-2 px-3 text-center font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCourses.length > 0 ? (
                                    paginatedCourses.map(course => (
                                        <tr key={course.courseId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200">
                                                <div className="truncate max-w-[200px]" title={course.courseName}>{course.courseName}</div>
                                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-normal mt-0.5">รุ่นที่ {course.courseGen}</span>
                                            </td>
                                            <td className="py-2 px-3 whitespace-nowrap hidden md:table-cell text-xs">{formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}</td>
                                            <td className="py-2 px-3">
                                                <div className="flex items-center">
                                                    <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                                        <div 
                                                            className="bg-blue-600 h-1.5 rounded-full" 
                                                            style={{ width: `${Math.min((course.currentParticipants / course.maxParticipants) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs">{course.currentParticipants}/{course.maxParticipants}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[course.status]}`}>{course.status}</span></td>
                                            <td className="py-2 px-3 flex items-center justify-center space-x-1">
                                                <button onClick={() => handleOpenRegistrations(course)} className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 dark:hover:bg-gray-600 rounded scale-90" aria-label="View registrations" title="ดูผู้ลงทะเบียน"><ViewListIcon /></button>
                                                <button onClick={() => handleOpenEditModal(course)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 dark:hover:bg-gray-600 rounded scale-90" aria-label="Edit course" title="แก้ไขหลักสูตร"><EditIcon /></button>
                                                <button onClick={() => handleOpenDeleteConfirm(course)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 dark:hover:bg-gray-600 rounded scale-90" aria-label="Delete course" title="ลบหลักสูตร"><DeleteIcon /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            ไม่พบข้อมูลหลักสูตร
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <PaginationControls />
                </div>
            )}
            
            {activeView === 'cms' && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="flex justify-end mb-3">
                        <button onClick={handleOpenAddCmsModal} className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition">เพิ่มประกาศ</button>
                    </div>
                    <div className="overflow-x-auto text-gray-800 dark:text-gray-300">
                        <table className="min-w-full bg-white dark:bg-gray-800 text-xs sm:text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr className="text-gray-700 dark:text-gray-300">
                                    <th scope="col" className="py-2 px-3 text-left font-semibold">หัวข้อ</th>
                                    <th scope="col" className="py-2 px-3 text-left font-semibold hidden md:table-cell">วันที่โพสต์</th>
                                    <th scope="col" className="py-2 px-3 text-left font-semibold">ประเภท</th>
                                    <th scope="col" className="py-2 px-3 text-left font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="py-2 px-3 font-medium text-gray-800 dark:text-gray-200 truncate max-w-[250px]">{ann.title}</td>
                                        <td className="py-2 px-3 whitespace-nowrap hidden md:table-cell">{formatDate(ann.postedDate)}</td>
                                        <td className="py-2 px-3 capitalize">{ann.type}</td>
                                        <td className="py-2 px-3 flex items-center space-x-2">
                                            <button onClick={() => handleOpenEditCmsModal(ann)} className="text-blue-600 hover:text-blue-800 scale-90" aria-label="Edit announcement"><EditIcon /></button>
                                            <button onClick={() => handleOpenDeleteCmsConfirm(ann)} className="text-red-600 hover:text-red-800 scale-90" aria-label="Delete announcement"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Other Settings Views can likely stay similar as they are forms, just reduced padding */}
            {activeView === 'settings_contact' && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <form onSubmit={handleSaveContact}>
                        <div className="space-y-3">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">โทรศัพท์</label>
                                <input type="text" id="phone" value={contactInfo.phone} onChange={handleContactChange} required className="mt-1 block w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">อีเมล</label>
                                <input type="email" id="email" value={contactInfo.email} onChange={handleContactChange} required className="mt-1 block w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ที่อยู่</label>
                                <textarea id="address" value={contactInfo.address} onChange={handleContactChange} rows={2} required className="mt-1 block w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 pt-3 border-t dark:border-gray-700">
                            <button type="submit" className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                บันทึก
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeView === 'settings_faq' && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="flex justify-end mb-3">
                        <button onClick={handleOpenAddFaqModal} className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition">เพิ่ม FAQ</button>
                    </div>
                    <div className="space-y-2">
                        {faqs.map(faq => (
                            <div key={faq.id} className="border dark:border-gray-700 p-3 rounded-lg flex justify-between items-start gap-3">
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{faq.question}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">{faq.answer}</p>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button onClick={() => handleOpenEditFaqModal(faq)} className="text-blue-600 hover:text-blue-800 scale-90" aria-label="Edit FAQ"><EditIcon /></button>
                                    <button onClick={() => handleOpenDeleteFaqConfirm(faq)} className="text-red-600 hover:text-red-800 scale-90" aria-label="Delete FAQ"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <CourseModal isOpen={isCourseModalOpen} onClose={handleCloseCourseModals} onSave={handleSaveCourse} course={editingCourse} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={handleCloseCourseModals} onConfirm={handleDeleteCourse} title="ยืนยันการลบ" message={`คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตร "${deletingCourse?.courseName}"?`} />
            <FaqModal isOpen={isFaqModalOpen} onClose={handleCloseFaqModals} onSave={handleSaveFaq} faq={editingFaq} />
            <ConfirmationModal isOpen={isFaqConfirmModalOpen} onClose={handleCloseFaqModals} onConfirm={handleDeleteFaq} title="ยืนยันการลบ" message={`คุณแน่ใจหรือไม่ว่าต้องการลบคำถาม "${deletingFaq?.question}"?`} />
            <AnnouncementModal isOpen={isCmsModalOpen} onClose={handleCloseCmsModals} onSave={handleSaveAnnouncement} announcement={editingAnnouncement} />
            <ConfirmationModal isOpen={isCmsConfirmModalOpen} onClose={handleCloseCmsModals} onConfirm={handleDeleteAnnouncement} title="ยืนยันการลบ" message={`คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ "${deletingAnnouncement?.title}"?`} />
            
            <CourseRegistrationsModal 
                isOpen={isRegModalOpen}
                onClose={handleCloseRegViewModal}
                course={viewingRegistrationsCourse}
                registrations={viewingRegistrationsCourse ? registrations.filter(r => r.courseId === viewingRegistrationsCourse.courseId) : []}
                onCancelRegistration={handleOpenCancelRegConfirm}
                onExportCsv={handleExportCourseCsv}
            />

            <ConfirmationModal 
                isOpen={isRegConfirmModalOpen} 
                onClose={handleCloseRegConfirmModal} 
                onConfirm={handleCancelRegistration} 
                title="ยืนยันยกเลิก" 
                message={`คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการลงทะเบียนของ "${cancelingRegistration?.firstName} ${cancelingRegistration?.lastName}"?`} 
            />
        </div>
    );
};

export default AdminDashboardView;