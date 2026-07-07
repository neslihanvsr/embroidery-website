document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    const mobileNavLinks = document.querySelectorAll('.nav--mobile .nav__list a');

    if (navToggle && mobileNav) {
        // Toggle mobile navigation menu
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.classList.toggle('is-open');
            mobileNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a navigation link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('is-open')) {
                    navToggle.classList.remove('is-open');
                    mobileNav.classList.remove('is-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Add any other global/shared JavaScript interactions here
    // For example, smooth scrolling, back-to-top buttons, etc.
});