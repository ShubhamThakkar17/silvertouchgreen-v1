/**
 * SilverTouch Green: website enquiry form -> Google Sheet + email notification.
 *
 * Paste this into the Apps Script editor of the spreadsheet that should hold
 * enquiries (Extensions > Apps Script), then deploy it as a web app.
 * Full steps: integrations/google-sheets/README.md
 */

// Who gets an email for every new enquiry. Separate several addresses with commas.
var NOTIFY_TO = 'shubham.thakkar@silvertouchgreen.com';

// Tab that stores the enquiries. It is created on the first submission.
var SHEET_NAME = 'Enquiries';

// Form fields, in column order. Names match the inputs in index.html.
var FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'facility', label: 'Facility type' },
  { key: 'location', label: 'Project location' },
  { key: 'energy', label: 'Energy requirement' },
  { key: 'notes', label: 'Notes' }
];

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: real visitors never see or fill the "website" field.
  if (p.website) return json_({ ok: true });

  var values = {};
  FIELDS.forEach(function (f) {
    values[f.key] = String(p[f.key] || '').trim().slice(0, 2000);
  });
  if (!values.name || !values.email) return json_({ ok: false, error: 'missing_fields' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var row = [new Date()].concat(FIELDS.map(function (f) { return safeCell_(values[f.key]); }));
    row.push(safeCell_(String(p.page || '').slice(0, 300)));
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  notify_(values);
  return json_({ ok: true });
}

// Lets you open the web app URL in a browser to check it is live.
function doGet() {
  return json_({ ok: true, service: 'SilverTouch Green enquiries' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    var header = ['Received'].concat(FIELDS.map(function (f) { return f.label; }), ['Page']);
    sheet.appendRow(header);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#0B4026').setFontColor('#C4DC66');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify_(v) {
  if (!NOTIFY_TO) return;
  var rows = FIELDS.map(function (f) {
    return '<tr><td style="padding:6px 12px 6px 0;color:#627567;vertical-align:top">' + f.label + '</td>' +
      '<td style="padding:6px 0;color:#0a2216">' + escape_(v[f.key] || '-').replace(/\n/g, '<br>') + '</td></tr>';
  }).join('');
  var html = '<div style="font-family:Arial,sans-serif;font-size:14px">' +
    '<p style="color:#0B4026;font-size:16px;font-weight:bold">New enquiry from the website</p>' +
    '<table style="border-collapse:collapse">' + rows + '</table>' +
    '<p style="color:#627567;font-size:12px">Saved to the "' + SHEET_NAME + '" sheet. Reply to this email to answer the enquirer directly.</p></div>';
  var opts = {
    to: NOTIFY_TO,
    subject: 'New website enquiry: ' + (v.company || v.name),
    htmlBody: html,
    name: 'SilverTouch Green website'
  };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) opts.replyTo = v.email;
  MailApp.sendEmail(opts);
}

// Stops values such as "=HYPERLINK(...)" being run as spreadsheet formulas.
function safeCell_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function escape_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
