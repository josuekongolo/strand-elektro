/**
 * Strand Elektro - Main JavaScript
 * Elektriker i Fagernes, Valdres
 */

(function() {
    'use strict';

    // ===========================================
    // DOM Elements
    // ===========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const header = document.querySelector('.header');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const contactForm = document.getElementById('contact-form');

    // ===========================================
    // Mobile Navigation
    // ===========================================
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.setAttribute('aria-expanded', !isExpanded);
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') &&
                !mobileNav.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===========================================
    // Header Scroll Effect
    // ===========================================
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add shadow when scrolled
        if (scrollTop > 10) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
        }

        lastScrollTop = scrollTop;
    }

    if (header) {
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    }

    // ===========================================
    // Scroll to Top Button
    // ===========================================
    function handleScrollTopButton() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    if (scrollTopBtn) {
        window.addEventListener('scroll', handleScrollTopButton, { passive: true });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===========================================
    // Smooth Scroll for Anchor Links
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // Contact Form Handling
    // ===========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const successMsg = document.getElementById('form-success');
            const errorMsg = document.getElementById('form-error');

            // Get form data
            const formData = {
                navn: contactForm.navn.value.trim(),
                telefon: contactForm.telefon.value.trim(),
                epost: contactForm.epost.value.trim(),
                adresse: contactForm.adresse.value.trim(),
                oppdragstype: contactForm.oppdragstype.value,
                beskrivelse: contactForm.beskrivelse.value.trim(),
                befaring: contactForm.befaring.checked ? 'Ja' : 'Nei'
            };

            // Basic validation
            if (!formData.navn || !formData.telefon || !formData.epost || !formData.oppdragstype || !formData.beskrivelse) {
                errorMsg.textContent = 'Vennligst fyll ut alle obligatoriske felt.';
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.epost)) {
                errorMsg.textContent = 'Vennligst oppgi en gyldig e-postadresse.';
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
                return;
            }

            // Show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="spin"><path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/></svg> Sender...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                // For production, integrate with Resend API or another email service
                await new Promise(resolve => setTimeout(resolve, 1500));

                // For demo purposes, we'll just show success
                // In production, you would send data to your backend/API

                /*
                // Example Resend API integration:
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                */

                // Show success message
                successMsg.style.display = 'block';
                errorMsg.style.display = 'none';

                // Reset form
                contactForm.reset();

                // Scroll to success message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                errorMsg.innerHTML = '<strong>Noe gikk galt.</strong><br>Vennligst prøv igjen eller ring meg direkte på 900 XX XXX.';
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#DC3545';
                } else {
                    this.style.borderColor = '';
                }
            });

            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(220, 53, 69)') {
                    this.style.borderColor = '';
                }
            });
        });
    }

    // ===========================================
    // Intersection Observer for Animations
    // ===========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to elements
    document.querySelectorAll('.service-card, .why-item, .area-card, .value-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeInObserver.observe(el);
    });

    // CSS class for visible state
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    // ===========================================
    // Phone Number Click Tracking (Analytics)
    // ===========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks if analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call'
                });
            }
        });
    });

    // ===========================================
    // Email Link Click Tracking (Analytics)
    // ===========================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track email clicks if analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Email'
                });
            }
        });
    });

    // ===========================================
    // Lazy Loading for Images
    // ===========================================
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');

        const lazyLoad = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        };

        const imageObserver = new IntersectionObserver(lazyLoad, {
            root: null,
            rootMargin: '50px',
            threshold: 0
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===========================================
    // Service Worker Registration (Optional)
    // ===========================================
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        });
    }
    */

    // ===========================================
    // Utility Functions
    // ===========================================

    /**
     * Debounce function for performance optimization
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Format phone number for display
     */
    function formatPhoneNumber(number) {
        return number.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3');
    }

    // ===========================================
    // Initialize on DOM Ready
    // ===========================================
    console.log('Strand Elektro - Website loaded');

})();
