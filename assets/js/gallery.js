import { fetchData } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => { 
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryFiltersContainer = document.getElementById('gallery-filters');
    let allGalleryItems = []; // Store all items for filtering
    let allCategories = [];   // Store all categories for filter buttons

    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox__image');
    const lightboxCaptionTitle = document.querySelector('.lightbox__caption-title');
    const lightboxCaptionDescription = document.querySelector('.lightbox__caption-description');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxPrev = document.querySelector('.lightbox__prev');
    const lightboxNext = document.querySelector('.lightbox__next');
    let currentFilteredItems = []; // Store items currently displayed in the grid
    let currentLightboxIndex = 0;  // Index of the currently viewed image in the lightbox

    let previouslyFocusedElement = null; // To store the element that opened the lightbox
    let focusableElementsInLightbox = []; // To store focusable elements within the lightbox

    if (!galleryGrid || !galleryFiltersContainer) {
        console.warn('Gallery grid or filters container not found. Skipping gallery script.');
        return;
    }

    /**
     * Creates an HTML string for a single gallery item card.
     * @param {Object} item - The gallery item data object.
     * @returns {string} The HTML string for the gallery item card.
     */
    function createGalleryCard(item, index) {
        const categoryMeta = allCategories.find(cat => cat.id === item.category);
        const categoryLabel = categoryMeta ? categoryMeta.label : item.category;
        const categoryClass = `category-badge--${item.category}`; // This assumes item.category is always present
        // item.imagePath now contains the full, resolved path

        return ` 
            <div class="gallery-card" data-item-index="${index}"> 
                <img src="${item.imagePath}" alt="${item.name}" class="gallery-card__image" loading="lazy" width="200" height="200">
                <div class="gallery-card__content">
                    <span class="category-badge ${categoryClass} gallery-card__category">${categoryLabel}</span>
                    <h3 class="gallery-card__title">${item.name}</h3>
                    ${item.description ? `<p class="gallery-card__description">${item.description}</p>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renders gallery items to the DOM.
     * @param {Array} itemsToRender - The array of gallery items to display.
     */
    function renderGalleryItems(itemsToRender) {
        currentFilteredItems = itemsToRender; // Update the currently filtered items
        galleryGrid.innerHTML = ''; // Clear existing items
        if (itemsToRender.length === 0) {
            galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No items found for this category.</p>';
            return;
        }
        itemsToRender.forEach((item, index) => {
            galleryGrid.insertAdjacentHTML('beforeend', createGalleryCard(item, index));
        });
        // Attach click listeners to the newly rendered gallery cards
        galleryGrid.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('click', () => openLightbox(parseInt(card.dataset.itemIndex)));
        });
    }

    /**
     * Renders filter buttons based on available categories.
     */
    function renderFilterButtons() {
        galleryFiltersContainer.innerHTML = ''; // Clear existing buttons

        // Add "All" button
        const allButton = document.createElement('button');
        allButton.classList.add('tag', 'filter-button', 'active'); // 'active' by default
        allButton.textContent = 'All';
        allButton.dataset.category = 'all';
        galleryFiltersContainer.appendChild(allButton);

        // Add category buttons
        allCategories.forEach(category => {
            const button = document.createElement('button');
            button.classList.add('tag', 'filter-button', `category-badge--${category.id}`);
            button.textContent = category.label;
            button.dataset.category = category.id;
            galleryFiltersContainer.appendChild(button);
        });

        // Attach event listeners to filter buttons
        galleryFiltersContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('filter-button')) {
                // Remove active class from all buttons
                galleryFiltersContainer.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                target.classList.add('active');

                const selectedCategory = target.dataset.category;
                filterGallery(selectedCategory);
            }
        });
    }

    /**
     * Filters and re-renders the gallery based on the selected category.
     * @param {string} categoryId - The ID of the selected category, or 'all'.
     */
    function filterGallery(categoryId) {
        let filteredItems = (categoryId === 'all') ? allGalleryItems : allGalleryItems.filter(item => item.category === categoryId);
        renderGalleryItems(filteredItems);
    }

    /**
     * Opens the lightbox with the specified image.
     * @param {number} index - The index of the image in the currentFilteredItems array.
     */
    function openLightbox(index) {
        if (index < 0 || index >= currentFilteredItems.length) {
            return; // Invalid index
        }

        // Store the element that was focused before opening the lightbox
        previouslyFocusedElement = document.activeElement;

        // Update current image and caption
        currentLightboxIndex = index;
        const item = currentFilteredItems[currentLightboxIndex];
        lightboxImage.src = item.imagePath; // item.imagePath is already the full path
        lightboxImage.alt = item.name;
        lightboxCaptionTitle.textContent = item.name; // Title for the lightbox
        lightboxCaptionDescription.textContent = item.caption || item.description || ''; // Prioritize specific caption, then main description

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false'); // Make lightbox visible to AT

        // Find all focusable elements within the lightbox
        focusableElementsInLightbox = Array.from(
            lightbox.querySelectorAll(
                'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
            )
        ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0); // Filter out hidden elements

        // Set initial focus to the close button
        if (lightboxClose) {
            lightboxClose.focus();
        }

        // Add event listener for focus trapping
        lightbox.addEventListener('keydown', trapLightboxFocus);
        updateLightboxNavButtons();
    }

    /**
     * Traps keyboard focus within the lightbox.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    function trapLightboxFocus(event) {
        if (event.key === 'Tab' && focusableElementsInLightbox.length > 0) {
            const firstFocusable = focusableElementsInLightbox[0];
            const lastFocusable = focusableElementsInLightbox[focusableElementsInLightbox.length - 1];

            if (event.shiftKey && document.activeElement === firstFocusable) {
                lastFocusable.focus();
                event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                firstFocusable.focus();
                event.preventDefault();
            }
        }
    }

    /**
     * Closes the lightbox.
     */
    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true'); // Hide lightbox from AT

        // Clear image src to prevent loading in background
        lightboxImage.src = '';
        lightboxImage.alt = '';
        lightboxCaptionTitle.textContent = '';
        lightboxCaptionDescription.textContent = '';

        // Remove focus trap listener
        lightbox.removeEventListener('keydown', trapLightboxFocus);
        // Return focus to the element that opened the lightbox
        if (previouslyFocusedElement) previouslyFocusedElement.focus();
    }

    /**
     * Shows the next image in the lightbox.
     */
    function showNextImage() {
        if (currentLightboxIndex < currentFilteredItems.length - 1) {
            openLightbox(currentLightboxIndex + 1);
        }
    }

    /**
     * Shows the previous image in the lightbox.
     */
    function showPrevImage() {
        if (currentLightboxIndex > 0) {
            openLightbox(currentLightboxIndex - 1);
        }
    }

    /**
     * Updates the visibility of lightbox navigation buttons.
     */
    function updateLightboxNavButtons() {
        lightboxPrev.classList.toggle('is-hidden', currentLightboxIndex === 0);
        lightboxNext.classList.toggle('is-hidden', currentLightboxIndex === currentFilteredItems.length - 1);
    }

    // Lightbox event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    // Close lightbox when clicking on the overlay itself (but not the image/buttons)
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (lightbox.classList.contains('is-open')) {
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    // Initialize gallery
    async function initGallery() {
        allCategories = await fetchData('content/categories.json');
    const productsData = await fetchData('content/products.json');
    const galleryItemsData = await fetchData('content/gallery-items.json');

    const productsMap = new Map(productsData.map(product => [product.id, product])); // For quick product lookup
    const galleryItemsMap = new Map(); // To store gallery items by their ID for easy lookup/update

    allGalleryItems = []; // This will be the final merged list of gallery items

    // 1. Add all products from products.json to the gallery first
    productsData.forEach(product => {
        const galleryItem = {
            id: product.id, // Use product ID as the gallery item ID for products
            name: product.name,
            category: product.category,
            description: product.description,
            caption: product.description, // Default caption from product description
            imagePath: product.image // Directly use the full path from products.json
        };
        allGalleryItems.push(galleryItem);
        galleryItemsMap.set(galleryItem.id, galleryItem); // Store for potential caption updates
    });

    // 2. Process gallery-items.json
    galleryItemsData.forEach(item => {
        if (item.productId) {
            // This gallery item refers to an existing product.
            const product = productsMap.get(item.productId);
            if (product) {
                // Find the already added gallery item for this product (using its product.id)
                const existingGalleryItem = galleryItemsMap.get(product.id);
                if (existingGalleryItem) {
                    // If galleryItem has a specific caption, use it to override the default
                    if (item.caption) {
                        existingGalleryItem.caption = item.caption;
                    }
                    // imagePath, name, category, description are already correctly set from products.json
                } else {
                    console.warn(`Gallery item ${item.id} references product ${item.productId} which was not found in the initial products load. This should not happen if all products are loaded first.`);
                }
            } else {
                console.warn(`Gallery item ${item.id} references missing product: ${item.productId}.`);
            }
        } else {
            // This is a gallery-exclusive item (no productId).
            // Add it as a new entry. Ensure its ID doesn't conflict with an existing product ID.
            if (!galleryItemsMap.has(item.id)) {
                const galleryExclusiveItem = {
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    description: item.description || "",
                    caption: item.caption || item.description || "",
                    imagePath: `assets/images/gallery/${item.category}/${item.image}` // Path for gallery-exclusive images
                };
                allGalleryItems.push(galleryExclusiveItem);
                galleryItemsMap.set(galleryExclusiveItem.id, galleryExclusiveItem);
            } else {
                console.warn(`Gallery exclusive item ${item.id} has an ID conflicting with an existing product ID. Skipping.`);
            }
        }
    });

    renderFilterButtons();
    
    // Check for URL category parameter and filter accordingly
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        // Filter by the requested category and activate the corresponding filter button
        filterGallery(categoryParam);
        // Set the filter button as active
        setTimeout(() => {
            const filterButton = galleryFiltersContainer.querySelector('[data-category="' + categoryParam + '"]');
            if (filterButton) {
                galleryFiltersContainer.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
                filterButton.classList.add('active');
            }
        }, 0);
    } else {
        renderGalleryItems(allGalleryItems);
    }
}

    initGallery();
});