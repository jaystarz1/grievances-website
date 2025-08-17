# SendGrid Email Automation Setup

## 🚀 Quick Setup (10 minutes)

### Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Functions in your project
```bash
cd /Users/jaytarzwell/Grievance Website
firebase init functions

# Select:
# - Use an existing project
# - Select: grievances-crm
# - JavaScript
# - No to ESLint
# - Yes to install dependencies
```

### Step 4: Set your SendGrid API Key
```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

To get your SendGrid API key:
1. Login to SendGrid
2. Go to Settings → API Keys
3. Create a new API key with "Full Access"
4. Copy the key (starts with SG.)

### Step 5: Deploy the Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 📧 What These Functions Do

### 1. **Automatic Welcome Email** (`onNewLead`)
- Triggers instantly when someone submits the form
- Sends professional welcome email with:
  - Free resource downloads
  - Personalized advice based on their stage
  - Book promotion
  - Next steps
- Also sends you a notification with lead details
- Priority flagging (HOT/WARM/COLD)

### 2. **Daily Summary** (`dailyLeadSummary`)
- Runs every morning at 9 AM EST
- Emails you a summary of all leads from last 24 hours
- Includes priority and scores

### 3. **Follow-Up Reminders** (`followUpReminder`)
- Runs every morning at 8 AM EST
- Reminds you which leads need follow-up today
- Based on automatic scheduling:
  - Hot leads: Day after submission
  - Warm leads: 3 days after
  - Cold leads: 7 days after

## 📝 Email Templates Included

### Welcome Email Features:
- Professional HTML design matching your purple theme
- Personalized greeting with first name
- Service-specific content
- Stage-specific advice
- Download links for free resources
- Book promotion with Amazon link
- Unsubscribe link (SendGrid handles this)

### Notification Email Features:
- All lead details
- Priority highlighting
- Action items based on service type
- Direct mailto link

## 🎨 Customizing Templates

To modify email templates, edit `/functions/index.js`:

1. **Change welcome email**: Edit `emailTemplates.welcome.generateHtml()`
2. **Change notification**: Edit `emailTemplates.notification.generateHtml()`
3. **Add new templates**: Add to `emailTemplates` object

After changes, redeploy:
```bash
firebase deploy --only functions
```

## 🔧 Testing

### Test Individual Functions:
```bash
# Test welcome email
firebase functions:shell
> onNewLead({firstName: 'Test', lastName: 'User', email: 'test@example.com', service: 'grievance-consultation', priority: 'hot', leadScore: 85})

# Exit with Ctrl+C
```

### Check Function Logs:
```bash
firebase functions:log
```

## 📊 SendGrid Features You Get

With SendGrid integration:
- **Delivery tracking**: See if emails were delivered
- **Open tracking**: Know when emails are opened
- **Click tracking**: Track link clicks
- **Unsubscribe management**: Automatic handling
- **Spam compliance**: CAN-SPAM compliant
- **Analytics**: Full email analytics dashboard

## 🛠 Troubleshooting

### Function not triggering?
- Check Firebase Console → Functions for errors
- Verify SendGrid API key is set: `firebase functions:config:get`

### Emails not sending?
- Check SendGrid dashboard for bounces/blocks
- Verify jay@barkerhrs.com is a verified sender in SendGrid
- Check function logs: `firebase functions:log`

### Want to change sender email?
In SendGrid:
1. Go to Settings → Sender Authentication
2. Verify your domain or single sender
3. Update the `from` field in functions

## 🎯 Next Steps

1. **Set up SendGrid API key** (most important)
2. **Deploy functions**
3. **Test with a real form submission**
4. **Check SendGrid dashboard** for email analytics

## 💡 Advanced Features Available

I can add:
- **Drip campaigns**: Automated email sequences
- **Lead nurturing**: Different paths based on service type
- **A/B testing**: Test different email versions
- **Calendar integration**: Auto-schedule consultations
- **SMS notifications**: Via Twilio (you might have this too?)

## 📈 ROI Tracking

The system automatically tracks:
- Lead source (where they came from)
- Service value (potential revenue)
- Conversion tracking (via Analytics)
- Email engagement (via SendGrid)

You'll be able to see:
- Which sources bring the best leads
- Email open/click rates
- Conversion from lead to client
- ROI on your marketing efforts

Ready to deploy? Just need your SendGrid API key!
