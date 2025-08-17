# SEO Audit Action Plan - grievances.netlify.app
**Date:** August 17, 2025  
**Auditor:** SEO Analysis System

## 🚨 WEEK 1: Critical Fixes (Do Immediately)

### Day 1-2: Fix Domain Issues
- [ ] **Decision Required**: Choose final domain strategy
  - Option A: Keep netlify.app and update all references
  - Option B: Set up custom domain grievances.thechatbotgenius.com
- [ ] Update all meta tags, canonical URLs, and sitemap.xml to match chosen domain
- [ ] Set up 301 redirects if changing domains

### Day 3-4: Image Optimization Emergency
```bash
# Install image optimization tools
npm install -g imagemin-cli imagemin-webp

# Compress existing images
imagemin images/* --out-dir=images/optimized

# Convert to WebP
imagemin images/* --plugin=webp --out-dir=images/webp
```
- [ ] Compress book-cover-ebook.jpg to <200KB
- [ ] Compress book-cover-paperback-spread.jpg to <200KB  
- [ ] Compress book-photo-author.jpg to <150KB
- [ ] Update HTML to use optimized images
- [ ] Implement lazy loading: `loading="lazy"`

### Day 5: Analytics Setup
- [ ] Create Google Analytics 4 property
- [ ] Add GA4 tracking code to all pages
- [ ] Set up conversion tracking for:
  - Book purchase clicks
  - Contact form submissions
  - Download requests
- [ ] Install Google Search Console
- [ ] Submit sitemap to Search Console

## 📈 WEEK 2: High Priority Improvements

### Update Sitemap & Navigation
- [ ] Add missing pages to sitemap.xml:
  - /pages/for-analysts.html
  - /pages/about-book.html (if exists)
  - /pages/resources.html (if exists)
- [ ] Update sitemap lastmod dates
- [ ] Resubmit to Google Search Console

### Fix Meta & Schema Issues
- [ ] Fix broken image references in meta tags
- [ ] Add FAQ schema to frequently-asked-questions.html
- [ ] Add breadcrumb schema to all pages
- [ ] Add author bio schema

### Performance Optimization
- [ ] Minify CSS (current: 13.4KB → target: <10KB)
- [ ] Minify JavaScript files
- [ ] Enable Netlify asset optimization
- [ ] Add preconnect for external resources:
```html
<link rel="preconnect" href="https://www.amazon.ca">
<link rel="dns-prefetch" href="https://www.canada.ca">
```

## 🎯 WEEK 3-4: Growth Optimizations

### Content Improvements
- [ ] Add internal links (minimum 3 per page)
- [ ] Create link-worthy resources:
  - Grievance timeline calculator
  - CFGA case search tool
  - Downloadable templates
- [ ] Add "Last Updated" dates to all pages
- [ ] Create blog section for ongoing content

### Technical Enhancements
- [ ] Implement structured data testing
- [ ] Add AMP versions for mobile
- [ ] Create PWA manifest for offline access
- [ ] Add site search functionality

### Link Building Campaign
- [ ] Submit to directories:
  - Canadian military resource sites
  - Legal directories
  - Government resource listings
- [ ] Outreach for backlinks:
  - Military blogs
  - Legal aid organizations
  - Veterans associations

## 📊 Monitoring Metrics

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms  
- **CLS** (Cumulative Layout Shift): <0.1

### SEO KPIs to Track
- Organic traffic growth
- Keyword rankings for:
  - "CAF grievance process"
  - "file grievance Canadian Forces"
  - "CFGA"
  - "military grievance Canada"
- Conversion rate (book purchases)
- Bounce rate (<40%)
- Average session duration (>2 min)

## 🛠️ Tools & Resources

### Testing Tools
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Monitoring Tools
- Google Search Console
- Google Analytics 4
- Netlify Analytics
- UptimeRobot (for monitoring)

## 💡 Quick Wins Checklist

### Can Do Right Now (15 min each):
- [ ] Compress images online at [TinyPNG](https://tinypng.com/)
- [ ] Add Google Analytics code
- [ ] Fix meta image references
- [ ] Update sitemap.xml
- [ ] Submit site to Google Search Console
- [ ] Add alt text to images
- [ ] Test mobile responsiveness
- [ ] Check all internal links

## 📝 Notes

### Domain Strategy Recommendation
**Strongly recommend**: Use the custom domain `grievances.thechatbotgenius.com` for better branding and SEO authority. Netlify makes this easy with their DNS settings.

### Image Optimization Priority
Current 34MB of images is killing your site performance. This should be your #1 priority after domain issues.

### Content Opportunities
Your content quality is excellent. Focus on technical improvements first, then expand content with:
- Case studies
- Monthly grievance tips
- Video content
- Interactive tools

---

**Next Review Date:** September 17, 2025

**Questions?** Review this plan weekly and track progress. Focus on Critical Fixes first!
