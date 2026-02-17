/**
 * Dr. Ramya's Dentistry - Core Logic
 * Version: 3.0 (Performance & Motion Optimized)
 * 
 * Strategy:
 * - No 'scroll' event listeners (uses IntersectionObserver for 60fps)
 * - Defer heavy assets (Matterport) until interaction
 * - Sync Dark Mode state with LocalStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. THEME ENGINE (Dark/Light Mode)
    // =========================================================================
    const initThemeToggle = () => {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        const themeIcon = document.getElementById('theme-icon');
        const htmlElement = document.documentElement;
        
        // Helper: Update the Material Icon based on state
        const updateIcon = (isDark) => {
            if (themeIcon) {
                // 'dark_mode' icon for dark state (moon), 'light_mode' for light state (sun)
                // Logic inverted: If it's dark, show 'light_mode' icon (sun) to switch to light
                // If it's light, show 'dark_mode' icon (moon) to switch to dark
                themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
        };

        // 1. Initial State Check (Syncs with the inline script in HTML)
        const currentTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkInitial = currentTheme === 'dark' || (!currentTheme && systemDark);
        
        // Ensure icon matches the state set by inline HTML script
        updateIcon(isDarkInitial);

        // 2. Click Handler
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Toggle CSS Class
                htmlElement.classList.toggle('dark-mode');
                
                const isDarkNow = htmlElement.classList.contains('dark-mode');
                
                // Update Icon & Storage
                updateIcon(isDarkNow);
                localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
            });
        }
    };

    // =========================================================================
    // 2. SMART NAVIGATION (Sticky + Mobile)
    // =========================================================================
    const initNavigation = () => {
        const header = document.querySelector('.main-header');
        const sentinel = document.getElementById('header-sentinel');
        const hamburgerBtn = document.getElementById('hamburger-button');
        const navMenu = document.getElementById('nav-links-menu');

        // A. Sticky Header Logic (IntersectionObserver)
        // Watch the pixel at top of body. When it leaves viewport, shrink header.
        if (header && sentinel) {
            const stickyObserver = new IntersectionObserver(([entry]) => {
                if (!entry.isIntersecting) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { rootMargin: '0px', threshold: 0 });

            stickyObserver.observe(sentinel);
        }

        // B. Mobile Menu Logic
        if (hamburgerBtn && navMenu) {
            const toggleMenu = () => {
                const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
                
                // Toggle Classes
                hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
                hamburgerBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Lock Body Scroll to prevent background moving
                document.body.style.overflow = !isExpanded ? 'hidden' : '';

                // Toggle Icon
                const iconSpan = hamburgerBtn.querySelector('span');
                if (iconSpan) {
                    iconSpan.textContent = !isExpanded ? 'close' : 'menu';
                }
            };

            // Trigger
            hamburgerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMenu();
            });

            // Close when clicking a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) toggleMenu();
                });
            });

            // Close when clicking outside
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
    // 3. SCROLL REVEAL ANIMATIONS (Performance Optimized)
    // =========================================================================
    const initScrollAnimations = () => {
        // Select all elements wrapped in .reveal-wrapper
        const elements = document.querySelectorAll('.reveal-wrapper');
        
        if (elements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add class to trigger CSS transform
                    entry.target.classList.add('visible');
                    // Stop watching this element (Save resources)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: '0px 0px -50px 0px' // Offset slightly so it triggers before bottom
        });

        elements.forEach(el => revealObserver.observe(el));
    };

    // =========================================================================
    // 4. MATTERPORT "FACADE" (Data Saver)
    // =========================================================================
    const initMatterportFacade = () => {
        const facade = document.querySelector('.matterport-facade');
        const iframe = document.getElementById('matterport-frame');

        if (facade && iframe) {
            facade.addEventListener('click', () => {
                // 1. Retrieve the real URL
                const src = iframe.getAttribute('data-src');
                
                if (src) {
                    // 2. Inject URL into iframe (Begins loading 3D tour)
                    iframe.setAttribute('src', src);
                    
                    // 3. Fade out the cover image
                    facade.style.opacity = '0';
                    facade.style.pointerEvents = 'none';
                    
                    // 4. Cleanup DOM
                    setTimeout(() => {
                        facade.style.display = 'none';
                    }, 500);
                }
            });
        }
    };

    // =========================================================================
    // 5. BACK TO TOP BUTTON
    // =========================================================================
    const initBackToTop = () => {
        const btn = document.getElementById('back-to-top-btn');
        const sentinel = document.getElementById('header-sentinel');

        if (!btn || !sentinel) return;

        // Show button only when passed the header
        const btnObserver = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { rootMargin: '0px', threshold: 0 });

        btnObserver.observe(sentinel);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initMatterportFacade();
    initBackToTop();
});