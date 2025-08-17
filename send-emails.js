// Simple email sender for new leads
// Run this locally: node send-emails.js

const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin (download service account key from Firebase Console)
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Set your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

async function sendWelcomeEmails() {
  const db = admin.firestore();
  
  // Get new leads that haven't been emailed
  const snapshot = await db.collection('leads')
    .where('emailSent', '!=', true)
    .get();
  
  if (snapshot.empty) {
    console.log('No new leads to email');
    return;
  }
  
  for (const doc of snapshot.docs) {
    const lead = doc.data();
    
    // Send welcome email
    const msg = {
      to: lead.email,
      from: 'jay@barkerhrs.com',
      subject: 'Your CAF Grievance Guide',
      text: `Hi ${lead.firstName}, Thank you for your interest...`,
      html: `<h2>Welcome ${lead.firstName}!</h2><p>Your free guide: <a href="https://grievances.thechatbotgenius.com/downloads/grievance-checklist.html">Download Here</a></p>`
    };
    
    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${lead.email}`);
      
      // Mark as sent
      await db.collection('leads').doc(doc.id).update({
        emailSent: true,
        emailSentAt: new Date()
      });
    } catch (error) {
      console.error(`Failed to email ${lead.email}:`, error);
    }
  }
}

sendWelcomeEmails();
