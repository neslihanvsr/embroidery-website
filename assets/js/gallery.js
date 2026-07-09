document.addEventListener('DOMContentLoaded', async () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryFiltersContainer = document.getElementById('gallery-filters');
    let allGalleryItems = []; // Store all items for filtering
    let allCategories = []; // Store all categories for filter buttons

    if (!galleryGrid || !galleryFiltersContainer) {
        console.warn('Gallery grid or filters container not found. Skipping gallery script.');
        return;
    }

    /**
     * Fetches JSON data from a given path.
     * @param {string} path - The path to the JSON file.
     * @returns {Promise<Array>} A promise that resolves with the JSON data.
     */
    async function fetchData(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data from ${path}:`, error);
            return [];
        }
    }

    /**
     * Creates an HTML string for a single gallery item card.
     * @param {Object} item - The gallery item data object.
     * @returns {string} The HTML string for the gallery item card.
     */
    function createGalleryCard(item) {
        const categoryMeta = allCategories.find(cat => cat.id === item.category);
        const categoryLabel = categoryMeta ? categoryMeta.label : item.category;
        const categoryClass = `category-badge--${item.category}`;
        // Construct image path based on project structure
        const imagePath = `assets/images/gallery/${item.category}/${item.image}`;

        return `
            <div class="gallery-card">
                <img src="${imagePath}" alt="${item.name}" class="gallery-card__image" loading="lazy">
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
        galleryGrid.innerHTML = ''; // Clear existing items
        if (itemsToRender.length === 0) {
            galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No items found for this category.</p>';
            return;
        }
        itemsToRender.forEach(item => {
            galleryGrid.insertAdjacentHTML('beforeend', createGalleryCard(item));
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

    // Initialize gallery
    async function initGallery() {
        allCategories = await fetchData('content/categories.json');
        allGalleryItems = await fetchData('content/gallery-items.json');

        if (allGalleryItems.length === 0) {
            galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--color-accent-terracotta);">Failed to load gallery items. Please try again later.</p>';
            return;
        }

        renderFilterButtons();
        renderGalleryItems(allGalleryItems); // Display all items initially
    }

    initGallery();
});