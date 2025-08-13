// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// DOM Elements
const preloader = document.getElementById('preloader');
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePreloader();
    initializeNavigation();
    initializeAnimations();
    initializeScrollEffects();
    initializeSkillBars();
    initializeContactForm();
    initializeTypingEffect();
});

// Preloader Animation
function initializePreloader() {
    // Hide preloader after page load
    window.addEventListener('load', function () {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.5,
            delay: 0.5,
            onComplete: function () {
                preloader.style.display = 'none';
                // Start hero animations
                animateHero();
            }
        });
    });
}

// Navigation Functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Animate menu items
    if (navMenu.classList.contains('active')) {
        gsap.fromTo('.nav-item', {
            opacity: 0,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.1
        });
    }
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Hero Section Animations
function animateHero() {
    const tl = gsap.timeline();

    tl.to('.hero-text', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    })
        .to('.hero-image', {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.5")
        .to('.scroll-indicator', {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3");

    // Animate hero elements individually
    gsap.fromTo('.hero-greeting', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
    });

    gsap.fromTo('.hero-name', {
        opacity: 0,
        y: 40
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power3.out"
    });

    gsap.fromTo('.hero-role', {
        opacity: 0,
        y: 40
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        ease: "power3.out"
    });

    gsap.fromTo('.hero-description', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out"
    });

    gsap.fromTo('.hero-buttons .btn', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
}

// Typing Effect for Hero Role
function initializeTypingEffect() {
    const roles = ["Machine Learning Engineer", "AI Specialist", "Data Scientist", "ML Engineer"];
    let currentRole = 0;

    function typeRole() {
        const heroRole = document.querySelector('.hero-role');
        if (heroRole) {
            gsap.to(heroRole, {
                duration: 2,
                text: roles[currentRole],
                ease: "none",
                onComplete: function () {
                    setTimeout(() => {
                        currentRole = (currentRole + 1) % roles.length;
                        setTimeout(typeRole, 1000);
                    }, 3000);
                }
            });
        }
    }

    // Start typing effect after hero animation
    setTimeout(typeRole, 2000);
}

// Scroll-triggered Animations
function initializeAnimations() {
    // About section
    gsap.fromTo('.about-text', {
        opacity: 0,
        x: -50
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.fromTo('.about-image', {
        opacity: 0,
        x: 50
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    // Stats animation
    gsap.fromTo('.stat-item', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        }
    });

    // Animate stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        const finalNumber = stat.textContent;
        const number = parseInt(finalNumber);

        gsap.fromTo(stat, {
            textContent: 0
        }, {
            textContent: number,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            onUpdate: function () {
                stat.textContent = Math.ceil(stat.textContent) + (finalNumber.includes('+') ? '+' : '');
            }
        });
    });

    // Skills section
    gsap.fromTo('.skill-category', {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    // Projects section
    gsap.fromTo('.project-card', {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.projects',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    // Contact section
    gsap.fromTo('.contact-info', {
        opacity: 0,
        x: -30
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.fromTo('.contact-form', {
        opacity: 0,
        x: 30
    }, {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Footer animations
    gsap.fromTo('.footer-info', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.fromTo('.footer-links', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.fromTo('.footer-bottom', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.4,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');

        gsap.fromTo(bar, {
            width: '0%'
        }, {
            width: progress + '%',
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero background
    gsap.to('.hero', {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Floating animation for profile image
    gsap.to('.profile-image-container', {
        y: -20,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });

    // Profile image hover effects
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', () => {
            gsap.to('.profile-glow', {
                scale: 1.2,
                opacity: 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        profileImage.addEventListener('mouseleave', () => {
            gsap.to('.profile-glow', {
                scale: 1,
                opacity: 0.2,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    // Card hover animations
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Button hover animations
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });
}

// Contact Form Handling
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, textarea');

    // Form validation and animation
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.2,
                ease: "power2.out"
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });

    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    // Simple validation
    if (!formValues.name || !formValues.email || !formValues.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Animate submit button
    const submitBtn = e.target.querySelector('.btn');
    const originalText = submitBtn.innerHTML;

    gsap.to(submitBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
    });

    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        e.target.reset();
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)';
    }

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.skill-category, .project-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
        document.head.appendChild(script);

        script.onload = function () {
            new SmoothScroll('a[href*="#"]');
        };
    }
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('*', { duration: 0 });
    }
}

// Theme switcher (for future enhancement)
function initializeThemeSystem() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

// Error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics service
});

// Initialize performance optimizations
smoothScrollPolyfill();
optimizePerformance();
createIntersectionObserver();

// Add some Easter eggs for developers
console.log(`
🚀 Welcome to Faizan Haider's Portfolio!
💻 Built with HTML, CSS, JavaScript & GSAP
🎨 Designed for performance and accessibility
📱 Fully responsive across all devices

Interested in the code? Check out the source!
`);

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePreloader,
        initializeNavigation,
        initializeAnimations,
        showNotification
    };
}
