# Google Sheets Customer Data Setup

This guide will help you automatically log all course enrollments to a Google Sheet.

---

## What Gets Logged

Every time a customer completes a payment, this information is automatically added to your Google Sheet:

| Date/Time | Customer Name | Email | Course Name | Course ID | Amount Paid | Stripe Session ID |
|-----------|---------------|-------|-------------|-----------|-------------|-------------------|
| Dec 24, 2025 3:45 PM | John Doe | john@example.com | AI Fundamentals - Self-Paced | ai-fundamentals-self-paced | USD 497.00 | cs_test_abc123... |

---

## Step 1: Create Your Google Sheet

1. **Go to Google Sheets**: https://sheets.google.com
2. **Click "+ Blank"** to create a new spreadsheet
3. **Rename the sheet** (bottom tab) to: `Enrollments`
4. **Add headers in Row 1**:
   - A1: `Date/Time`
   - B1: `Customer Name`
   - C1: `Email`
   - D1: `Course Name`
   - E1: `Course ID`
   - F1: `Amount Paid`
   - G1: `Stripe Session ID`

5. **Format the header row** (optional but recommended):
   - Select row 1
   - Make it bold
   - Add background color
   - Freeze the row: View → Freeze → 1 row

6. **Note the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
                                            ^^^^^^^^^^^^^^^^^^^
   ```
   Copy this ID - you'll need it later.

---

## Step 2: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project**:
   - Click the project dropdown (top bar)
   - Click "New Project"
   - Name: `EST AI Consulting`
   - Click "Create"
3. **Wait for project creation** (10-20 seconds)
4. **Make sure your new project is selected** (check top bar)

---

## Step 3: Enable Google Sheets API

1. **In Google Cloud Console**, go to: **APIs & Services** → **Library**
   - Or visit: https://console.cloud.google.com/apis/library
2. **Search for**: "Google Sheets API"
3. **Click "Google Sheets API"**
4. **Click "Enable"**
5. **Wait for it to enable** (~10 seconds)

---

## Step 4: Create Service Account

1. **Go to**: **APIs & Services** → **Credentials**
   - Or visit: https://console.cloud.google.com/apis/credentials
2. **Click "+ CREATE CREDENTIALS"** → **Service account**
3. **Fill in details**:
   - **Service account name**: `netlify-sheets-writer`
   - **Service account ID**: (auto-filled)
   - **Description**: "Writes course enrollment data to Google Sheets"
4. **Click "Create and Continue"**
5. **Grant permissions** (Step 2):
   - Click "Select a role"
   - Type "Editor" and select **"Editor"**
   - Click "Continue"
6. **Skip Step 3** (no need to grant users access)
7. **Click "Done"**

---

## Step 5: Create Service Account Key

1. **Find your service account** in the credentials list
   - Should be: `netlify-sheets-writer@your-project-id.iam.gserviceaccount.com`
2. **Click on the service account email**
3. **Go to the "Keys" tab**
4. **Click "Add Key"** → **"Create new key"**
5. **Choose "JSON"** format
6. **Click "Create"**
7. **A JSON file will download** - this contains your credentials
8. **Keep this file safe!** Don't share it or commit it to Git

---

## Step 6: Share Google Sheet with Service Account

1. **Open your Google Sheet** (the one you created in Step 1)
2. **Click "Share"** button (top right)
3. **Paste the service account email**:
   - Should be: `netlify-sheets-writer@your-project-id.iam.gserviceaccount.com`
   - You can find this in the JSON file you downloaded (look for `client_email`)
4. **Set permission to "Editor"**
5. **Uncheck "Notify people"** (it's a robot, not a person)
6. **Click "Share"**
7. ✅ Done!

---

## Step 7: Add Credentials to Netlify

1. **Open the JSON key file** you downloaded
2. **Copy the entire contents** (should start with `{` and end with `}`)
3. **Go to Netlify Dashboard** → Your Site → **Site configuration** → **Environment variables**
4. **Add Variable 1**:
   - Key: `GOOGLE_SHEETS_CREDENTIALS`
   - Value: Paste the entire JSON content
   - Scopes: Check all
   - Click "Create variable"

5. **Add Variable 2**:
   - Key: `GOOGLE_SHEET_ID`
   - Value: Your spreadsheet ID from Step 1
   - Scopes: Check all
   - Click "Create variable"

---

## Step 8: Deploy and Test

1. **Trigger a new deployment** in Netlify:
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for deployment

2. **Test the integration**:
   - Go to your website
   - Complete a test payment (use test card `4242 4242 4242 4242`)
   - Check your Google Sheet
   - You should see a new row with the enrollment data!

---

## Troubleshooting

### "Permission denied" error

**Problem**: Service account doesn't have access to the sheet

**Solution**:
1. Check that you shared the Google Sheet with the service account email
2. Make sure you gave "Editor" permission (not "Viewer")
3. Verify the service account email in the JSON file matches what you shared

### "Invalid credentials" error

**Problem**: JSON credentials are malformed or incorrect

**Solution**:
1. Make sure you copied the ENTIRE JSON file content
2. Check that it starts with `{` and ends with `}`
3. Verify there are no extra spaces or line breaks
4. Try downloading the key again from Google Cloud Console

### "Spreadsheet not found" error

**Problem**: Wrong spreadsheet ID

**Solution**:
1. Double-check the spreadsheet ID from the URL
2. Make sure you're using the ID, not the full URL
3. Verify the spreadsheet still exists and you have access

### Data not appearing in sheet

**Checklist**:
1. ✅ Google Sheets API is enabled in Google Cloud
2. ✅ Service account has Editor role
3. ✅ Sheet is shared with service account email
4. ✅ Sheet has a tab named "Enrollments"
5. ✅ GOOGLE_SHEETS_CREDENTIALS is set in Netlify
6. ✅ GOOGLE_SHEET_ID is set in Netlify
7. ✅ Site has been redeployed after adding variables

**Check Netlify Function Logs**:
- Go to Netlify → Functions → webhook
- Look for errors in the logs
- Should see "✅ Enrollment logged to Google Sheets" on success

---

## Sheet Tips & Organization

### Add Formulas

**Total Revenue**:
```
=SUMIF(F:F,"USD*",VALUE(REGEXEXTRACT(F:F,"[0-9.]+")))
```

**Count by Course**:
```
=COUNTIF(D:D,"AI Fundamentals - Self-Paced")
```

### Add Filters

1. Select header row
2. Click Data → Create a filter
3. Now you can filter by course, date, etc.

### Create Summary Dashboard

Create a second sheet called "Dashboard" with:
- Total enrollments: `=COUNTA(Enrollments!B:B)-1`
- Total revenue: Formula above
- Enrollments by course: Pivot table or COUNTIF formulas
- Recent enrollments: Filter last 7/30 days

### Auto-Sorting

To auto-sort by date (newest first):
1. Select all data (A1:G)
2. Data → Sort range
3. Sort by "Date/Time"
4. Check "Z → A" (descending)

---

## Security Best Practices

1. **Never commit credentials to Git**
   - The JSON file should NEVER be in your repository
   - It's already in `.gitignore` as `*.json`

2. **Keep credentials in Netlify only**
   - Environment variables are encrypted and secure

3. **Limit service account permissions**
   - Only give access to the specific sheet you need
   - Don't share the service account with other sheets unless necessary

4. **Rotate keys periodically**
   - Every 6-12 months, create a new key and delete the old one

5. **Monitor access**
   - Check Google Sheet version history for unexpected changes
   - Review service account activity in Google Cloud Console

---

## What Data You Can Track

Beyond the basics, you can expand the sheet to track:

**Customer Journey**:
- Lead capture source (which page they came from)
- Time between lead capture and purchase
- Marketing campaign attribution

**Course Analytics**:
- Most popular courses
- Revenue by course type
- Average order value
- Conversion rate from leads to purchases

**Customer Data**:
- Phone number (if collected)
- Company name (for business courses)
- Team size (for team packages)
- Custom fields specific to your business

To add these fields:
1. Collect the data in your form or Stripe metadata
2. Pass it to the webhook function
3. Add it to the `row` array in `logToGoogleSheets()`
4. Add corresponding column headers in your sheet

---

## Alternative: Export from Stripe

You can also export customer data directly from Stripe:

1. Go to Stripe Dashboard → Payments
2. Click "Export" → Choose format (CSV, Excel)
3. Filter by date range
4. Download

**Pros**: No setup required
**Cons**: Manual process, doesn't auto-update

---

## Quick Reference

### Environment Variables Needed
```
GOOGLE_SHEETS_CREDENTIALS = {entire JSON file content}
GOOGLE_SHEET_ID = your_spreadsheet_id_from_url
```

### Sheet Structure
```
Sheet name: Enrollments
Columns: Date/Time | Customer Name | Email | Course Name | Course ID | Amount Paid | Stripe Session ID
```

### Service Account Email Format
```
netlify-sheets-writer@your-project-id.iam.gserviceaccount.com
```

---

## Success Checklist

- [ ] Google Sheet created with "Enrollments" tab
- [ ] Headers added to Row 1
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created with Editor role
- [ ] Service account key (JSON) downloaded
- [ ] Google Sheet shared with service account
- [ ] GOOGLE_SHEETS_CREDENTIALS added to Netlify
- [ ] GOOGLE_SHEET_ID added to Netlify
- [ ] Site redeployed
- [ ] Test payment completed
- [ ] Data appears in Google Sheet

---

**🎉 Once complete, all future enrollments will automatically log to your Google Sheet!**

You can access your data anytime, create reports, export to other tools, or integrate with other services.
