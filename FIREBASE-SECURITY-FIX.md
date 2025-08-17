# URGENT: Firebase Security Fix Required

## Immediate Actions Taken
✅ **1. Removed exposed API key from contact.html** - The hardcoded Firebase configuration has been removed from the public repository.

## Actions You Must Take NOW

### 1. Regenerate the Firebase API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: `grievances-crm`
3. Navigate to **APIs & Services** > **Credentials**
4. Find the exposed API key: `AIzaSyC5igEYEBv3aiXvDxjrOu0khrWBWHnU6sM`
5. Click on it and either:
   - **DELETE** it and create a new one, OR
   - **RESTRICT** it (see restrictions below)

### 2. Create a New Restricted API Key
1. Click **+ CREATE CREDENTIALS** > **API key**
2. Immediately click **RESTRICT KEY**
3. Set these restrictions:
   - **Application restrictions**: HTTP referrers
   - Add these referrers:
     - `https://grievances.thechatbotgenius.com/*`
     - `http://localhost:8080/*` (for development)
   - **API restrictions**: Restrict to these APIs only:
     - Cloud Firestore API
     - Firebase Installations API
     - Identity Toolkit API

### 3. Secure Implementation Options

#### Option A: Server-Side Proxy (Most Secure)
Create a Firebase Cloud Function to handle form submissions without exposing any keys client-side.

#### Option B: Environment Variables with Build Process
Use a build tool to inject the config at build time (requires build pipeline).

#### Option C: Restricted Public Key (Acceptable for Firebase)
Use domain-restricted API keys as Firebase is designed for client-side usage with proper security rules.

## Temporary Solution Implemented
The contact form now shows a message directing users to email directly while the security configuration is updated.

## To Re-enable the Contact Form

### Step 1: Create firebase-config.js (DO NOT COMMIT)
```javascript
// firebase-config.js - ADD TO .gitignore!
const firebaseConfig = {
    apiKey: "YOUR-NEW-RESTRICTED-API-KEY",
    authDomain: "grievances-crm.firebaseapp.com",
    projectId: "grievances-crm",
    storageBucket: "grievances-crm.firebasestorage.app",
    messagingSenderId: "743994935319",
    appId: "1:743994935319:web:b73ba1dafcb2e604e27452"
};
```

### Step 2: Update contact.html
Replace the security message code with:
```javascript
// Load config from external file (ensure it's in .gitignore)
const script = document.createElement('script');
script.src = '/firebase-config.js';
script.onload = () => {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const analytics = firebase.analytics();
    // Rest of your form code...
};
document.head.appendChild(script);
```

### Step 3: Update .gitignore
Add these lines:
```
firebase-config.js
.env
.env.*
*-config.js
```

## Security Best Practices Going Forward

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive configuration
3. **Implement Firebase Security Rules** in Firestore console
4. **Restrict API keys** by domain and API
5. **Monitor usage** in Google Cloud Console
6. **Set up billing alerts** to detect unusual activity

## Additional Security Checks
- Review Firebase Security Rules in Firestore
- Enable App Check for additional security
- Review all files in the repository for other exposed secrets
- Consider using GitHub Secret Scanning

## References
- [Firebase Security Checklist](https://firebase.google.com/docs/projects/security-checklist)
- [Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys#restricting_api_keys)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

---
**Created**: 2025-08-17
**Issue**: Public API key exposed in GitHub repository
**Status**: Partially resolved - awaiting API key regeneration