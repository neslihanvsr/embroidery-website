import { fetchData, getTranslation } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = document.getElementById('product-grid');

    if (!productGrid) {
        // This script is intended for products.html, which has #product-grid
        // If it's not found, we're likely on a different page, so do nothing.
        return;
    }

    let allCategories = [];
    let allProducts = [];

    /**
     * Creates an HTML string for a single product card.
     * @param {Object} product - The product data object.
     * @returns {string} The HTML string for the product card.
     */
    function createProductCard(product) {
        const categoryMeta = allCategories.find(cat => cat.id === product.category);
        const defaultCategoryLabel = categoryMeta ? categoryMeta.label : product.category;
        const categoryLabel = getTranslation(`category.label.${product.category}`, defaultCategoryLabel);
        const categoryClass = `category-badge--${product.category}`;
        const productName = getTranslation(`product.name.${product.id}`, product.name);
        const buyButtonText = getTranslation('productCard.buyButton', 'Shop on Shopier');

        return `
            <div class="product-card"> 
                <img src="${product.image}" alt="${productName}" class="product-card__image" loading="lazy">
                <div class="product-card__content">
                    <span class="category-badge ${categoryClass} product-card__category">${categoryLabel}</span>
                    <h3 class="product-card__title">${productName}</h3>
                    <p class="product-card__price">${product.price}</p> 
                    <a href="${product.shopierUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary product-card__button">${buyButtonText}</a>
                </div>
            </div>
        `;
    }

    /**
     * Renders all product cards into the product grid.
     */
    function renderProducts() {
        if (!allProducts || allProducts.length === 0) return;
        productGrid.innerHTML = '';
        allProducts.forEach(product => {
            productGrid.insertAdjacentHTML('beforeend', createProductCard(product));
        });
    }

    // Re-render immediately whenever language changes without full page reload
    document.addEventListener('languageChanged', () => {
        renderProducts();
    });

    try {
        allCategories = await fetchData('content/categories.json');
        allProducts = await fetchData('content/products.json');
        renderProducts();
    } catch {
        const errorMsg = getTranslation('products.errorMessage', 'Failed to load products. Please try again later.');
        productGrid.innerHTML = `<p class="text-center" style="grid-column: 1 / -1; color: var(--color-accent-terracotta);">${errorMsg}</p>`;
    }
});