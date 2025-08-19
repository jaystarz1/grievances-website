# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**An Airing of Grievances Website** - A comprehensive website for the book about Canadian Armed Forces grievance management, featuring Firebase backend with CRM functionality and SEO-optimized content pages.

## Core Technologies

- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Backend**: Firebase Functions (Node.js 22)
- **Database**: Firebase Firestore
- **Email**: SendGrid API
- **Hosting**: Static files served locally, Firebase Functions for backend
- **Design**: Custom purple theme (#6B4C8A primary) matching book cover

## Essential Commands

### Development Server
```bash
# Serve static website locally
python3 -m http.server 8080

# Firebase functions development
cd functions && npm run serve  # Start Firebase emulators
cd functions && npm run shell  # Interactive Firebase shell
```

### Deployment
```bash
# Deploy Firebase functions
cd functions && npm run deploy

# View function logs
cd functions && npm run logs
```

### Image Optimization
```bash
# Run image optimization script (requires ImageMagick)
./optimize-images.sh
```

## Project Architecture

### Directory Structure
- `/pages/` - Content pages (grievance guides, procedural fairness, etc.)
- `/css/main.css` - Single CSS file with purple mountain theme
- `/js/main.js` - Frontend JavaScript (smooth scrolling, mobile menu, form handling)
- `/functions/` - Firebase Cloud Functions for backend operations
- `/images/` - Book covers and author photos

### Key Features
1. **Contact Form with CRM** - Firestore database stores leads, SendGrid sends emails
2. **SEO Optimization** - Schema.org markup, meta tags, sitemap.xml
3. **Legal Research Tool Integration** - Links to CanLII search tool at canliisearch.thechatbotgenius.com
4. **Multi-format Book Sales** - Amazon links for paperback, ebook, audiobook

### Content Pages Status
- ✅ `caf-grievance-process.html` - Complete
- ✅ `how-to-file-grievance-caf.html` - Complete  
- ✅ `procedural-fairness-military.html` - Complete
- ✅ `frequently-asked-questions.html` - Complete
- ✅ `administrative-investigations-dnd.html` - Complete
- ✅ `grievance-writing-guide.html` - Complete
- ✅ `contact.html` - Complete with Firebase CRM
- ✅ `for-analysts.html` - Complete

## Firebase Configuration

### Functions Setup
- **Contact Form Handler** (`/functions/index.js`)
  - Stores submissions in Firestore collection `contactSubmissions`
  - Sends email notifications via SendGrid
  - CORS enabled for local development

### Environment Variables (functions/.env)
```
SENDGRID_API_KEY=your_key_here
ADMIN_EMAIL=admin@example.com
SENDER_EMAIL=noreply@example.com
```

## Bilingual Support (Google Translate)

### Implementation
All main pages include Google Translate widget configured for EN/FR only to serve the bilingual Canadian Armed Forces audience.

### Adding to New Pages
When creating new pages, include the following before `</head>`:

```html
<!-- Google Translate Widget -->
<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,fr',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false,
    gaTrack: true,
    gaId: 'G-7MGBF86EHE'
  }, 'google_translate_element');
}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```

And in the header after nav-logo:

```html
<!-- Custom Language Toggle -->
<div class="language-toggle-wrapper">
    <div id="google_translate_element" style="display:none;"></div>
    <button class="lang-toggle-btn" onclick="changeLanguage('en')">
        <span class="lang-flag">🇨🇦</span> EN
    </button>
    <button class="lang-toggle-btn" onclick="changeLanguage('fr')">
        <span class="lang-flag">🇫🇷</span> FR
    </button>
</div>
```

### Multilingual SEO
Add these meta tags for French SEO:

```html
<!-- Multilingual SEO -->
<link rel="alternate" hreflang="en" href="https://grievances.thechatbotgenius.com/[page-path]" />
<link rel="alternate" hreflang="fr" href="https://grievances.thechatbotgenius.com/[page-path]#googtrans(fr)" />
<meta property="og:locale:alternate" content="fr_CA" />
```

### Testing Translation
1. Click FR button to translate to French
2. Click EN to return to English
3. Check that preference persists on page reload (stored in localStorage)
4. Verify Google Analytics tracks language changes (event: language_change)

### Notes
- ~25% of CAF members are francophone - critical for reach
- Google Translate provides instant translation at zero cost
- Future upgrade path: Weglot or professional translation if >20% use French
- Language preference is saved in localStorage for better UX

## Important Conventions

### CSS Classes
- Use existing classes from `/css/main.css`
- Purple color scheme: `--primary-purple: #6B4C8A`
- Grid system: `.grid`, `.grid-2`, `.grid-3`
- Cards: `.card`, `.card-header`, `.card-body`
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`

### SEO Requirements
- Every page needs proper meta tags and Schema.org markup
- Update `sitemap.xml` when adding new pages
- Use Canadian English spelling (honour, defence)
- Include Amazon book links on every page

### Content Guidelines
- Target 2000+ words for main content pages
- Reference Canadian regulations (NDA, QR&O, DAODs)
- Include disclaimers about unofficial nature
- Focus on practical, actionable information

## Testing Checklist
- Mobile responsiveness (all breakpoints)
- Form submissions to Firebase
- Email delivery via SendGrid
- SEO meta tags present
- Schema markup validates
- Internal links work
- External links open in new tabs
- Images optimized and lazy loaded

## External Resources
- **Book on Amazon**: https://www.amazon.ca/Airing-Grievances-Unofficial-Grievance-Management/dp/B0FHBCLSL9
- **MGERC Case Database**: https://www.canada.ca/en/military-grievances-external-review/services/case-summaries.html
- **Author's Main Site**: https://thechatbotgenius.com
- **Legal Search Tool**: https://canliisearch.thechatbotgenius.com/