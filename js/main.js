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

// Language Toggle Functionality - Make it global
window.changeLanguage = function(lang) {
    console.log('Changing language to:', lang);
    
    // Wait for Google Translate to be ready
    setTimeout(function() {
        // Try multiple selectors for Google Translate
        var selectField = document.querySelector('.goog-te-combo');
        if (!selectField) {
            selectField = document.querySelector('#google_translate_element select');
        }
        
        if (selectField) {
            console.log('Found select field, changing to:', lang);
            selectField.value = lang;
            
            // Trigger change event properly
            var event = new Event('change', { bubbles: true });
            selectField.dispatchEvent(event);
            
            // Also try the Google Translate way
            if (typeof doGTranslate !== 'undefined') {
                doGTranslate('en|' + lang);
            }
        } else {
            console.log('Google Translate select not found');
        }
        
        // Update active button state
        document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(lang.toUpperCase())) {
                btn.classList.add('active');
            }
        });
        
        // Store preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_change', {
                'language_selected': lang
            });
        }
    }, 100);
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Google Translate to initialize
    setTimeout(() => {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            // Set the active button state
            document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.includes(savedLang.toUpperCase())) {
                    btn.classList.add('active');
                }
            });
            
            // Apply the saved language
            if (savedLang === 'fr') {
                const selectField = document.querySelector('.goog-te-combo');
                if (selectField) {
                    selectField.value = 'fr';
                    selectField.dispatchEvent(new Event('change'));
                }
            }
        } else {
            // Default to English
            const enBtn = document.querySelector('.lang-toggle-btn:first-of-type');
            if (enBtn) {
                enBtn.classList.add('active');
            }
        }
    }, 1500); // Wait 1.5 seconds for Google Translate to fully load
});
