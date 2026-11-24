# External sign-ups → Google Sheet

`signup.html` sends every external sign-up to a small Google Apps Script,
which adds it as a new row in the club's Google Sheet. Both live in the
club Google account (innovateatdiab@gmail.com).

## Seeing the sign-ups

Open the Google Sheet **DIAB Innovate External Sign-ups** (in that account's Google Drive),
tab **Sign-ups**. Each row is one person, newest at the bottom.

- **Email alerts:** the script emails innovateatdiab@gmail.com with the person's details
  every time someone signs up (subject: "New external sign-up: <name>").
  To forward these to another inbox, set up a Gmail filter on that subject.
- **Download it:** File > Download > Microsoft Excel (.xlsx) or CSV.
- **Share it with another organiser:** Share button (top right), add their email.
  Only people you share it with can see it. It holds students' and parents' contact
  details, so keep it to organisers.

## How it's wired up

- Apps Script project: **DIAB Innovate Sign-ups** at script.google.com (same account).
  Its code is `Code.gs` in this folder. `SHEET_ID` in it points at the Sheet.
- It's deployed as a **Web app** (Execute as: Me, Who has access: Anyone).
  The Web app URL is `SCRIPT_URL` at the top of `signup.js`.
- Opening the Web app URL in a browser shows `"Innovate @ DIAB sign-ups are working."`

## If you change Code.gs

In the Apps Script project, paste the new code, Save, then
**Deploy > Manage deployments > pencil icon > Version: New version > Deploy**.
That keeps the same URL, so `signup.js` doesn't need to change.
