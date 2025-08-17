# Firebase CRM Setup Guide

## Quick Start - What You Need to Do

### 1. Create Firebase Project (5 minutes)
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Name it: "grievances-crm"
4. Disable Google Analytics for now (can enable later)
5. Click "Create Project"

### 2. Enable Required Services (3 minutes)
In your Firebase Console:

#### A. Firestore Database
- Click "Firestore Database" in left menu
- Click "Create database"
- Choose "Start in production mode"
- Select location: "northamerica-northeast1" (Montreal)
- Click "Enable"

#### B. Authentication (Optional - for admin panel)
- Click "Authentication" in left menu
- Click "Get started"
- Enable "Email/Password" provider

### 3. Get Your Configuration (2 minutes)
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click "</>" (Web) icon
4. Register app with nickname: "grievances-website"
5. Copy the firebaseConfig object

### 4. Update the Website (2 minutes)
Replace the config in `/js/firebase-crm.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "grievances-crm.firebaseapp.com",
    projectId: "grievances-crm",
    storageBucket: "grievances-crm.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 5. Set Security Rules (Important!)
In Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public to create leads only
    match /leads/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Admin access for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Add Firebase Scripts to Contact Page
In `/pages/contact.html`, add before closing </body>:
```html
<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>

<!-- Your CRM Script -->
<script src="../js/firebase-crm.js"></script>
```

## Email Automation Options

### Option A: Firebase Extensions (Easiest)
1. In Firebase Console → Extensions
2. Install "Trigger Email from Firestore"
3. Configure with your SMTP settings
4. It will auto-send emails when leads are created

### Option B: SendGrid (Free tier: 100 emails/day)
1. Sign up at sendgrid.com
2. Get API key
3. I'll create Cloud Functions to handle emails

### Option C: Use Your Gmail
- We can use the Gmail MCP tools you already have
- Create a simple workflow to check new leads daily

## Testing Your Setup

### 1. Test Form Submission
- Open `/pages/contact.html` in browser
- Fill out form
- Submit

### 2. Check Firestore
- Go to Firebase Console → Firestore
- You should see a "leads" collection
- Click it to see your test submission

### 3. Verify Data Structure
Your lead should have:
- Personal info (name, email, etc.)
- Metadata (timestamp, status, score)
- Tags for segmentation
- Follow-up date

## Admin Dashboard (Optional)

I can create a simple admin page that:
- Shows all leads in a table
- Filters by status/date/score
- Updates lead status
- Adds notes
- Exports to CSV
- Shows analytics

Would you like me to build this?

## Alternative: Connect to Google Sheets

If you prefer Google Sheets interface:
1. Keep Firebase for collection
2. Use Cloud Functions to sync to Sheets
3. Manage leads in familiar spreadsheet

## Next Steps

1. **Complete Firebase setup** (steps 1-6 above)
2. **Choose email solution** (A, B, or C)
3. **Test the form**
4. **Decide on admin interface** (Dashboard or Sheets)

## Benefits You're Getting

✅ **Professional lead capture** - Branded, matches your site
✅ **Instant storage** - No delays, real-time database
✅ **Lead scoring** - Automatically prioritizes hot leads
✅ **Analytics** - Track conversions, sources, value
✅ **Scalable** - Handles growth from 10 to 10,000 leads
✅ **Free tier** - More than enough for your needs
✅ **GDPR compliant** - Full control over data

## Common Issues & Solutions

### Form not submitting?
- Check browser console for errors
- Verify Firebase config is correct
- Ensure Firestore is enabled

### Not seeing data in Firestore?
- Check security rules allow writes
- Verify project ID matches
- Look at browser console for errors

### Want to test without Firebase first?
- The form already works in demo mode
- Just logs to console instead of Firebase
- Can test UX before setting up Firebase

## MCP Tools Integration

With your Firebase CRM, we can use MCP tools to:

### Google Sheets (you have this)
- Create daily lead report
- Export leads to spreadsheet
- Track follow-ups

### Gmail (you have this)
- Send welcome emails
- Create follow-up sequences
- Send weekly lead summaries to you

### Google Docs (you have this)
- Generate email templates
- Create lead reports
- Build proposals

### Future: When you're ready
- Google Calendar: Add follow-up reminders
- Analytics: Track website conversions
- Forms: Create surveys for leads

## Questions?

The setup takes about 15 minutes total. The hardest part is just creating the Firebase project - everything else is copy/paste.

**Ready to proceed?** Start with step 1 (create Firebase project) and let me know when you have your configuration keys!
