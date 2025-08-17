// Firebase CRM Integration for Grievances Website
// Save this as: /js/firebase-crm.js

// Firebase configuration - REPLACE WITH YOUR CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase (using CDN version for simplicity)
// Add these script tags to your HTML:
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js"></script>

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = firebase.analytics();

// Lead Management Class
class GrievanceCRM {
    constructor() {
        this.db = db;
        this.analytics = analytics;
        this.collectionName = 'leads';
    }

    // Save new lead to Firestore
    async saveLead(formData) {
        try {
            // Add metadata
            const leadData = {
                ...formData,
                status: 'new',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                leadScore: this.calculateLeadScore(formData),
                tags: this.generateTags(formData),
                followUpDate: this.calculateFollowUpDate(formData),
                conversionValue: this.calculateValue(formData)
            };

            // Save to Firestore
            const docRef = await this.db.collection(this.collectionName).add(leadData);
            
            // Log analytics event
            this.analytics.logEvent('generate_lead', {
                currency: 'CAD',
                value: leadData.conversionValue,
                lead_type: formData.service,
                lead_source: formData.source || 'website'
            });

            // Track custom dimensions
            this.analytics.setUserProperties({
                grievance_stage: formData.stage || 'unknown',
                service_interest: formData.service
            });

            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error saving lead:', error);
            this.analytics.logEvent('exception', {
                description: 'lead_save_failed',
                fatal: false
            });
            throw error;
        }
    }

    // Calculate lead score based on engagement indicators
    calculateLeadScore(formData) {
        let score = 0;
        
        // Service interest scoring
        const serviceScores = {
            'grievance-consultation': 30,
            'writing-assistance': 25,
            'procedural-fairness': 20,
            'book-purchase': 15,
            'free-guide': 10,
            'general-inquiry': 5
        };
        score += serviceScores[formData.service] || 0;

        // Stage scoring (further in process = higher score)
        const stageScores = {
            'cfga': 25,
            'mgerc': 25,
            'final': 20,
            'initial': 15,
            'considering': 10,
            'completed': 5
        };
        score += stageScores[formData.stage] || 0;

        // Engagement indicators
        if (formData.phone) score += 10; // Provided phone = higher intent
        if (formData.message && formData.message.length > 100) score += 15; // Detailed message
        if (formData.source === 'cfga') score += 10; // Referral from CFGA

        return Math.min(score, 100); // Cap at 100
    }

    // Generate tags for segmentation
    generateTags(formData) {
        const tags = [];
        
        // Service tags
        if (formData.service) tags.push(`service:${formData.service}`);
        
        // Stage tags
        if (formData.stage) tags.push(`stage:${formData.stage}`);
        
        // Source tags
        if (formData.source) tags.push(`source:${formData.source}`);
        
        // Priority tags
        const score = this.calculateLeadScore(formData);
        if (score >= 70) tags.push('hot-lead');
        else if (score >= 40) tags.push('warm-lead');
        else tags.push('cold-lead');
        
        // Urgency tags
        if (formData.stage === 'cfga' || formData.stage === 'mgerc') {
            tags.push('urgent-followup');
        }
        
        return tags;
    }

    // Calculate follow-up date based on lead priority
    calculateFollowUpDate(formData) {
        const now = new Date();
        const score = this.calculateLeadScore(formData);
        
        let daysToAdd;
        if (score >= 70) daysToAdd = 1; // Hot leads: next day
        else if (score >= 40) daysToAdd = 3; // Warm leads: 3 days
        else daysToAdd = 7; // Cold leads: 1 week
        
        now.setDate(now.getDate() + daysToAdd);
        return now;
    }

    // Calculate potential value
    calculateValue(formData) {
        const values = {
            'grievance-consultation': 500, // Consultation fee estimate
            'writing-assistance': 300,
            'procedural-fairness': 400,
            'book-purchase': 39.99,
            'free-guide': 0,
            'general-inquiry': 100
        };
        return values[formData.service] || 0;
    }

