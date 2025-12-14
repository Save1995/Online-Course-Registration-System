
import type { Course, Registration, Faq, ContactInfo, Announcement } from '../types';

// --- Local Mock Data (Fallback) ---
let mockCourses: Course[] = [
    {
        courseId: "C001",
        courseName: "การบริหารจัดการโรงพยาบาล",
        courseGen: "15",
        description: "หลักสูตรพัฒนาทักษะการบริหารจัดการโรงพยาบาลสำหรับผู้บริหารระดับกลาง",
        startDate: "2025-03-15",
        endDate: "2026-03-20",
        registrationStart: "2025-01-01",
        registrationEnd: "2026-08-28",
        maxParticipants: 50,
        currentParticipants: 35,
        location: "โรงแรมสยาม บางกอก",
        instructor: "ดร.สมชาย ใจดี",
        status: "active"
    },
    {
        courseId: "C002",
        courseName: "นโยบายสาธารณสุขแห่งชาติ",
        courseGen: "8",
        description: "หลักสูตรวิเคราะห์นโยบายสาธารณสุขและการวางแผนเชิงกลยุทธ์",
        startDate: "2025-04-10",
        endDate: "2026-04-15",
        registrationStart: "2025-02-01",
        registrationEnd: "2026-09-30",
        maxParticipants: 40,
        currentParticipants: 28,
        location: "ศูนย์ฝึกอบรมกระทรวงสาธารณสุข",
        instructor: "นางสาวสุภาพร แสงทอง",
        status: "active"
    },
    {
        courseId: "C003",
        courseName: "การจัดการทรัพยากรบุคคลในหน่วยงานสาธารณสุข",
        courseGen: "12",
        description: "พัฒนาทักษะการบริหารทรัพยากรบุคคลในองค์กรภาครัฐ",
        startDate: "2025-11-05",
        endDate: "2025-11-10",
        registrationStart: "2025-10-01",
        registrationEnd: "2025-10-30",
        maxParticipants: 35,
        currentParticipants: 15,
        location: "โรงแรมเซ็นทารา แกรนด์ บางกอก",
        instructor: "ผศ.ดร.วิชัย ทองคำ",
        status: "upcoming"
    },
    {
        courseId: "C004",
        courseName: "การเงินและการคลังสำหรับผู้บริหาร",
        courseGen: "5",
        description: "หลักสูตรพื้นฐานด้านการเงินและการคลังสำหรับโรงพยาบาล",
        startDate: "2024-11-10",
        endDate: "2024-11-15",
        registrationStart: "2024-09-01",
        registrationEnd: "2024-10-15",
        maxParticipants: 30,
        currentParticipants: 30,
        location: "ออนไลน์ผ่าน Zoom",
        instructor: "รศ.ดร. สุดา การเงิน",
        status: "closed"
    }
];

let mockRegistrations: Registration[] = [
    {
        registrationId: "R001",
        courseId: "C001",
        courseName: "การบริหารจัดการโรงพยาบาล",
        firstName: "สมศักดิ์",
        lastName: "เจริญผล",
        idCard: "1-2345-67890-12-3",
        birthDate: "1985-05-15",
        phone: "081-234-5678",
        email: "somsak@example.com",
        organization: "โรงพยาบาลนครราชสีมา",
        position: "ผู้อำนวยการฝ่ายบริหาร",
        address: "123 ถนนสุขภาพ ตำบลในเมือง อำเภอเมือง จังหวัดนครราชสีมา 30000",
        registrationDate: "2025-01-15",
        status: "confirmed"
    },
    {
        registrationId: "R002",
        courseId: "C001",
        courseName: "การบริหารจัดการโรงพยาบาล",
        firstName: "กนกวรรณ",
        lastName: "พงษ์ศรี",
        idCard: "2-3456-78901-23-4",
        birthDate: "1988-08-22",
        phone: "082-345-6789",
        email: "kanokwan@example.com",
        organization: "โรงพยาบาลสระบุรี",
        position: "หัวหน้าแผนกพยาบาล",
        address: "456 หมู่ 7 ตำบลบ้านใหม่ อำเภอเมือง จังหวัดสระบุรี 18000",
        registrationDate: "2025-01-20",
        status: "confirmed"
    }
];

