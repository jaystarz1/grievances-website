const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize SendGrid with environment variable
const sendgridKey = process.env.SENDGRID_API_KEY;
if (!sendgridKey) {
    console.warn('SENDGRID_API_KEY environment variable is not set - emails will not be sent');
} else {
    sgMail.setApiKey(sendgridKey);
}

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'jay@barkerhrs.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'jay@barkerhrs.com';

// Email templates
const emailTemplates = {
    welcome: {
        subject: 'Your CAF Grievance Guide & Resources',
        generateHtml: (lead) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Georgia, serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6B4C8A 0%, #9B7AAD 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: #6B4C8A; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        h1 { margin: 0; font-size: 28px; }
        h2 { color: #6B4C8A; }
        .benefits { background: #f8f9fa; padding: 20px; border-left: 4px solid #6B4C8A; margin: 20px 0; }
        .benefits li { margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to An Airing of Grievances</h1>
            <p>Your Guide to the CAF Grievance System</p>
        </div>
        
        <div class="content">
            <h2>Hello ${lead.firstName},</h2>
            
            <p>Thank you for your interest in navigating the Canadian Armed Forces grievance system more effectively. As a former CFGA analyst with 5 years of experience, I understand the challenges you're facing.</p>
            
            <div class="benefits">
                <h3>Your Free Resources:</h3>
                <ul>
                    <li><strong>CAF Grievance Checklist</strong> - Ensure you don't miss critical steps</li>
                    <li><strong>Timeline Template</strong> - Track important dates and deadlines</li>
                    <li><strong>Common Mistakes Guide</strong> - Avoid the pitfalls I've seen hundreds make</li>
                </ul>
            </div>
            
            <p><strong>Download your free resources here:</strong></p>
            <a href="https://grievances.thechatbotgenius.com/downloads/grievance-checklist.html" class="button">Download Grievance Checklist</a>
            
            ${lead.service === 'grievance-consultation' ? `
            <h3>About Your Consultation Request</h3>
            <p>I've received your request for a grievance consultation. I'll review your situation and respond within 24 hours with:</p>
            <ul>
                <li>Initial assessment of your case</li>
                <li>Recommended next steps</li>
                <li>Available consultation times</li>
            </ul>
            ` : ''}
            
            ${lead.stage && lead.stage !== '' ? `
            <h3>Regarding Your ${getStageText(lead.stage)} Stage</h3>
            <p>${getStageAdvice(lead.stage)}</p>
            ` : ''}
            
            <h3>Get the Complete Guide</h3>
            <p>While these free resources will help you get started, my book "An Airing of Grievances" provides comprehensive coverage of:</p>
            <ul>
                <li>The complete grievance process from start to finish</li>
                <li>How to write compelling contentions using CRAF methodology</li>
                <li>Understanding procedural fairness and natural justice</li>
                <li>Dealing with difficult situations and decision-makers</li>
                <li>Real examples from my 5 years at CFGA</li>
            </ul>
            
            <a href="https://www.amazon.ca/Airing-Grievances-Unofficial-Grievance-Management/dp/B0FHBCLSL9" class="button">Get the Book on Amazon - $34.97</a>
            
            <h3>Stay Connected</h3>
            <p>I'll send you occasional updates about:</p>
            <ul>
                <li>Policy changes affecting CAF grievances</li>
                <li>New resources and guides</li>
                <li>Tips from recent cases</li>
            </ul>
            
            <p>If you have any immediate questions, feel free to reply to this email.</p>
            
            <p>Best regards,<br>
            <strong>Jay Tarzwell</strong><br>
            Former CFGA Analyst<br>
            Author, An Airing of Grievances</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Jay Tarzwell | <a href="https://grievances.thechatbotgenius.com">grievances.thechatbotgenius.com</a></p>
            <p>This is an unofficial guide. Always consult official sources for current policies.</p>
            <p><a href="https://grievances.thechatbotgenius.com/unsubscribe">Unsubscribe</a> | <a href="https://grievances.thechatbotgenius.com/privacy">Privacy Policy</a></p>
        </div>
    </div>
</body>
</html>
        `,
        generateText: (lead) => `
Hello ${lead.firstName},

Thank you for your interest in navigating the Canadian Armed Forces grievance system more effectively.

Your Free Resources:
- CAF Grievance Checklist
- Timeline Template  
- Common Mistakes Guide

Download here: https://grievances.thechatbotgenius.com/downloads/grievance-checklist.html

${lead.service === 'grievance-consultation' ? 
`About Your Consultation Request:
I'll review your situation and respond within 24 hours with an initial assessment and available consultation times.` : ''}

Get the Complete Guide:
My book "An Airing of Grievances" provides comprehensive coverage of the entire grievance process.
Available on Amazon: https://www.amazon.ca/Airing-Grievances-Unofficial-Grievance-Management/dp/B0FHBCLSL9

Best regards,
Jay Tarzwell
Former CFGA Analyst
        `
    },
    
    notification: {
        subject: 'New Lead: {firstName} {lastName} - {service}',
        generateHtml: (lead) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 20px; }
        .header { background: #6B4C8A; color: white; padding: 20px; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #6B4C8A; }
        .priority-hot { color: #ff4444; font-weight: bold; }
        .priority-warm { color: #ff9944; font-weight: bold; }
        .priority-cold { color: #4444ff; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Lead Received</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Name:</span> ${lead.firstName} ${lead.lastName}
            </div>
            <div class="field">
                <span class="label">Email:</span> <a href="mailto:${lead.email}">${lead.email}</a>
            </div>
            <div class="field">
                <span class="label">Phone:</span> ${lead.phone || 'Not provided'}
            </div>
            <div class="field">
                <span class="label">Service:</span> ${lead.service}
            </div>
            <div class="field">
                <span class="label">Stage:</span> ${lead.stage || 'Not specified'}
            </div>
            <div class="field">
                <span class="label">Lead Score:</span> ${lead.leadScore}/100
            </div>
            <div class="field">
                <span class="label">Priority:</span> 
                <span class="priority-${lead.priority}">${lead.priority.toUpperCase()}</span>
            </div>
            <div class="field">
                <span class="label">Source:</span> ${lead.source || 'Direct'}
            </div>
            <div class="field">
                <span class="label">Message:</span><br>
                ${lead.message || 'No message provided'}
            </div>
            <div class="field">
                <span class="label">Submitted:</span> ${new Date().toLocaleString('en-CA')}
            </div>
            <hr>
            <p><strong>Action Required:</strong></p>
            <ul>
                ${lead.priority === 'hot' ? '<li>HIGH PRIORITY - Follow up within 24 hours</li>' : ''}
                ${lead.priority === 'warm' ? '<li>Follow up within 3 days</li>' : ''}
                ${lead.priority === 'cold' ? '<li>Follow up within 1 week</li>' : ''}
                ${lead.service === 'grievance-consultation' ? '<li>Review case details and prepare consultation proposal</li>' : ''}
                ${lead.service === 'writing-assistance' ? '<li>Prepare writing assistance package information</li>' : ''}
            </ul>
        </div>
    </div>
</body>
</html>
        `
    }
};

// Helper functions
function getStageText(stage) {
    const stages = {
        'considering': 'Considering Filing',
        'initial': 'Initial Authority',
        'final': 'Final Authority',
        'cfga': 'CFGA Review',
        'mgerc': 'MGERC/External Review',
        'completed': 'Completed Grievance'
    };
    return stages[stage] || stage;
}

function getStageAdvice(stage) {
    const advice = {
        'considering': 'The decision to file a grievance is important. Ensure you have clear grounds and understand the 90-day time limit from when you knew or ought to have known about the decision affecting you.',
        'initial': 'At the Initial Authority stage, focus on clear, concise contentions supported by evidence. This is your opportunity to present your case comprehensively.',
        'final': 'The Final Authority stage is typically your last internal review. Ensure all evidence is submitted and consider seeking legal advice if not already obtained.',
        'cfga': 'CFGA review ensures procedural fairness. They will examine whether proper procedures were followed and may recommend remedies.',
        'mgerc': 'External review by MGERC provides independent assessment. Their recommendations carry significant weight with the Final Authority.',
        'completed': 'Even after completion, you may have options including judicial review if procedural fairness was violated.'
    };
    return advice[stage] || 'Each stage of the grievance process has unique requirements and opportunities.';
}

// Cloud Function: Send welcome email when new lead is created
exports.processNewLead = functions.firestore.onDocumentCreated(
    'leads/{leadId}',
    async (event) => {
        const lead = event.data.data();
        const leadId = event.params.leadId;
        
        // Skip if no SendGrid key
        if (!sendgridKey) {
            console.log('Skipping email - no SendGrid API key configured');
            return null;
        }
        
        try {
            // Send welcome email to lead
            const welcomeMsg = {
                to: lead.email,
                from: {
                    email: SENDER_EMAIL,
                    name: 'Jay Tarzwell - An Airing of Grievances'
                },
                subject: emailTemplates.welcome.subject,
                text: emailTemplates.welcome.generateText(lead),
                html: emailTemplates.welcome.generateHtml(lead),
                trackingSettings: {
                    clickTracking: { enable: true },
                    openTracking: { enable: true }
                }
            };
            
            await sgMail.send(welcomeMsg);
            console.log(`Welcome email sent to ${lead.email}`);
            
            // Send notification email to Jay
            const notificationMsg = {
                to: NOTIFICATION_EMAIL,
                from: {
                    email: SENDER_EMAIL,
                    name: 'Grievances CRM'
                },
                subject: emailTemplates.notification.subject
                    .replace('{firstName}', lead.firstName)
                    .replace('{lastName}', lead.lastName)
                    .replace('{service}', lead.service),
                html: emailTemplates.notification.generateHtml(lead)
            };
            
            await sgMail.send(notificationMsg);
            console.log(`Notification email sent for lead ${leadId}`);
            
            // Update lead status
            await admin.firestore().collection('leads').doc(leadId).update({
                emailSent: true,
                emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });
            
        } catch (error) {
            console.error('Error sending emails:', error);
            
            // Log error to lead document
            await admin.firestore().collection('leads').doc(leadId).update({
                emailError: error.message,
                emailErrorAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    }
);
