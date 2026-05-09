const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initializeThemeToggle();
    initializeNavigation();
    initializePreloader();
    initializeAnimations();
    initializeContactForm();
    initializeProjectFilters();
    initializeScrollToTop();
    initializeWhatsAppFloat();
    initializeEmailReveal();
    initializeServiceWorker();
    initializeViewTransitions();
    setDynamicCopyrightYear();
});

function initializeThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDarkScheme ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    if (toggle) {
        toggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            toggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
        });
    }
}

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .back-to-top-link, .footer a[href^="#"]');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });

            if (hamburger && navMenu) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const sections = document.querySelectorAll('main section[id]');
    const primaryLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            primaryLinks.forEach((link) => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
}

function initializePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        if (!prefersReducedMotion && window.gsap) {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.35,
                delay: 0.2,
                onComplete: () => {
                    preloader.style.display = 'none';
                    animateHero();
                }
            });
        } else {
            preloader.style.display = 'none';
            showStaticAnimatedElements();
        }
    });
}

function initializeAnimations() {
    if (prefersReducedMotion || !window.gsap) {
        showStaticAnimatedElements();
        return;
    }

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    const revealSelectors = [
        '.about-text',
        '.about-image',
        '.timeline-card',
        '.skill-category',
        '.service-card',
        '.pricing-card',
        '.project-card',
        '.testimonial-card',
        '.contact-info',
        '.contact-form',
        '.footer-brand',
        '.footer-links',
        '.footer-bottom'
    ];

    revealSelectors.forEach((selector) => {
        gsap.utils.toArray(selector).forEach((element, index) => {
            gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: 0.65,
                delay: Math.min(index * 0.06, 0.3),
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    });

    gsap.to('.profile-image-container', {
        y: -12,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut'
    });

    initializeTypingEffect();
}

function animateHero() {
    if (prefersReducedMotion || !window.gsap) {
        showStaticAnimatedElements();
        return;
    }

    const timeline = gsap.timeline();
    timeline
        .to('.hero-text', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.hero-image', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.45');
}

function initializeTypingEffect() {
    if (prefersReducedMotion || !window.gsap || !window.TextPlugin) return;

    const role = document.querySelector('.hero-role');
    if (!role) return;

    const roles = [
        'Machine Learning Engineer',
        'RAG Chatbot Developer',
        'AI SaaS Builder',
        'Lead Generation Expert'
    ];
    let index = 0;

    const cycleRole = () => {
        index = (index + 1) % roles.length;
        gsap.to(role, {
            duration: 0.9,
            text: roles[index],
            ease: 'none',
            delay: 2.8,
            onComplete: cycleRole
        });
    };

    cycleRole();
}

function showStaticAnimatedElements() {
    document.querySelectorAll('.hero-text, .hero-image, .about-text, .about-image, .timeline-card, .skill-category, .service-card, .pricing-card, .project-card, .testimonial-card, .contact-info, .contact-form, .footer-brand, .footer-links, .footer-bottom')
        .forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
}

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitButton = document.getElementById('submit-btn');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearFormMessages(form, status);

        if (!validateContactForm(form)) return;

        const originalButtonText = submitButton.querySelector('span')?.textContent || 'Send Message';
        submitButton.disabled = true;
        submitButton.querySelector('span').textContent = 'Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            showFormStatus(status, "Message sent! I'll reply within 24 hours.", 'success');
            form.reset();
        } catch (error) {
            showFormStatus(status, 'Something went wrong. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.querySelector('span').textContent = originalButtonText;
        }
    });
}

function validateContactForm(form) {
    let isValid = true;
    const fields = [
        { id: 'name', message: 'Please enter your name.' },
        { id: 'email', message: 'Please enter a valid email address.' },
        { id: 'subject', message: 'Please add a subject.' },
        { id: 'message', message: 'Please describe your project.' }
    ];

    fields.forEach(({ id, message }) => {
        const field = form.querySelector(`#${id}`);
        const error = document.getElementById(`${id}-error`);
        if (!field || !error) return;

        const value = field.value.trim();
        const isEmailField = id === 'email';
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const invalid = !value || (isEmailField && !validEmail);

        if (invalid) {
            error.textContent = message;
            field.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            error.textContent = '';
            field.removeAttribute('aria-invalid');
        }
    });

    return isValid;
}

function clearFormMessages(form, status) {
    form.querySelectorAll('.field-error').forEach((error) => {
        error.textContent = '';
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => {
        field.removeAttribute('aria-invalid');
    });
    if (status) {
        status.textContent = '';
        status.className = 'form-status';
    }
}

function showFormStatus(status, message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = `form-status ${type}`;
}

function initializeProjectFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            buttons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            cards.forEach((card) => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });
}

function initializeScrollToTop() {
    const button = document.getElementById('scroll-to-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        button.classList.toggle('visible', window.scrollY > 420);
    }, { passive: true });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}

function initializeWhatsAppFloat() {
    const button = document.getElementById('whatsapp-btn');
    const hero = document.getElementById('home');
    if (!button || !hero) return;

    const observer = new IntersectionObserver((entries) => {
        button.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0.1 });

    observer.observe(hero);
}

function initializeEmailReveal() {
    const user = 'faizanhaiderofficial1';
    const domain = 'gmail.com';
    const element = document.getElementById('email-reveal');
    if (!element) return;

    const link = document.createElement('a');
    link.href = `mailto:${user}@${domain}`;
    link.textContent = `${user}@${domain}`;
    element.appendChild(link);
}

function initializeServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            /* Service worker registration can fail on file:// or unsupported local previews. */
        });
    });
}

function initializeViewTransitions() {
    if (!document.startViewTransition) return;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', () => {
            document.documentElement.classList.add('view-transition-ready');
            window.setTimeout(() => document.documentElement.classList.remove('view-transition-ready'), 400);
        });
    });
}

function setDynamicCopyrightYear() {
    const year = document.getElementById('copyright-year');
    if (year) year.textContent = String(new Date().getFullYear());
}
