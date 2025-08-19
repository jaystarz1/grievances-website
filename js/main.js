// Main JavaScript for An Airing of Grievances Website

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Newsletter form handling
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        // Here you would normally send the email to your backend
        // For now, we'll just show a success message
        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        
        // Clear the form
        this.reset();
    });
}

// Mobile menu toggle (if needed)
function createMobileMenu() {
    const nav = document.querySelector('.nav');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.style.display = 'none';
    
    // Style for mobile menu button
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--primary-purple);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block !important;
            }
            
            .nav-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: white;
                box-shadow: var(--shadow-md);
                padding: var(--spacing-md);
            }
            
            .nav-menu.active {
                display: flex;
            }
        }
    `;
    document.head.appendChild(style);
    
    nav.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Initialize mobile menu
createMobileMenu();

// Dropdown navigation functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Click handler for toggle
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.querySelector('.dropdown-menu').classList.remove('active');
                    }
                });
                
                // Toggle this dropdown
                menu.classList.toggle('active');
            });
            
            // Hover handlers for desktop
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    menu.classList.add('active');
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    menu.classList.remove('active');
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
}

// Initialize dropdowns on page load
document.addEventListener('DOMContentLoaded', initDropdowns);

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Download tracking (for analytics)
document.querySelectorAll('a[href^="#download"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Track download intent (you would send this to analytics)
        const resource = this.getAttribute('href').replace('#download-', '');
        console.log(`Download requested: ${resource}`);
        
        // Show email capture modal (simplified version)
        const email = prompt('Please enter your email to download the free resource:');
        
        if (email && validateEmail(email)) {
            alert(`Thank you! The ${resource} will be sent to ${email}`);
            // Here you would trigger the actual download
        } else if (email) {
            alert('Please enter a valid email address.');
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (this.getAttribute('href')?.startsWith('http')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        }
    });
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console easter egg for developers
console.log('%c🍁 An Airing of Grievances', 'color: #6B4C8A; font-size: 24px; font-weight: bold;');
console.log('%cHelping CAF members navigate the grievance process with confidence.', 'color: #9B7AAD; font-size: 14px;');
console.log('%cBuilt with care by Jay Tarzwell | thechatbotgenius.com', 'color: #C77DA2; font-size: 12px;');

// Lightbox functionality for book spread image
function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Use the high-quality version for the lightbox
    lightboxImg.src = 'images/book-cover-paperback-spread.jpg';
    lightbox.style.display = 'flex';
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Language Toggle Functionality - Enhanced with retry logic
window.changeLanguage = function(lang) {
    console.log('Initiating language change to:', lang);
    
    // Add loading state to French button
    const frenchBtn = document.querySelector('.btn-french');
    if (frenchBtn) {
        frenchBtn.style.opacity = '0.6';
        frenchBtn.disabled = true;
    }
    
    // Retry logic with exponential backoff
    let attempts = 0;
    const maxAttempts = 10;
    
    function attemptTranslation() {
        attempts++;
        console.log(`Translation attempt ${attempts}/${maxAttempts}`);
        
        // Method 1: Try the Google Translate select element
        const selectField = document.querySelector('.goog-te-combo') || 
                          document.querySelector('#google_translate_element select') ||
                          document.querySelector('select.goog-te-combo');
        
        if (selectField) {
            console.log('Found Google Translate select field');
            
            // Set the language value
            if (lang === 'en') {
                // For English, we need to clear the translation
                selectField.value = '';
            } else {
                selectField.value = lang;
            }
            
            // Trigger the change event multiple ways
            selectField.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Alternative trigger method
            if (selectField.fireEvent) {
                selectField.fireEvent('onchange');
            }
            
            // Handle Google Translate bar appearance
            setTimeout(() => {
                detectAndHandleTranslateBar();
            }, 100);
            
            // Success - update UI
            setTimeout(() => {
                updateUIState(lang);
            }, 500);
            
            return true;
        }
        
        // Method 2: Try using Google's internal functions
        if (window.google && window.google.translate) {
            console.log('Trying Google Translate internal API');
            
            // Try to find the Google Translate instance
            const googleTranslateElement = document.getElementById('google_translate_element');
            if (googleTranslateElement) {
                // Try to trigger translation via cookies
                if (lang === 'en') {
                    // Clear translation
                    document.cookie = 'googtrans=/en/en; path=/';
                    location.reload();
                } else {
                    // Set translation
                    document.cookie = `googtrans=/en/${lang}; path=/`;
                    location.reload();
                }
                return true;
            }
        }
        
        // Method 3: Try URL hash method as fallback
        if (attempts === maxAttempts - 1) {
            console.log('Using URL hash fallback method');
            if (lang === 'fr') {
                window.location.hash = 'googtrans(fr)';
            } else {
                window.location.hash = '';
            }
            location.reload();
            return true;
        }
        
        // If we haven't succeeded, try again with backoff
        if (attempts < maxAttempts) {
            const delay = Math.min(100 * Math.pow(2, attempts), 3000);
            console.log(`Google Translate not ready, retrying in ${delay}ms`);
            setTimeout(attemptTranslation, delay);
        } else {
            console.error('Failed to change language after all attempts');
            alert('Translation service is temporarily unavailable. Please try again or refresh the page.');
            updateUIState(localStorage.getItem('preferredLanguage') || 'en');
        }
        
        return false;
    }
    
    function updateUIState(lang) {
        // Remove loading state from French button
        const frenchBtn = document.querySelector('.btn-french');
        if (frenchBtn) {
            frenchBtn.style.opacity = '1';
            frenchBtn.disabled = false;
        }
        
        // Store preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_change', {
                'language_selected': lang
            });
        }
        
        console.log(`Language successfully changed to: ${lang}`);
    }
    
    // Start the translation attempt
    attemptTranslation();
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, checking for saved language preference');
    
    // Check for Google Translate cookie first
    const googTransCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    const cookieLang = googTransCookie ? googTransCookie.split('/').pop() : null;
    
    // Get saved preference
    const savedLang = localStorage.getItem('preferredLanguage') || cookieLang || 'en';
    console.log('Detected language preference:', savedLang);
    
    // No need to set button states anymore since we only have FR button
    
    // If French is preferred, attempt to apply it
    if (savedLang === 'fr') {
        console.log('French preference detected, waiting for Google Translate to initialize');
        
        let checkAttempts = 0;
        const maxChecks = 20;
        
        function checkAndApplyLanguage() {
            checkAttempts++;
            
            const selectField = document.querySelector('.goog-te-combo') || 
                              document.querySelector('#google_translate_element select');
            
            if (selectField) {
                console.log('Google Translate ready, applying French');
                selectField.value = 'fr';
                selectField.dispatchEvent(new Event('change', { bubbles: true }));
                return;
            }
            
            if (checkAttempts < maxChecks) {
                setTimeout(checkAndApplyLanguage, 250);
            } else {
                console.log('Google Translate took too long to initialize, using cookie method');
                document.cookie = 'googtrans=/en/fr; path=/';
                // Don't reload automatically, let user trigger if needed
            }
        }
        
        // Start checking after a short delay
        setTimeout(checkAndApplyLanguage, 500);
    }
});

// Also check on window load (as backup)
window.addEventListener('load', function() {
    // Double-check Google Translate is available
    setTimeout(() => {
        const selectField = document.querySelector('.goog-te-combo');
        if (!selectField) {
            console.warn('Google Translate widget not found after page load');
            // Add visual indicator
            const langWrapper = document.querySelector('.language-toggle-wrapper');
            if (langWrapper && !langWrapper.querySelector('.translation-warning')) {
                const warning = document.createElement('span');
                warning.className = 'translation-warning';
                warning.style.cssText = 'display: none;'; // Hidden by default
                warning.textContent = '⚠️';
                warning.title = 'Translation service loading...';
                langWrapper.appendChild(warning);
            }
        } else {
            console.log('Google Translate widget confirmed available');
        }
        
        // Check for translate bar on load
        detectAndHandleTranslateBar();
    }, 2000);
});

// Function to detect and handle Google Translate bar
function detectAndHandleTranslateBar() {
    const translateBar = document.querySelector('.goog-te-banner-frame');
    const body = document.body;
    
    if (translateBar) {
        // Google Translate bar is present
        if (!body.classList.contains('translated')) {
            body.classList.add('translated');
            console.log('Google Translate bar detected - adjusting layout');
            
            // Get the actual height of the translate bar
            const barHeight = translateBar.offsetHeight || 40;
            
            // Update CSS variable for dynamic adjustment
            document.documentElement.style.setProperty('--translate-bar-height', `${barHeight}px`);
            
            // If header is fixed, adjust its position
            const header = document.querySelector('.header');
            if (header) {
                const headerStyle = window.getComputedStyle(header);
                if (headerStyle.position === 'fixed' || headerStyle.position === 'sticky') {
                    header.style.top = `${barHeight}px`;
                }
            }
        }
    } else {
        // No translate bar - remove adjustments
        if (body.classList.contains('translated')) {
            body.classList.remove('translated');
            console.log('Google Translate bar removed - restoring layout');
            
            // Reset header position
            const header = document.querySelector('.header');
            if (header) {
                header.style.top = '';
            }
            
            // Clear CSS variable
            document.documentElement.style.removeProperty('--translate-bar-height');
        }
    }
}

// Monitor for Google Translate bar changes
const observeTranslateBar = new MutationObserver(() => {
    detectAndHandleTranslateBar();
});

// Start observing when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Observe body for child additions (translate bar)
    observeTranslateBar.observe(document.body, {
        childList: true,
        subtree: false
    });
    
    // Initial check
    setTimeout(detectAndHandleTranslateBar, 1000);
});