    // Get leads with filters
    async getLeads(filters = {}) {
        let query = this.db.collection(this.collectionName);
        
        // Apply filters
        if (filters.status) {
            query = query.where('status', '==', filters.status);
        }
        if (filters.minScore) {
            query = query.where('leadScore', '>=', filters.minScore);
        }
        if (filters.service) {
            query = query.where('service', '==', filters.service);
        }
        if (filters.dateFrom) {
            query = query.where('createdAt', '>=', filters.dateFrom);
        }
        
        // Order by creation date
        query = query.orderBy('createdAt', 'desc');
        
        // Limit results
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        
        const snapshot = await query.get();
        const leads = [];
        snapshot.forEach(doc => {
            leads.push({ id: doc.id, ...doc.data() });
        });
        
        return leads;
    }

    // Update lead status
    async updateLeadStatus(leadId, newStatus, notes = '') {
        try {
            await this.db.collection(this.collectionName).doc(leadId).update({
                status: newStatus,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                statusHistory: firebase.firestore.FieldValue.arrayUnion({
                    status: newStatus,
                    timestamp: new Date(),
                    notes: notes
                })
            });
            
            // Track status change
            this.analytics.logEvent('lead_status_change', {
                lead_id: leadId,
                new_status: newStatus
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating lead:', error);
            throw error;
        }
    }

    // Add note to lead
    async addNote(leadId, note) {
        try {
            await this.db.collection(this.collectionName).doc(leadId).update({
                notes: firebase.firestore.FieldValue.arrayUnion({
                    text: note,
                    timestamp: new Date()
                }),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error adding note:', error);
            throw error;
        }
    }

    // Get analytics summary
    async getAnalytics(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const leads = await this.getLeads({ dateFrom: startDate });
        
        const analytics = {
            totalLeads: leads.length,
            byStatus: {},
            byService: {},
            bySource: {},
            averageScore: 0,
            totalValue: 0,
            conversionRate: 0
        };
        
        leads.forEach(lead => {
            // Count by status
            analytics.byStatus[lead.status] = (analytics.byStatus[lead.status] || 0) + 1;
            
            // Count by service
            analytics.byService[lead.service] = (analytics.byService[lead.service] || 0) + 1;
            
            // Count by source
            if (lead.source) {
                analytics.bySource[lead.source] = (analytics.bySource[lead.source] || 0) + 1;
            }
            
            // Sum scores and values
            analytics.averageScore += lead.leadScore || 0;
            analytics.totalValue += lead.conversionValue || 0;
        });
        
        // Calculate averages
        if (leads.length > 0) {
            analytics.averageScore = Math.round(analytics.averageScore / leads.length);
            analytics.conversionRate = Math.round(
                (analytics.byStatus['converted'] || 0) / leads.length * 100
            );
        }
        
        return analytics;
    }
}

// Initialize CRM
const grievanceCRM = new GrievanceCRM();

// Form handler
function initializeLeadForm() {
    const form = document.getElementById('leadCaptureForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('.form-submit');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        // Disable button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        
        // Collect form data
        const formData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: form.phone.value || null,
            service: form.service.value,
            stage: form.stage.value || null,
            message: form.message.value || null,
            source: form.source.value || null,
            consent: form.consent.checked,
            pageUrl: window.location.href,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent
        };
        
        try {
            // Save to Firebase
            const result = await grievanceCRM.saveLead(formData);
            
            // Show success
            successMessage.style.display = 'block';
            form.style.display = 'none';
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    'event_category': 'engagement',
                    'event_label': formData.service,
                    'value': grievanceCRM.calculateValue(formData)
                });
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            errorMessage.style.display = 'block';
            submitButton.disabled = false;
            submitButton.textContent = 'Get Your Free Guide & Support';
        }
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLeadForm);
} else {
    initializeLeadForm();
}

// Export for use in other scripts
window.GrievanceCRM = GrievanceCRM;
window.grievanceCRM = grievanceCRM;
