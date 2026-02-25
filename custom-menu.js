// Custom Mobile Menu and Search JavaScript

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initMobileMenu();
            initSearch();
        });
    } else {
        initMobileMenu();
        initSearch();
    }

    function initSearch() {
        const searchButtons = document.querySelectorAll('.et_pb_menu__search-button');
        const closeButtons = document.querySelectorAll('.et_pb_menu__close-search-button');
        const searchForms = document.querySelectorAll('.et_pb_menu__search-form');

        // Toggle search container open on search button click
        searchButtons.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                const menu = btn.closest('.et_pb_fullwidth_menu');
                if (!menu) return;
                const container = menu.querySelector('.et_pb_menu__search-container');
                const input = menu.querySelector('.et_pb_menu__search-input');
                if (!container) return;
                container.classList.remove('et_pb_menu__search-container--disabled');
                container.classList.add('et_pb_menu__search-container--visible');
                if (input) input.focus();
            });
        });

        // Close search container on close button click
        closeButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const menu = btn.closest('.et_pb_fullwidth_menu');
                if (!menu) return;
                const container = menu.querySelector('.et_pb_menu__search-container');
                if (!container) return;
                container.classList.remove('et_pb_menu__search-container--visible');
                container.classList.add('et_pb_menu__search-container--disabled');
            });
        });

        // Intercept form submit and redirect to Google site search
        searchForms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = form.querySelector('.et_pb_menu__search-input');
                if (input && input.value.trim()) {
                    const query = encodeURIComponent(input.value.trim());
                    window.open(
                        'https://www.google.com/search?q=site:freeforcharity.github.io/FFC-EX-SRRN.net+' + query,
                        '_blank'
                    );
                }
            });
        });
    }
    
    function initMobileMenu() {
        // Find the mobile menu button
        const mobileMenuBar = document.querySelector('.mobile_nav .mobile_menu_bar');
        const mobileNav = document.querySelector('.mobile_nav');
        
        if (!mobileMenuBar || !mobileNav) {
            console.log('Mobile menu elements not found');
            return;
        }
        
        // Create mobile menu container if it doesn't exist
        let mobileMenu = document.querySelector('.et_mobile_menu');
        if (!mobileMenu) {
            mobileMenu = createMobileMenu();
        }
        
        // Add click handler to toggle menu
        mobileMenuBar.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Add click handlers for sub-menu toggles
        const menuItemsWithChildren = mobileMenu.querySelectorAll('.menu-item-has-children > a');
        menuItemsWithChildren.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const parentLi = this.parentElement;
                parentLi.classList.toggle('opened');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.et_pb_fullwidth_menu')) {
                closeMobileMenu();
            }
        });
    }
    
    function createMobileMenu() {
        // Clone the desktop menu
        const desktopMenu = document.querySelector('.et_pb_menu__menu nav ul');
        if (!desktopMenu) {
            console.log('Desktop menu not found');
            return null;
        }
        
        // Create mobile menu container
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'et_mobile_menu';
        
        // Clone the menu
        const clonedMenu = desktopMenu.cloneNode(true);
        mobileMenu.appendChild(clonedMenu);
        
        // Insert after mobile nav button
        const mobileNavContainer = document.querySelector('.et_mobile_nav_menu');
        if (mobileNavContainer && mobileNavContainer.parentNode) {
            mobileNavContainer.parentNode.insertBefore(mobileMenu, mobileNavContainer.nextSibling);
        }
        
        return mobileMenu;
    }
    
    function toggleMobileMenu() {
        const mobileNav = document.querySelector('.mobile_nav');
        if (mobileNav) {
            if (mobileNav.classList.contains('opened')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    }
    
    function openMobileMenu() {
        const mobileNav = document.querySelector('.mobile_nav');
        if (mobileNav) {
            mobileNav.classList.add('opened');
            mobileNav.classList.remove('closed');
        }
    }
    
    function closeMobileMenu() {
        const mobileNav = document.querySelector('.mobile_nav');
        if (mobileNav) {
            mobileNav.classList.remove('opened');
            mobileNav.classList.add('closed');
        }
    }
})();
