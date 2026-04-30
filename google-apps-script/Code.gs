/**
 * Google Apps Script - Wedding Wishes & RSVP Form Handler
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Google Sheets → Extensions → Apps Script
 * 2. Xóa code mặc định, paste toàn bộ code này vào
 * 3. Đảm bảo Sheet đầu tiên có tên "Sheet1" (hoặc đổi SHEET_NAME bên dưới)
 * 4. Thêm header row (dòng 1) với các cột:
 *    A: Timestamp | B: Họ và Tên | C: Quan hệ | D: Lời chúc | E: Tham dự | F: Số người | G: Yêu cầu ăn uống
 * 5. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy
 * 6. Copy URL mới và cập nhật vào file form-fill.js (dòng fetch URL)
 */

const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Sheet not found" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);

    const timestamp = new Date();
    const name = data.name || "";
    const relationship = data.relationship || "";
    const message = data.message || "";
    const attendance = data.attendance || "";
    const guestCount = data.guestCount || "";
    const dietaryRequirements = data.dietaryRequirements || "";

    // Map attendance value sang tiếng Việt cho dễ đọc trong Sheet
    let attendanceDisplay = "";
    if (attendance === "attending") {
      attendanceDisplay = "✅ Sẽ tham dự";
    } else if (attendance === "not-attending") {
      attendanceDisplay = "❌ Không tham dự";
    }

    sheet.appendRow([
      timestamp,
      name,
      relationship,
      message,
      attendanceDisplay,
      guestCount,
      dietaryRequirements
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Data saved" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý GET request (dùng để test nhanh xem script có hoạt động không)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "Wedding form script is running!" })
  ).setMimeType(ContentService.MimeType.JSON);
}
