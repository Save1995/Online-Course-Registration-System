
import React, { useState, useEffect } from 'react';
import api from '../../services/mockApi';
import type { ContactInfo } from '../../types';
import LoadingSpinner from '../../contexts/components/LoadingSpinner';

const AboutView: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await api.getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center items-center h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p>Could not load contact information.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 flex flex-col h-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b dark:border-gray-700 pb-2">ติดต่อเรา</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">ข้อมูลการติดต่อ</h3>
          <div className="space-y-4 flex-grow flex flex-col justify-start">
            <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mr-4 text-blue-600 dark:text-blue-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">โทรศัพท์</p>
                <p className="text-gray-600 dark:text-gray-400 text-base">{contactInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mr-4 text-blue-600 dark:text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">อีเมล</p>
                <p className="text-gray-600 dark:text-gray-400 text-base">{contactInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex-grow md:flex-grow-0">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mr-4 text-blue-600 dark:text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">ที่อยู่</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: contactInfo.address }}></p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">แผนที่</h3>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl flex-grow min-h-[250px] md:min-h-0 flex items-center justify-center border-2 border-gray-100 dark:border-gray-600">
            <div className="text-center">
                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                 <p className="text-gray-500 dark:text-gray-400 font-medium">Google Maps Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
