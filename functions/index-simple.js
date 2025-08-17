const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Simple function to log new leads
exports.onNewLead = functions.firestore.onDocumentCreated(
    'leads/{leadId}',
    async (event) => {
        const lead = event.data.data();
        const leadId = event.params.leadId;
        
        console.log('New lead received:', {
            id: leadId,
            name: `${lead.firstName} ${lead.lastName}`,
            email: lead.email,
            service: lead.service,
            priority: lead.priority,
            score: lead.leadScore
        });
        
        // Update lead with processing timestamp
        try {
            await admin.firestore().collection('leads').doc(leadId).update({
                processed: true,
                processedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('Lead marked as processed');
        } catch (error) {
            console.error('Error updating lead:', error);
        }
        
        return null;
    }
);