let mockFaqs: Faq[] = [
    { id: 'faq1', question: "จะลงทะเบียนเข้าร่วมอบรมได้อย่างไร?", answer: "ให้เลือกหลักสูตรที่ต้องการจากหน้า \"Courses\" จากนั้นคลิกปุ่ม \"ลงทะเบียน\" และกรอกข้อมูลตามแบบฟอร์มที่ปรากฏ" },
    { id: 'faq2', question: "ต้องเตรียมเอกสารอะไรบ้างในการสมัคร?", answer: "ต้องเตรียมสำเนาบัตรประชาชน และใบทะเบียนวุฒิการศึกษา ซึ่งจะต้องอัปโหลดในขั้นตอนการลงทะเบียน" },
    { id: 'faq3', question: "สามารถยกเลิกการลงทะเบียนได้หรือไม่?", answer: "สามารถยกเลิกได้ก่อนวันปิดรับสมัคร โดยติดต่อเจ้าหน้าที่ผ่านช่องทางที่ระบุในหน้า \"About\"" },
    { id: 'faq4', question: "จะตรวจสอบสถานะการลงทะเบียนได้อย่างไร?", answer: "หลังจากลงทะเบียนสำเร็จ ท่านจะได้รับอีเมลยืนยันการสมัคร พร้อมลิงก์สำหรับตรวจสอบสถานะและดาวน์โหลดเอกสาร PDF" }
];

let mockContactInfo: ContactInfo = {
    phone: "02-XXX-XXXX",
    email: "admin@example.com",
    address: "วิทยาลัยนักบริหารสาธารณสุข<br/>กระทรวงสาธารณสุข"
};

let mockAnnouncements: Announcement[] = [
    { id: 'anno1', title: 'เปิดรับสมัครหลักสูตรใหม่ ประจำปี 2568', content: 'เปิดรับสมัครตั้งแต่วันที่ 1 มกราคม 2568 ถึง 31 มีนาคม 2568', postedDate: '2024-12-01', type: 'info'},
    { id: 'anno2', title: 'แจ้งปรับปรุงระบบลงทะเบียนออนไลน์', content: 'ระบบได้รับการอัปเกรดเพื่อเพิ่มประสิทธิภาพในการใช้งาน', postedDate: '2024-11-15', type: 'success'},
    { id: 'anno3', title: 'ผลการคัดเลือกผู้เข้าอบรมหลักสูตร "การบริหารจัดการโรงพยาบาล"', content: 'สามารถตรวจสอบรายชื่อผู้ผ่านการคัดเลือกได้ที่นี่', postedDate: '2024-11-10', type: 'warning'},
];

// --- GAS Bridge Helper ---

declare const google: any;

const isGAS = () => typeof google !== 'undefined' && google.script && google.script.run;

const serverCall = <T>(func: string, ...args: any[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler((res: string) => {
        try {
            resolve(JSON.parse(res));
        } catch(e) {
            // In case it's not JSON (e.g. simple boolean or string)
            resolve(res as unknown as T);
        }
      })
      .withFailureHandler((error: any) => {
        reject(error);
      })
      [func](...args);
  });
};

// --- Hybrid API Implementation ---

