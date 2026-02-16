/**
 * Dr. Ramya's Dentistry - Core JavaScript
 * Version: 2.0 (Production Ready)
 * 
 * Features:
 * 1. Dark/Light Mode with LocalStorage persistence
 * 2. Mobile Navigation (Hamburger) with Scroll Locking
 * 3. Sticky Header (Performance-optimized with IntersectionObserver)
 * 4. Scroll Reveal Animations (60fps)
 * 5. Matterport 3D Tour "Facade" (Data Saver)
 * 6. Back-to-Top Button logic
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
        
        // Helper: Update the icon based on current state
        const updateIcon = (isDark) => {
            if (themeIcon) {
                themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
        };

        // 1. Check LocalStorage on load (Persistence)
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            htmlElement.classList.add("dark-mode");
            updateIcon(true);
        } else {
            updateIcon(false);
        }

        // 2. Click Event Listener
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Toggle Class
                htmlElement.classList.toggle('dark-mode');
                
                // Check new state
                const isDark = htmlElement.classList.contains('dark-mode');
                
                // Update Icon & Storage
                updateIcon(isDark);
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

        // --- Sticky Header (IntersectionObserver) ---
        // We watch a 1px invisible element at the top. When it leaves the screen, we shrink the header.
        if (header && sentinel) {
            const observer = new IntersectionObserver(([entry]) => {
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
                
                // Toggle State
                hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
                hamburgerBtn.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Lock Body Scroll (Prevent background scrolling when menu is open)
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

            // Close menu when clicking ANY link
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
    // 3. MATTERPORT FACADE (Performance Optimization)
    // =========================================================================
    const initMatterportFacade = () => {
        const facade = document.querySelector('.matterport-facade');
        const iframe = document.getElementById('matterport-frame');

        if (facade && iframe) {
            facade.addEventListener('click', () => {
                // 1. Get the real URL from data-src
                const src = iframe.getAttribute('data-src');
                
                if (src) {
                    // 2. Load the heavy iframe
                    iframe.setAttribute('src', src);
                    
                    // 3. Animate the facade out
                    facade.style.opacity = '0';
                    
                    // 4. Remove facade from DOM after animation completes
                    setTimeout(() => {
                        facade.style.display = 'none';
                    }, 500);
                }
            });
        }
    };

    // =========================================================================
    // 4. SCROLL REVEAL ANIMATIONS
    // =========================================================================
    const initScrollAnimations = () => {
        const revealElements = document.querySelectorAll('.reveal-wrapper');
        
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop watching once revealed
                }
            });
        }, {
            root: null,
            threshold: 0.15, // Trigger when 15% visible
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    };

    // =========================================================================
    // 5. BACK TO TOP BUTTON
    // =========================================================================
    const initBackToTop = () => {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        const sentinel = document.getElementById('header-sentinel');

        if (!backToTopBtn || !sentinel) return;

        const observer = new IntersectionObserver(([entry]) => {
            // Show button only when we have scrolled past the header
            if (!entry.isIntersecting) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { rootMargin: '0px', threshold: 0 });

        observer.observe(sentinel);

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
    initMatterportFacade();
    initScrollAnimations();
    initBackToTop();
});