/**
 * Dr. Ramya's Dentistry - Core JavaScript
 * High-performance, zero-dependency vanilla JS.
 * Engineered for 60fps rendering and smooth interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. THEME TOGGLE (Dark/Light Mode)
    // =========================================================================
    const initThemeToggle = () => {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        const themeIcon = document.getElementById('theme-icon');
        const htmlElement = document.documentElement;
        
        // Helper to set the correct icon text (Material Icons)
        const updateIcon = (isDark) => {
            // If dark mode is active, show the 'light_mode' (Sun) icon
            themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
        };

        // 1. Check state on load (handled partially by inline script in HTML, but we sync icon here)
        if (htmlElement.classList.contains('dark-mode')) {
            updateIcon(true);
        }

        // 2. Event Listener
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Toggle class
                htmlElement.classList.toggle('dark-mode');
                
                // Check new state
                const isDark = htmlElement.classList.contains('dark-mode');
                
                // Update Icon
                updateIcon(isDark);
                
                // Save preference to LocalStorage
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }
    };

    // =========================================================================
    // 2. DYNAMIC HEADER & MOBILE NAVIGATION
    // =========================================================================
    const initNavigation = () => {
        const header = document.querySelector('.main-header');
        const hamburgerBtn = document.getElementById('hamburger-button');
        const navMenu = document.getElementById('nav-links-menu');
        const sentinel = document.getElementById('header-sentinel');

        // --- Sticky Header Logic (using IntersectionObserver for performance) ---
        if (header && sentinel) {
            const observer = new IntersectionObserver(([entry]) => {
                // If the sentinel (top pixel) is NOT visible, we are scrolled down
                if (!entry.isIntersecting) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { rootMargin: '0px', threshold: 0 });

            observer.observe(sentinel);
        }

        // --- Mobile Menu Logic ---
        if (hamburgerBtn && navMenu) {
            const toggleMenu = () => {
                const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
                
                // Toggle Attributes
                hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
                hamburgerBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Toggle Scroll Lock on Body
                document.body.style.overflow = !isExpanded ? 'hidden' : '';

                // Toggle Icon (Menu <-> Close)
                const iconSpan = hamburgerBtn.querySelector('span');
                if (iconSpan) {
                    iconSpan.textContent = !isExpanded ? 'close' : 'menu';
                }
            };

            // Click Handler
            hamburgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            // Close menu when clicking a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) toggleMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(e.target) && 
                    !hamburgerBtn.contains(e.target)) {
                    toggleMenu();
                }
            });
        }
    };

    // =========================================================================
    // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // =========================================================================
    const initScrollAnimations = () => {
        // Select all wrappers that need animating
        const revealElements = document.querySelectorAll('.reveal-wrapper');
        
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add the class that triggers CSS transform/opacity
                    entry.target.classList.add('visible');
                    // Stop observing once revealed (performance optimization)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px' // Offset slightly to trigger before bottom
        });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    // =========================================================================
    // 4. BACK TO TOP BUTTON
    // =========================================================================
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        const sentinel = document.getElementById('header-sentinel');

        if (!backToTopBtn || !sentinel) return;

        // Show/Hide button based on scroll position
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { rootMargin: '0px', threshold: 0 });

        observer.observe(sentinel);

        // Smooth Scroll to top
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initBackToTop();
});