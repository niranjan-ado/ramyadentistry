/**
 * Dr. Ramya's Dentistry - Core JavaScript
 * High-performance, zero-dependency vanilla JS.
 * Engineered for 90+ Lighthouse scores and 60fps rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. DYNAMIC ISLAND & MOBILE NAVIGATION
    // =========================================================================
    const initNavigation = () => {
        const btn = document.getElementById('hamburger-button');
        const menu = document.getElementById('nav-links-menu');
        const header = document.querySelector('.main-header');
        const sentinel = document.getElementById('header-sentinel');
        
        // Mobile Menu Logic
        if (btn && menu) {
            const toggleMenu = (forceClose = false) => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                const willExpand = forceClose ? false : !isExpanded;
                
                // Toggle accessibility attributes and classes
                btn.setAttribute('aria-expanded', willExpand);
                menu.classList.toggle('active', willExpand);
                btn.classList.toggle('active', willExpand);
                
                // Toggle Material Icon (menu <-> close)
                const icon = btn.querySelector('.material-icons-outlined');
                if (icon) icon.textContent = willExpand ? 'close' : 'menu';
                
                // Prevent background scrolling when menu is open
                document.body.style.overflow = willExpand ? 'hidden' : '';
            };

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            // Close menu cleanly when clicking any navigation link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => toggleMenu(true));
            });

            // Close menu when clicking outside of it
            document.addEventListener('click', (e) => {
                if (menu.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) {
                    toggleMenu(true);
                }
            });
        }

        // Header Scroll Shrink (Zero Scroll-Event Jitter)
        if (header && sentinel) {
            const observer = new IntersectionObserver(([entry]) => {
                // When sentinel leaves viewport, shrink the header pill
                header.classList.toggle('scrolled', !entry.isIntersecting);
            }, { rootMargin: '0px', threshold: 0 });
            
            observer.observe(sentinel);
        }
    };

    // =========================================================================
    // 2. PREMIUM BATCHED SCROLL REVEALS
    // =========================================================================
    const initScrollReveal = () => {
        // Exclude hero section from scroll reveals to protect instant LCP
        const elements = document.querySelectorAll('.reveal-wrapper:not(.hero-content .reveal-wrapper)');
        if (!elements.length) return;

        let visibleElements = [];
        let rafId = null;

        // Threshold 0.15 means the animation triggers when 15% of the element is visible
        const observer = new IntersectionObserver((entries, obs) => {
            let hasNewVisible = false;
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleElements.push(entry.target);
                    obs.unobserve(entry.target); // Only animate once
                    hasNewVisible = true;
                }
            });

            // Batch DOM writes via requestAnimationFrame to guarantee silky 60fps animations
            if (hasNewVisible && !rafId) {
                rafId = requestAnimationFrame(() => {
                    visibleElements.forEach(el => el.classList.add('visible'));
                    visibleElements = [];
                    rafId = null; // Reset lock
                });
            }
        }, { 
            threshold: 0.15, 
            rootMargin: '0px 0px -50px 0px' 
        });

        elements.forEach(el => observer.observe(el));
    };

    // =========================================================================
    // 3. SURGICAL DARK MODE TOGGLE
    // =========================================================================
    const initThemeToggle = () => {
        const btn = document.getElementById('theme-toggle-btn');
        const icon = document.getElementById('theme-icon');
        const html = document.documentElement;
        
        if (!btn || !icon) return;

        // Ensure the icon matches the initial load state (handled by the inline <head> script)
        if (html.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
        }

        btn.addEventListener('click', () => {
            const isDark = html.classList.toggle('dark-mode');
            icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    };

    // =========================================================================
    // 4. BACK TO TOP OBSERVER
    // =========================================================================
    const initBackToTop = () => {
        const btn = document.getElementById('back-to-top-btn');
        const sentinel = document.getElementById('header-sentinel');
        
        if (!btn || !sentinel) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Using smooth behavior via native browser APIs instead of jQuery
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        const observer = new IntersectionObserver(([entry]) => {
            // Show button only when user scrolls past the top sentinel
            if (!entry.isIntersecting) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { rootMargin: '0px', threshold: 0 });
        
        observer.observe(sentinel);
    };

    // =========================================================================
    // BOOTSTRAP INITIALIZATION
    // =========================================================================
    initNavigation();
    initScrollReveal();
    initThemeToggle();
    initBackToTop();
});