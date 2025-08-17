# An Airing of Grievances - Website Project

## 📁 Project Location
**Root Directory:** `/Users/jaytarzwell/Grievance Website/`

## 🛠 Development Setup for AI Assistants

### IMPORTANT: Development Instructions
When working on this project, AI assistants should:
1. **Use the filesystem MCP** to read, write, and edit files directly in `/Users/jaytarzwell/Grievance Website/`
2. **Use the git MCP** for version control operations
3. **Never ask the user to manually edit files** - make all changes directly using MCP tools
4. **Test changes** by instructing user to open `index.html` in browser or run `python3 -m http.server 8080`

### Project Structure
```
/Users/jaytarzwell/Grievance Website/
├── README.md (this file)
├── index.html (landing page - COMPLETED)
├── css/
│   └── main.css (purple theme from book cover - COMPLETED)
├── js/
│   └── main.js (interactivity - COMPLETED)
├── pages/
│   ├── caf-grievance-process.html (COMPLETED)
│   ├── how-to-file-grievance-caf.html (COMPLETED)
│   └── [other pages TO BE CREATED - see below]
├── images/ (empty - needs book cover and author photo)
├── downloads/ (empty - needs PDF resources)
├── robots.txt (COMPLETED)
├── sitemap.xml (COMPLETED)
└── .gitignore (COMPLETED)
```

## Project Overview
A comprehensive website for the book "An Airing of Grievances: The Unofficial Guide to Grievance Management in the Canadian Armed Forces" by Jay Tarzwell.

### Key Information
- **Subdomain:** `grievances.thechatbotgenius.com`
- **Amazon Link:** https://www.amazon.ca/Airing-Grievances-Unofficial-Grievance-Management/dp/B0FHBCLSL9
- **Book Price:** $39.99 CAD
- **Target Audience:** CAF members, grievance analysts, HR professionals, military administrators

### Color Scheme (from book cover)
- Primary Purple: #6B4C8A
- Secondary Purple: #9B7AAD
- Accent Pink: #C77DA2
- Dark Purple: #3D2951
- Light Purple: #E8D5F2

## ✅ COMPLETED WORK

### Phase 1: Foundation (DONE)
- [x] Complete folder structure created
- [x] Custom CSS with purple mountain theme from book cover
- [x] Fully responsive landing page with SEO optimization
- [x] JavaScript for smooth scrolling, mobile menu, animations
- [x] robots.txt and sitemap.xml for search engines
- [x] Amazon purchase links integrated throughout
- [x] Schema.org markup for book and website

### Phase 2: Core Content (PARTIAL)
- [x] **CAF Grievance Process Guide** - 3000+ word comprehensive guide
- [x] **How to File a Grievance CAF** - Step-by-step instructions with templates
- [ ] Procedural Fairness page - NEXT PRIORITY
- [ ] FAQ page - HIGH PRIORITY

## 🚧 REMAINING DEVELOPMENT WORK

### High Priority Pages (Create Next)

#### 1. Procedural Fairness & Natural Justice (`/pages/procedural-fairness-military.html`)
**SEO Target:** "procedural fairness military", "natural justice Canada"
**Content Required:**
- Define natural justice in military context
- Four pillars: right to be heard, unbiased decision-maker, disclosure, reasons
- Case law examples (Baker v. Canada)
- Common violations and remedies
- De novo review process
- 2500-3000 words
- FAQ schema for common questions

#### 2. FAQ Page (`/pages/frequently-asked-questions.html`)
**SEO Target:** Long-tail question queries
**Content Required:**
- 20-30 common questions with detailed answers
- FAQ schema markup for featured snippets
- Categories: Filing, Process, Rights, Timelines, Outcomes
- Accordion-style interactive design
- Each answer 150-300 words

#### 3. Digital Grievance Form 2024 (`/pages/digital-grievance-form-caf.html`)
**SEO Target:** "digital grievance form CAF", "2024 CAF grievance submission"
**Content Required:**
- Step-by-step form completion guide
- Screenshots/visual guides for each section
- Common errors and solutions
- System requirements
- Troubleshooting section
- 2000-2500 words

### Medium Priority Pages

#### 4. CFGA Resources (`/pages/canadian-forces-grievance-authority.html`)
**SEO Target:** "Canadian Forces Grievance Authority", "CFGA"
**Content Required:**
- CFGA mandate and structure
- How CFGA helps grievors
- Contact info and helpline (1-866-474-3867)
- National Grievance Registry explanation
- 1500-2000 words

#### 5. MGERC Review (`/pages/mgerc-grievance-review.html`)
**SEO Target:** "MGERC", "Military Grievances External Review Committee"
**Content Required:**
- What triggers MGERC review
- Review process and timeline
- How to prepare for MGERC
- Understanding recommendations
- Case summaries
- 2000 words