const api = {
  getCourses: async (): Promise<Course[]> => {
    if (isGAS()) return serverCall('apiGetCourses');
    return new Promise(resolve => setTimeout(() => resolve([...mockCourses]), 500));
  },

  getRegistrations: async (): Promise<Registration[]> => {
    if (isGAS()) return serverCall('apiGetRegistrations');
    return new Promise(resolve => setTimeout(() => resolve([...mockRegistrations]), 500));
  },

  addRegistration: async (registrationData: Omit<Registration, 'registrationId' | 'registrationDate' | 'status' | 'courseName'>): Promise<Registration> => {
    if (isGAS()) return serverCall('apiAddRegistration', registrationData);
    
    // Mock Logic
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const course = mockCourses.find(c => c.courseId === registrationData.courseId);

            if (!course) {
                return reject({ name: 'CourseNotFound', message: 'ไม่พบหลักสูตรที่ระบุ' });
            }

            if (course.currentParticipants >= course.maxParticipants) {
                return reject({ name: 'CourseFull', message: 'ขออภัย หลักสูตรนี้เต็มแล้ว' });
            }

            const today = new Date();
            const [endYear, endMonth, endDay] = course.registrationEnd.split('-').map(Number);
            const registrationDeadline = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999);

            if (today > registrationDeadline) {
                 return reject({ name: 'RegistrationClosed', message: 'ระยะเวลาการลงทะเบียนสำหรับหลักสูตรนี้สิ้นสุดแล้ว' });
            }

            const isDuplicate = mockRegistrations.some(reg => reg.courseId === registrationData.courseId && reg.idCard === registrationData.idCard && reg.status !== 'cancelled');
            if (isDuplicate) {
                return reject({ name: 'DuplicateRegistration', message: 'ท่านได้ลงทะเบียนหลักสูตรนี้แล้วด้วยเลขบัตรประชาชนนี้' });
            }
            
            // Simulate random error
             if (Math.random() < 0.1) {
                 return reject({ name: 'ServerError', message: 'เกิดข้อผิดพลาดที่ไม่คาดคิดบนเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง' });
            }

            course.currentParticipants = Math.min(course.maxParticipants, course.currentParticipants + 1);

            const newRegistration: Registration = {
                ...registrationData,
                registrationId: `R${Date.now()}`,
                registrationDate: new Date().toISOString().split('T')[0],
                status: 'confirmed',
                courseName: course.courseName,
            };
            mockRegistrations.push(newRegistration);
            
            resolve(newRegistration);
        }, 1000);
    });
  },
  
  cancelRegistration: async (registrationId: string): Promise<Registration> => {
    if (isGAS()) return serverCall('apiCancelRegistration', registrationId);
    
    return new Promise((resolve, reject) => {
        const regIndex = mockRegistrations.findIndex(r => r.registrationId === registrationId);
        if (regIndex === -1) return reject(new Error('Registration not found'));
        
        const reg = mockRegistrations[regIndex];
        
        // Only cancel if not already cancelled to avoid double counting
        if (reg.status !== 'cancelled') {
             reg.status = 'cancelled';
             const course = mockCourses.find(c => c.courseId === reg.courseId);
             if (course) {
                 course.currentParticipants = Math.max(0, course.currentParticipants - 1);
             }
        }
        setTimeout(() => resolve(reg), 500);
    });
  },

  addCourse: async (courseData: Omit<Course, 'courseId' | 'currentParticipants'>): Promise<Course> => {
    if (isGAS()) return serverCall('apiAddCourse', courseData);

    return new Promise(resolve => {
      const newCourse: Course = {
        ...courseData,
        courseId: `C${Date.now()}`,
        currentParticipants: 0,
      };
      mockCourses.push(newCourse);
      setTimeout(() => resolve(newCourse), 500);
    });
  },

  updateCourse: async (courseData: Course): Promise<Course> => {
     if (isGAS()) return serverCall('apiUpdateCourse', courseData);

     return new Promise((resolve, reject) => {
      const index = mockCourses.findIndex(c => c.courseId === courseData.courseId);
      if (index !== -1) {
        mockCourses[index] = courseData;
        setTimeout(() => resolve(courseData), 500);
      } else {
        reject(new Error("Course not found"));
      }
    });
  },

  deleteCourse: async (courseId: string): Promise<{ success: boolean }> => {
    if (isGAS()) return serverCall('apiDeleteCourse', courseId);

    return new Promise(resolve => {
        mockCourses = mockCourses.filter(c => c.courseId !== courseId);
        setTimeout(() => resolve({ success: true }), 500);
    });
  },

  getFaqs: async (): Promise<Faq[]> => {
    if (isGAS()) return serverCall('apiGetFaqs');
    return new Promise(resolve => setTimeout(() => resolve([...mockFaqs]), 500));
  },

  addFaq: async (faqData: Omit<Faq, 'id'>): Promise<Faq> => {
      if (isGAS()) return serverCall('apiAddFaq', faqData);

      return new Promise(resolve => {
          const newFaq: Faq = { ...faqData, id: `faq${Date.now()}` };
          mockFaqs.push(newFaq);
          setTimeout(() => resolve(newFaq), 500);
      });
  },

  updateFaq: async (faqData: Faq): Promise<Faq> => {
      if (isGAS()) return serverCall('apiUpdateFaq', faqData);

      return new Promise((resolve, reject) => {
          const index = mockFaqs.findIndex(f => f.id === faqData.id);
          if (index !== -1) {
              mockFaqs[index] = faqData;
              setTimeout(() => resolve(faqData), 500);
          } else {
              reject(new Error("FAQ not found"));
          }
      });
  },

  deleteFaq: async (faqId: string): Promise<{ success: boolean }> => {
      if (isGAS()) return serverCall('apiDeleteFaq', faqId);

      return new Promise(resolve => {
          mockFaqs = mockFaqs.filter(f => f.id !== faqId);
          setTimeout(() => resolve({ success: true }), 500);
      });
  },

  getContactInfo: async (): Promise<ContactInfo> => {
      if (isGAS()) return serverCall('apiGetContactInfo');
      return new Promise(resolve => setTimeout(() => resolve({ ...mockContactInfo }), 500));
  },

  updateContactInfo: async (contactData: ContactInfo): Promise<ContactInfo> => {
      if (isGAS()) return serverCall('apiUpdateContactInfo', contactData);

      return new Promise(resolve => {
          mockContactInfo = contactData;
          setTimeout(() => resolve({ ...mockContactInfo }), 500);
      });
  },

  getAnnouncements: async (): Promise<Announcement[]> => {
    if (isGAS()) return serverCall('apiGetAnnouncements');
    return new Promise(resolve => setTimeout(() => resolve([...mockAnnouncements].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())), 500));
  },

  addAnnouncement: async (announcementData: Omit<Announcement, 'id' | 'postedDate'>): Promise<Announcement> => {
    if (isGAS()) return serverCall('apiAddAnnouncement', announcementData);

    return new Promise(resolve => {
        const newAnnouncement: Announcement = { 
            ...announcementData, 
            id: `anno${Date.now()}`,
            postedDate: new Date().toISOString().split('T')[0]
        };
        mockAnnouncements.push(newAnnouncement);
        setTimeout(() => resolve(newAnnouncement), 500);
    });
  },

  updateAnnouncement: async (announcementData: Announcement): Promise<Announcement> => {
      if (isGAS()) return serverCall('apiUpdateAnnouncement', announcementData);

      return new Promise((resolve, reject) => {
          const index = mockAnnouncements.findIndex(a => a.id === announcementData.id);
          if (index !== -1) {
              mockAnnouncements[index] = announcementData;
              setTimeout(() => resolve(announcementData), 500);
          } else {
              reject(new Error("Announcement not found"));
          }
      });
  },

  deleteAnnouncement: async (announcementId: string): Promise<{ success: boolean }> => {
      if (isGAS()) return serverCall('apiDeleteAnnouncement', announcementId);

      return new Promise(resolve => {
          mockAnnouncements = mockAnnouncements.filter(a => a.id !== announcementId);
          setTimeout(() => resolve({ success: true }), 500);
      });
  },
};

export default api;
