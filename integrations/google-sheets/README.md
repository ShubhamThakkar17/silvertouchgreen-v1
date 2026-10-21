# Enquiry form → Google Sheet + email

Every enquiry from the website's contact form is added as a row in a Google Sheet, and an email with the details goes to `shubham.thakkar@silvertouchgreen.com`. Replying to that email goes straight to the person who enquired.

It runs on Google Apps Script, so it's free and the data stays in your own Google account. No other service is involved.

## Setup (about 5 minutes)

1. **Create the sheet.** Sign in to Google with the account that should own the data (ideally a company account) and create a blank spreadsheet, for example "Website enquiries".
2. **Add the script.** In the sheet, open **Extensions → Apps Script**. Delete the sample code, paste in everything from [`Code.gs`](Code.gs), and save.
3. **Deploy it.**
   - Click **Deploy → New deployment**.
   - Choose the type **Web app**.
   - Set **Execute as** to *Me*.
   - Set **Who has access** to *Anyone*. This only lets the website send data in; it does not make the sheet public.
   - Click **Deploy**.
4. **Authorise.** Google asks for permission to edit the sheet and send email as you. Allow it. On a personal Gmail account you may need to choose **Advanced → Go to (project name)**.
5. **Copy the web app URL.** It looks like `https://script.google.com/macros/s/…/exec`.
6. **Connect the website.** In `index.html`, put that URL in the form's `data-endpoint` attribute:

   ```html
   <form id="enquiry-form" … data-endpoint="https://script.google.com/macros/s/…/exec">
   ```

   Commit and push.

To test it, submit the form on the live site. A new row should appear in the **Enquiries** tab, which is created with a header row on the first submission, and an email should arrive.

## Changing things later

- **Recipients:** edit `NOTIFY_TO` at the top of `Code.gs`. Separate several addresses with commas.
- **After editing the script:** go to **Deploy → Manage deployments**, edit the deployment and pick **New version**. The URL stays the same.

## Limits

- **Email quota:** Google allows about 100 notification emails a day on a free Gmail account and about 1,500 on Google Workspace. Rows are still saved to the sheet past that limit.
- **Spam:** the form has a hidden "website" field. Bots that fill it in are ignored without being saved or emailed.
