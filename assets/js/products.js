document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

    if (!productGrid) {
        // This script is intended for products.html, which has #product-grid
        // If it's not found, we're likely on a different page, so do nothing.
        return;
    }

    /**
     * Fetches product data from content/products.json.
     * @returns {Promise<Array>} A promise that resolves with an array of product objects.
     */
    async function fetchProducts() {
        try {
            const response = await fetch('content/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error; // Re-throw to be caught by the caller
        }
    }

    /**
     * Creates an HTML string for a single product card.
     * @param {Object} product - The product data object.
     * @returns {string} The HTML string for the product card.
     */
    function createProductCard(product) {
        const categoryClass = `category-badge--${product.category}`;
        const displayCategory = product.category.replace('-', ' & ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        return `
            <div class="product-card"> 
                <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
                <div class="product-card__content">
                    <span class="category-badge ${categoryClass} product-card__category">${displayCategory}</span>
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__price">${product.price}</p>
                    <a href="${product.shopierUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary product-card__button">Buy on Shopier</a>
                </div>
            </div>
        `;
    }

    // Initialize product rendering
    fetchProducts()
        .then(products => {
            productGrid.innerHTML = ''; // Clear "Loading products..."
            products.forEach(product => {
                productGrid.insertAdjacentHTML('beforeend', createProductCard(product));
            });
        })
        .catch(() => {
            productGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: var(--color-accent-terracotta);">Failed to load products. Please try again later.</p>';
        });
});