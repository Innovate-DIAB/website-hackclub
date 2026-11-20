/**
 * DIAB Innovate: external member sign-ups.
 * Lives in the Apps Script project "DIAB Innovate Sign-ups" (script.google.com),
 * deployed as a Web app (Execute as: Me, Who has access: Anyone).
 * Every sign-up from signup.html becomes one new row in the "Sign-ups" tab.
 */

// The Google Sheet the sign-ups go into (the long ID in its web address)
const SHEET_ID = "1s0tnxZLmk-LdcHclcZClxGPW3qE1kX_q_0VfkE33pK8";
const SHEET_NAME = "Sign-ups";
const HEADERS = [
  "Submitted at", "Full name", "Email", "Contact number", "Age", "School",
  "Year / Grade", "Interests", "Other interest",
  "Parent/guardian name", "Parent/guardian email", "Parent/guardian phone",
  "Country", "Time zone", "Parent consent"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter;

    // Spam trap: real people never fill in this hidden box
    if (p.website) return reply({ ok: true });

    if (!p.name || !p.email || !p.parent_email) {
      return reply({ ok: false, error: "Missing details" });
    }

    const interests = (e.parameters.interests || []).join(", ");

    getSheet().appendRow([
      new Date(),
      clean(p.name), clean(p.email), clean(p.phone), clean(p.age), clean(p.school),
      clean(p.grade), clean(interests), clean(p.interest_other),
      clean(p.parent_name), clean(p.parent_email), clean(p.parent_phone),
      clean(p.country), clean(p.timezone), p.consent ? "Yes" : "No"
    ]);

    // Email the club account about it. If the email fails, the sign-up is still saved.
    try {
      notify(p, interests);
    } catch (mailErr) {
      console.error(mailErr);
    }

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Sends a plain-text summary of the new sign-up to the club account
function notify(p, interests) {
  const v = (x) => String(x || "-").slice(0, 300);
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: "New external sign-up: " + v(p.name),
    body: [
      "Someone just signed up as an external member of DIAB Innovate.",
      "",
      "Name: " + v(p.name),
      "Email: " + v(p.email),
      "Contact number: " + v(p.phone),
      "Age: " + v(p.age),
      "School: " + v(p.school),
      "Year / Grade: " + v(p.grade),
      "Interests: " + v(interests) + (p.interest_other ? " (also: " + v(p.interest_other) + ")" : ""),
      "",
      "Parent/guardian: " + v(p.parent_name),
      "Parent email: " + v(p.parent_email),
      "Parent phone: " + v(p.parent_phone),
      "",
      "Country: " + v(p.country),
      "Time zone: " + v(p.timezone),
      "",
      "All sign-ups: https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/edit"
    ].join("\n")
  });
}

// Visiting the web app link in a browser just shows that it's working
function doGet() {
  return reply({ ok: true, message: "DIAB Innovate sign-ups are working." });
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Stops typed text from being run as a spreadsheet formula,
// and keeps phone numbers like +971... as text
function clean(value) {
  const text = String(value || "").trim().slice(0, 500);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
