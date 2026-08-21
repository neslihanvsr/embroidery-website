/**
 * home.js
 *
 * Handles dynamic content loading for the homepage, including featured products
 * and category preview cards, driven by JSON data.
 */

import { fetchData, getTranslation } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const categoryPreviewContainer = document.getElementById('category-preview-container');

    if (!featuredProductsContainer || !categoryPreviewContainer) {
        console.warn('Homepage containers not found. Skipping homepage dynamic content script.');
        return;
    }

    let allCategories = []; // To store categories for preview cards
    let allProducts = [];   // To store all products for re-rendering on language change

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
        const buyButtonText = getTranslation('productCard.buyButton', 'Buy on Shopier');

        return `
            <div class="product-card">
                <img src="${product.image}" alt="${productName}" class="product-card__image" loading="lazy" width="200" height="200">
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
     * Creates an HTML string for a single category preview card.
     * @param {Object} category - The category data object.
     * @param {Array} products - All product data to find a matching image.
     * @returns {string} The HTML string for the category card.
     */
    function createCategoryCard(category, products) {
        const categoryLabel = getTranslation(`category.label.${category.id}`, category.label);
        // Find the first product that belongs to this category to use its image
        const matchingProduct = products.find(product => product.category === category.id);
        let categoryImageSrc = '';

        if (matchingProduct && matchingProduct.image) {
            categoryImageSrc = matchingProduct.image;
        } else {
            // Fallback to a generic placeholder if no matching product image is found
            categoryImageSrc = `https://via.placeholder.com/180x180?text=${encodeURIComponent(categoryLabel)}`;
        }
        return `
            <div class="category-card">
                <img src="${categoryImageSrc}" alt="${categoryLabel}" class="category-card__image" loading="lazy">
                <div class="category-card__overlay">
                    <div class="category-card__content">
                        <h3 class="category-card__title">${categoryLabel}</h3>
                        <a href="gallery.html?category=${category.id}" class="category-card__link">Explore →</a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renders featured products on the homepage.
     * @param {Array} products - All product data.
     */
    function renderFeaturedProducts(products) {
        const featuredProducts = products.filter(product => product.featured);
        featuredProductsContainer.innerHTML = ''; // Clear loading message
        if (featuredProducts.length === 0) {
            featuredProductsContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No featured products available.</p>';
            return;
        }
        featuredProducts.forEach(product => {
            featuredProductsContainer.insertAdjacentHTML('beforeend', createProductCard(product));
        });
    }

    /**
     * Renders category preview cards on the homepage.
     * @param {Array} categories - All category data. 
     * @param {Array} products - All product data.
     */
    function renderCategoryPreviews(categories, products) {
        categoryPreviewContainer.innerHTML = ''; // Clear loading message
        if (categories.length === 0) {
            categoryPreviewContainer.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No categories available.</p>';
            return;
        }
        // Display all categories
        categories.forEach(category => {
            categoryPreviewContainer.insertAdjacentHTML('beforeend', createCategoryCard(category, products));
        });
    }

    // Re-render immediately whenever language changes without full page reload
    document.addEventListener('languageChanged', () => {
        if (allProducts.length > 0) {
            renderFeaturedProducts(allProducts);
            renderCategoryPreviews(allCategories, allProducts);
        }
    });

    // Initialize homepage content
    async function initHomepage() {
        try {
            allCategories = await fetchData('content/categories.json');
            allProducts = await fetchData('content/products.json');

            renderFeaturedProducts(allProducts);
            renderCategoryPreviews(allCategories, allProducts);
        } catch (err) {
            console.error('Failed to initialize homepage dynamic content:', err);
        }
    }

    initHomepage();
});