#!/bin/bash

# Script to update all HTML pages with cookie consent

echo "Updating pages with cookie consent system..."

# Array of pages to update
pages=(
    "pages/administrative-investigations-dnd.html"
    "pages/caf-grievance-process.html"
    "pages/contact.html"
    "pages/for-analysts.html"
    "pages/frequently-asked-questions.html"
    "pages/grievance-writing-guide.html"
    "pages/how-to-file-grievance-caf.html"
    "pages/procedural-fairness-military.html"
)

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "Updating $page..."

        # Replace GA script with cookie consent CSS
        sed -i '' 's|<!-- Google tag (gtag.js) -->.*gtag('\''config'\'', '\''G-7MGBF86EHE'\'');.*</script>|<!-- Google Analytics will be loaded by cookie consent script -->\n    <!-- Cookie Consent CSS -->\n    <link rel="stylesheet" href="../css/cookie-consent.css">|s' "$page"

        # Add cookie consent script after main.css
        sed -i '' 's|<link rel="stylesheet" href="../css/main.css">|<link rel="stylesheet" href="../css/main.css">\n\n    <!-- Cookie Consent Script - Must load before GA -->\n    <script src="../js/cookie-consent.js"></script>|' "$page"

        echo "✓ Updated $page"
    else
        echo "✗ File not found: $page"
    fi
done

echo "All pages updated!"