#### 6. Administrative Investigations (`/pages/administrative-investigations-dnd.html`)
**SEO Target:** "administrative investigations DND"
**Content Required:**
- Difference between grievance and AI
- When to use which process
- Types of investigations
- Rights during investigation
- 1500-2000 words

#### 7. Grievance Writing Guide (`/pages/grievance-writing-guide.html`)
**SEO Target:** "grievance writing CAF", "CRAF methodology"
**Content Required:**
- CRAF methodology detailed
- Writing clear contentions
- Citing regulations
- Sample analyses
- 2500 words

### Low Priority Pages

#### 8. About the Book (`/pages/about-book.html`)
- Detailed table of contents
- Sample chapter
- Reviews/testimonials
- Author background
- Multiple Amazon CTAs

#### 9. Resources & Downloads (`/pages/resources.html`)
- PDF downloads (behind email gate)
- Grievance checklist
- Timeline template
- Glossary
- Quick reference guides

## 📋 Technical Requirements for Each New Page

### SEO Checklist (Per Page)
- [ ] Primary keyword in title, H1, first paragraph
- [ ] Meta description under 160 characters
- [ ] Schema markup (Article or FAQ)
- [ ] Internal links to 3+ related pages
- [ ] External links to Canada.ca sources
- [ ] Canonical URL
- [ ] Open Graph tags
- [ ] Mobile responsive
- [ ] Canadian English spelling

### Content Structure
- Clear H2/H3 hierarchy
- Short paragraphs (3-4 sentences)
- Bullet points for scanability
- Call-out boxes for important info
- Related resources section
- CTA to book and free resources

## 🚀 Deployment Plan

### Next Steps for Development
1. **Create remaining pages** using filesystem MCP
2. **Add images:**
   - Book cover → `/images/book-cover.jpg`
   - Author photo → `/images/author.jpg`
3. **Create PDF downloads:**
   - Grievance checklist
   - Timeline template
4. **Set up GitHub repository** using git MCP
5. **Deploy to GitHub Pages**
6. **Configure custom domain**

### GitHub Deployment Commands
```bash
cd /Users/jaytarzwell/Grievance Website
git init
git add .
git commit -m "Initial commit - An Airing of Grievances website"
git branch -M main
git remote add origin [github-repo-url]
git push -u origin main
```

### Post-Launch Tasks
- [ ] Google Analytics 4 setup
- [ ] Google Search Console verification
- [ ] Submit sitemap
- [ ] Formspree integration for email capture
- [ ] Monitor Core Web Vitals
- [ ] A/B testing on CTAs

## 🎯 Success Metrics
- Organic search traffic for CAF grievance keywords
- Email list signups
- Book sales attribution from website
- Time on site > 2 minutes
- Bounce rate < 40%
- Page speed score > 90

## 📝 Notes for AI Developers

### When Creating New Pages:
1. Use the existing CSS classes from `/css/main.css`
2. Copy the header/footer structure from existing pages
3. Maintain the purple color scheme throughout
4. Include Amazon purchase links on every page
5. Add new pages to sitemap.xml
6. Update internal navigation links
7. Test mobile responsiveness

### Content Guidelines:
- Write in Canadian English (honour, defence, etc.)
- Reference Canadian laws (NDA, QR&O, DAODs)
- Use CAF-specific terminology
- Include disclaimers about unofficial nature
- Target 2000+ words for main content pages
- Focus on practical, actionable information

### Quality Standards:
- PageSpeed score 90+
- WCAG 2.1 AA accessibility
- Valid HTML5 and CSS3
- Cross-browser compatible
- SEO-optimized meta tags
- Structured data markup

## 🤖 AI Assistant Instructions

When asked to work on this project:
1. **Navigate to:** `/Users/jaytarzwell/Grievance Website/`
2. **Use filesystem MCP** to read/write/edit files
3. **Use git MCP** for version control
4. **Create pages** following the templates in existing HTML files
5. **Maintain consistency** with design and structure
6. **Test locally** using `python3 -m http.server 8080`
7. **Update README** when completing tasks

### Example Workflow for New Page:
```python
# 1. Read an existing page as template
content = read_file("/Users/jaytarzwell/Grievance Website/pages/caf-grievance-process.html")

# 2. Create new page with updated content
write_file("/Users/jaytarzwell/Grievance Website/pages/procedural-fairness-military.html", new_content)

# 3. Update sitemap.xml
edit_file("/Users/jaytarzwell/Grievance Website/sitemap.xml", add_new_url)

# 4. Test locally
print("Run: cd /Users/jaytarzwell/Grievance Website && python3 -m http.server 8080")
```

---

**Last Updated:** December 2024
**Author:** Jay Tarzwell
**Website:** https://thechatbotgenius.com
**Book:** https://www.amazon.ca/Airing-Grievances-Unofficial-Grievance-Management/dp/B0FHBCLSL9
