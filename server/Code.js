
// GAS: Serve the HTML
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('Online Course Registration System');
}

// --- Database Helper Functions ---

function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Initialize headers based on sheet name
    const headers = getHeaders(sheetName);
    if (headers.length > 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

function getHeaders(sheetName) {
  switch (sheetName) {
    case 'Courses': return ['courseId', 'courseName', 'courseGen', 'description', 'startDate', 'endDate', 'registrationStart', 'registrationEnd', 'maxParticipants', 'currentParticipants', 'location', 'instructor', 'status'];
    case 'Registrations': return ['registrationId', 'courseId', 'courseName', 'firstName', 'lastName', 'idCard', 'birthDate', 'phone', 'email', 'organization', 'position', 'address', 'registrationDate', 'status'];
    case 'Faqs': return ['id', 'question', 'answer'];
    case 'Announcements': return ['id', 'title', 'content', 'postedDate', 'type'];
    case 'ContactInfo': return ['phone', 'email', 'address'];
    default: return [];
  }
}

function getData(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove headers
  
  if (!data || data.length === 0) return [];

  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Convert GAS Date objects to ISO strings for frontend
      if (row[index] instanceof Date) {
        const d = row[index];
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        obj[header] = `${year}-${month}-${day}`; 
      } else {
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

function addRow(sheetName, dataObj) {
  const sheet = getSheet(sheetName);
  const headers = getHeaders(sheetName);
  const row = headers.map(header => dataObj[header] || '');
  sheet.appendRow(row);
  return dataObj;
}

function updateRow(sheetName, idField, dataObj) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idField);
  
  // Find row index (data includes header)
  const rowIndex = data.findIndex(row => String(row[idIndex]) === String(dataObj[idField]));
  
  if (rowIndex === -1) throw new Error('Item not found');
  
  const newRow = headers.map(header => dataObj[header]);
  
  // Update the row (rowIndex + 1 because Sheets are 1-indexed)
  sheet.getRange(rowIndex + 1, 1, 1, newRow.length).setValues([newRow]);
  return dataObj;
}

function deleteRow(sheetName, idField, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf(idField);
  
  const rowIndex = data.findIndex(row => String(row[idIndex]) === String(id));
  
  if (rowIndex !== -1) {
    sheet.deleteRow(rowIndex + 1);
    return { success: true };
  }
  return { success: false };
}

// --- API Methods exposed to Frontend ---

function apiGetCourses() {
  return JSON.stringify(getData('Courses'));
}

function apiAddCourse(courseData) {
  const newCourse = {
    ...courseData,
    courseId: 'C' + new Date().getTime(),
    currentParticipants: 0
  };
  addRow('Courses', newCourse);
  return JSON.stringify(newCourse);
}

function apiUpdateCourse(courseData) {
  updateRow('Courses', 'courseId', courseData);
  return JSON.stringify(courseData);
}

function apiDeleteCourse(courseId) {
  return JSON.stringify(deleteRow('Courses', 'courseId', courseId));
}

function apiGetRegistrations() {
  return JSON.stringify(getData('Registrations'));
}

function apiAddRegistration(regData) {
  // Logic to check limits
  const courses = JSON.parse(apiGetCourses());
  const course = courses.find(c => c.courseId === regData.courseId);
  
  if (!course) throw new Error('ไม่พบหลักสูตรที่ระบุ');
  if (Number(course.currentParticipants) >= Number(course.maxParticipants)) throw new Error('ขออภัย หลักสูตรนี้เต็มแล้ว');

  // Check duplicate
  const registrations = JSON.parse(apiGetRegistrations());
  const isDuplicate = registrations.some(reg => reg.courseId === regData.courseId && reg.idCard === regData.idCard && reg.status !== 'cancelled');
  if (isDuplicate) throw new Error('ท่านได้ลงทะเบียนหลักสูตรนี้แล้วด้วยเลขบัตรประชาชนนี้');

  const newReg = {
    ...regData,
    registrationId: 'R' + new Date().getTime(),
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    courseName: course.courseName
  };
  
  addRow('Registrations', newReg);
  
  // Update Course participant count
  course.currentParticipants = Number(course.currentParticipants) + 1;
  apiUpdateCourse(course);
  
  return JSON.stringify(newReg);
}

function apiCancelRegistration(registrationId) {
  const registrations = getData('Registrations');
  const regIndex = registrations.findIndex(r => String(r.registrationId) === String(registrationId));
  
  if (regIndex === -1) throw new Error('Registration not found');
  
  const reg = registrations[regIndex];
  
  // Only proceed if not already cancelled
  if (reg.status !== 'cancelled') {
    reg.status = 'cancelled';
    updateRow('Registrations', 'registrationId', reg);
    
    // Update course participant count
    const courses = getData('Courses');
    const course = courses.find(c => String(c.courseId) === String(reg.courseId));
    if (course) {
      course.currentParticipants = Math.max(0, Number(course.currentParticipants) - 1);
      apiUpdateCourse(course);
    }
  }
  
  return JSON.stringify(reg);
}

function apiGetFaqs() {
  return JSON.stringify(getData('Faqs'));
}

function apiAddFaq(faqData) {
  const newFaq = { ...faqData, id: 'faq' + new Date().getTime() };
  addRow('Faqs', newFaq);
  return JSON.stringify(newFaq);
}

function apiUpdateFaq(faqData) {
  updateRow('Faqs', 'id', faqData);
  return JSON.stringify(faqData);
}

function apiDeleteFaq(faqId) {
  return JSON.stringify(deleteRow('Faqs', 'id', faqId));
}

function apiGetAnnouncements() {
  const data = getData('Announcements');
  // Sort by date descending
  data.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  return JSON.stringify(data);
}

function apiAddAnnouncement(annoData) {
  const newAnno = { 
    ...annoData, 
    id: 'anno' + new Date().getTime(),
    postedDate: new Date().toISOString().split('T')[0]
  };
  addRow('Announcements', newAnno);
  return JSON.stringify(newAnno);
}

function apiUpdateAnnouncement(annoData) {
  updateRow('Announcements', 'id', annoData);
  return JSON.stringify(annoData);
}

function apiDeleteAnnouncement(id) {
  return JSON.stringify(deleteRow('Announcements', 'id', id));
}

function apiGetContactInfo() {
  const data = getData('ContactInfo');
  if (data.length > 0) return JSON.stringify(data[0]);
  
  // Default if empty
  return JSON.stringify({
    phone: "02-XXX-XXXX",
    email: "admin@example.com",
    address: "วิทยาลัยนักบริหารสาธารณสุข<br/>กระทรวงสาธารณสุข"
  });
}

function apiUpdateContactInfo(infoData) {
  const sheet = getSheet('ContactInfo');
  sheet.clearContents(); // Simple override for singleton data
  sheet.appendRow(getHeaders('ContactInfo'));
  addRow('ContactInfo', infoData);
  return JSON.stringify(infoData);
}
