import { fetchData } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = document.getElementById('product-grid');

    if (!productGrid) {
        // This script is intended for products.html, which has #product-grid
        // If it's not found, we're likely on a different page, so do nothing.
        return;
    }

    const allCategories = await fetchData('content/categories.json');

    /**
     * Creates an HTML string for a single product card.
     * @param {Object} product - The product data object.
     * @returns {string} The HTML string for the product card.
     */
    function createProductCard(product) {
        const categoryMeta = allCategories.find(cat => cat.id === product.category);
        const categoryLabel = categoryMeta ? categoryMeta.label : product.category;
        const categoryClass = `category-badge--${product.category}`;

        return `
            <div class="product-card"> 
                <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
                <div class="product-card__content">
                    <span class="category-badge ${categoryClass} product-card__category">${categoryLabel}</span>
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__price">${product.price}</p> 
                    <a href="${product.shopierUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary product-card__button">Shop on Shopier</a>
                </div>
            </div>
        `;
    }

    // Initialize product rendering
    fetchData('content/products.json')
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