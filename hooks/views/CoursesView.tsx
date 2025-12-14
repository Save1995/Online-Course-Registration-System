
import React, { useState, useEffect } from 'react';
import api from '../../services/mockApi';
import type { Course } from '../../types';
import CourseCard from '../../contexts/components/CourseCard';
import RegistrationModal from '../../contexts/components/RegistrationModal';
import CourseDetailModal from '../../contexts/components/CourseDetailModal';

const CourseCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col border-t-4 border-gray-200 dark:border-gray-600 animate-pulse h-full">
        <div className="p-6 flex-grow space-y-4">
            <div className="flex justify-between items-start">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
            <div className="h-16 bg-gray-100 dark:bg-gray-600/50 rounded-lg"></div>
            <div className="space-y-2">
                 <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                 <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
        </div>
        <div className="p-5 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-600 flex justify-between items-center">
             <div className="space-y-1">
                 <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                 <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
             </div>
             <div className="h-9 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
        </div>
    </div>
);

const CoursesView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleRegisterClick = (course: Course) => {
    setSelectedDetailCourse(null); // Close detail modal if open
    setSelectedCourse(course);
  };

  const handleViewDetailClick = (course: Course) => {
    setSelectedDetailCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setSelectedDetailCourse(null);
  };

  // Filter out closed courses
  const visibleCourses = courses.filter(course => course.status !== 'closed');

  if (loading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">หลักสูตรที่เปิดรับสมัคร</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseCardSkeleton key={i} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">หลักสูตรที่เปิดรับสมัคร</h2>
      {visibleCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCourses.map(course => (
            <CourseCard 
                key={course.courseId} 
                course={course} 
                onRegisterClick={handleRegisterClick}
                onViewDetailClick={handleViewDetailClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">ไม่มีหลักสูตรที่เปิดรับสมัครในขณะนี้</p>
        </div>
      )}

      {selectedDetailCourse && (
          <CourseDetailModal
            course={selectedDetailCourse}
            onClose={handleCloseModal}
            onRegister={handleRegisterClick}
          />
      )}

      {selectedCourse && (
        <RegistrationModal 
            course={selectedCourse} 
            onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default CoursesView;
