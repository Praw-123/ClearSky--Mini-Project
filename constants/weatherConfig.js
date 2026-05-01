// ไฟล์นี้เก็บค่า config และฟังก์ชันที่เกี่ยวกับสภาพอากาศทั้งหมด
// แยกออกมาเพื่อให้ไฟล์อื่น import ไปใช้ได้ง่าย

// API Key จาก OpenWeatherMap
export const API_KEY = 'ad044ee78deb31ddecbccf79c9af4d07';

// ฟังก์ชันคืนค่าสีพื้นหลังตามสภาพอากาศ
// รับ weatherMain เช่น 'Clear', 'Rain', 'Clouds'
// คืนค่าเป็น array สี 2 ค่า [สีหลัก, สีรอง]
export const getBackground = (weatherMain) => {
  switch (weatherMain) {
    case 'Clear': return ['#f7b733', '#fc4a1a'];        // แดด → สีส้ม
    case 'Clouds': return ['#606c88', '#3f3c6e'];       // เมฆ → สีเทา
    case 'Rain': return ['#373b44', '#4286f4'];         // ฝน → สีน้ำเงินเข้ม
    case 'Thunderstorm': return ['#232526', '#414345']; // พายุ → สีดำ
    case 'Snow': return ['#e0eafc', '#cfdef3'];         // หิมะ → สีขาว
    default: return ['#1a56a0', '#0d3b73'];             // ค่าเริ่มต้น → สีน้ำเงิน
  }
};

// ฟังก์ชันคืนค่า emoji ตามสภาพอากาศ
export const getEmoji = (weatherMain) => {
  switch (weatherMain) {
    case 'Clear': return '☀️';
    case 'Clouds': return '☁️';
    case 'Rain': return '🌧️';
    case 'Thunderstorm': return '⛈️';
    case 'Snow': return '❄️';
    default: return '🌤️';
  }
};