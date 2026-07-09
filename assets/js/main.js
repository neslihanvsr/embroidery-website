document.addEventListener('DOMContentLoaded', () => {
    // Function to render the header
    function renderHeader() {
        const headerHtml = `
            <header class="site-header">
                <div class="container">
                    <div class="header-content">
                        <a href="index.html" class="site-logo">
                            <img src="https://via.placeholder.com/150x40?text=HoyThreads" alt="HoyThreads Embroidery Logo" width="150" height="40">
                        </a>
                        <!-- Desktop Navigation -->
                        <nav class="nav--desktop">
                            <ul class="nav__list">
                                <li class="nav__item"><a href="index.html">Home</a></li>
                                <li class="nav__item"><a href="products.html">Products</a></li>
                                <li class="nav__item"><a href="gallery.html">Gallery</a></li>
                                <li class="nav__item"><a href="about.html">About</a></li>
                                <li class="nav__item"><a href="custom-orders.html">Custom Orders</a></li>
                                <li class="nav__item"><a href="contact.html">Contact</a></li>
                            </ul>
                        </nav>
                        <!-- Mobile Navigation Toggle (Hamburger) -->
                        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
                            <span class="hamburger-icon"></span>
                        </button>
                    </div>
                </div>
                <!-- Mobile Navigation (hidden by default, toggled by JS) -->
                <nav class="nav--mobile" aria-label="Mobile navigation">
                    <ul class="nav__list">
                        <li class="nav__item"><a href="index.html">Home</a></li>
                        <li class="nav__item"><a href="products.html">Products</a></li>
                        <li class="nav__item"><a href="gallery.html">Gallery</a></li>
                        <li class="nav__item"><a href="about.html">About</a></li>
                        <li class="nav__item"><a href="custom-orders.html">Custom Orders</a></li>
                        <li class="nav__item"><a href="contact.html">Contact</a></li>
                    </ul>
                </nav>
            </header>
        `;

        const headerRoot = document.getElementById('header-root');
        if (headerRoot) {
            headerRoot.innerHTML = headerHtml;
            setActiveNavLink(); // Set active class after header is rendered
            setupMobileNavToggle(); // Setup toggle after header is rendered
        }
    }

    // Function to set the active navigation link
    function setActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop(); // Get filename (e.g., "index.html")
        const navLinks = document.querySelectorAll('.nav__list a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active'); // Ensure only one is active
            }
        });
    }

    // Function to set up mobile navigation toggle
    function setupMobileNavToggle() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileNav = document.querySelector('.nav--mobile');

        if (navToggle && mobileNav) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                mobileNav.classList.toggle('is-open');
            });

            // Close mobile nav when a link is clicked (optional, but good UX)
            mobileNav.querySelectorAll('.nav__item a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.setAttribute('aria-expanded', 'false');
                    mobileNav.classList.remove('is-open');
                });
            });
        }
    }

    renderHeader(); // Call renderHeader on DOMContentLoaded
});