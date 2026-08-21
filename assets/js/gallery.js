import {
    fetchData,
    getTranslation,
    getStoredLanguage,
    loadTranslations
} from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {

    // ------------------------------------------------------------
    // Load current language before rendering gallery
    // ------------------------------------------------------------

    await loadTranslations(
        getStoredLanguage()
    );

    const galleryGrid =
        document.getElementById('gallery-grid');

    const galleryFiltersContainer =
        document.getElementById('gallery-filters');

    let allGalleryItems = [];
    let allCategories = [];

    // ------------------------------------------------------------
    // Lightbox elements
    // ------------------------------------------------------------

    const lightbox =
        document.getElementById('lightbox');

    const lightboxImage =
        document.querySelector('.lightbox__image');

    const lightboxCaptionTitle =
        document.querySelector(
            '.lightbox__caption-title'
        );

    const lightboxCaptionDescription =
        document.querySelector(
            '.lightbox__caption-description'
        );

    const lightboxClose =
        document.querySelector('.lightbox__close');

    const lightboxPrev =
        document.querySelector('.lightbox__prev');

    const lightboxNext =
        document.querySelector('.lightbox__next');

    let currentFilteredItems = [];
    let currentProductIndex = 0;
    let currentImageIndex = 0;

    let previouslyFocusedElement = null;
    let focusableElementsInLightbox = [];

    if (
        !galleryGrid ||
        !galleryFiltersContainer ||
        !lightbox
    ) {
        console.warn(
            'Gallery elements not found.'
        );
        return;
    }

    // ------------------------------------------------------------
    // Localization helper
    // ------------------------------------------------------------

    function t(key, fallback = '') {
        return getTranslation(
            key,
            fallback
        );
    }

    // ------------------------------------------------------------
    // Gallery card
    // ------------------------------------------------------------

    function createGalleryCard(
        item,
        productIndex
    ) {

        const categoryMeta =
            allCategories.find(
                category =>
                    category.id ===
                    item.category
            );

        const categoryLabel =
            categoryMeta
                ? getTranslation(
                    `category.label.${categoryMeta.id}`,
                    categoryMeta.label
                )
                : item.category || '';

        const categoryClass =
            item.category
                ? `category-badge--${item.category}`
                : '';

        // --------------------------------------------------------
        // Localized product name
        // --------------------------------------------------------

        const localizedName =
            getTranslation(
                `product.name.${item.id}`,
                item.name || ''
            );

        // --------------------------------------------------------
        // Localized gallery description
        // --------------------------------------------------------

        const localizedDescription =
            item.galleryLocalizationKey
                ? getTranslation(
                    `gallery.caption.${item.galleryLocalizationKey}`,
                    item.description || ''
                )
                : item.description || '';

        // --------------------------------------------------------
        // Thumbnail
        // --------------------------------------------------------

        const thumbnailImage =
            item.galleryImages &&
            item.galleryImages.length > 0
                ? item.galleryImages[0].src
                : 'assets/images/placeholder.jpg';

        const altText =
            localizedName ||
            t(
                'gallery.galleryItem',
                'Gallery item'
            );

        return `
            <div
                class="gallery-card"
                data-product-index="${productIndex}"
                data-image-index="0"
                tabindex="0"
                role="button"
                aria-label="${t(
                    'gallery.view',
                    'View'
                )} ${altText}"
            >

                <img
                    src="${thumbnailImage}"
                    alt="${altText}"
                    class="gallery-card__image"
                    loading="lazy"
                    width="200"
                    height="200"
                >

                <div class="gallery-card__content">

                    ${
                        categoryLabel
                            ? `
                                <span
                                    class="category-badge ${categoryClass} gallery-card__category"
                                >
                                    ${categoryLabel}
                                </span>
                            `
                            : ''
                    }

                    <h3 class="gallery-card__title">
                        ${localizedName}
                    </h3>

                    ${
                        localizedDescription
                            ? `
                                <p class="gallery-card__description">
                                    ${localizedDescription}
                                </p>
                            `
                            : ''
                    }

                </div>
            </div>
        `;
    }

    // ------------------------------------------------------------
    // Render gallery
    // ------------------------------------------------------------

    function renderGalleryItems(
        itemsToRender
    ) {

        currentFilteredItems =
            itemsToRender;

        galleryGrid.innerHTML = '';

        if (
            itemsToRender.length === 0
        ) {

            galleryGrid.innerHTML = `
                <p
                    class="text-center"
                    style="grid-column: 1 / -1;"
                >
                    ${t(
                        'gallery.noItems',
                        'No items found for this category.'
                    )}
                </p>
            `;

            return;
        }

        itemsToRender.forEach(
            (item, productIndex) => {

                galleryGrid.insertAdjacentHTML(
                    'beforeend',
                    createGalleryCard(
                        item,
                        productIndex
                    )
                );
            }
        );

        // --------------------------------------------------------
        // Thumbnail error handling
        // --------------------------------------------------------

        galleryGrid
            .querySelectorAll(
                '.gallery-card__image'
            )
            .forEach(image => {

                image.addEventListener(
                    'error',
                    () => {

                        if (
                            image.src.includes(
                                'placeholder.jpg'
                            )
                        ) {
                            return;
                        }

                        image.src =
                            'assets/images/placeholder.jpg';

                    },
                    {
                        once: true
                    }
                );
            });
    }

    // ------------------------------------------------------------
    // Gallery card click
    // ------------------------------------------------------------

    galleryGrid.addEventListener(
        'click',
        event => {

            const card =
                event.target.closest(
                    '.gallery-card'
                );

            if (
                !card ||
                !galleryGrid.contains(card)
            ) {
                return;
            }

            event.preventDefault();

            const productIndex =
                Number(
                    card.dataset.productIndex
                );

            const imageIndex =
                Number(
                    card.dataset.imageIndex || 0
                );

            if (
                Number.isNaN(
                    productIndex
                )
            ) {
                return;
            }

            openLightbox(
                productIndex,
                Number.isNaN(imageIndex)
                    ? 0
                    : imageIndex
            );
        }
    );

    // ------------------------------------------------------------
    // Gallery keyboard interaction
    // ------------------------------------------------------------

    galleryGrid.addEventListener(
        'keydown',
        event => {

            const card =
                event.target.closest(
                    '.gallery-card'
                );

            if (
                !card ||
                !galleryGrid.contains(card)
            ) {
                return;
            }

            if (
                event.key !== 'Enter' &&
                event.key !== ' '
            ) {
                return;
            }

            event.preventDefault();

            const productIndex =
                Number(
                    card.dataset.productIndex
                );

            const imageIndex =
                Number(
                    card.dataset.imageIndex || 0
                );

            if (
                Number.isNaN(
                    productIndex
                )
            ) {
                return;
            }

            openLightbox(
                productIndex,
                Number.isNaN(imageIndex)
                    ? 0
                    : imageIndex
            );
        }
    );

    // ------------------------------------------------------------
    // Filter buttons
    // ------------------------------------------------------------

    function renderFilterButtons() {

        galleryFiltersContainer.innerHTML =
            '';

        // --------------------------------------------------------
        // All button
        // --------------------------------------------------------

        const allButton =
            document.createElement(
                'button'
            );

        allButton.classList.add(
            'tag',
            'filter-button',
            'active'
        );

        allButton.textContent =
            getTranslation(
                'gallery.filterAll',
                'All'
            );

        allButton.dataset.category =
            'all';

        galleryFiltersContainer.appendChild(
            allButton
        );

        // --------------------------------------------------------
        // Category buttons
        // --------------------------------------------------------

        allCategories.forEach(
            category => {

                const button =
                    document.createElement(
                        'button'
                    );

                button.classList.add(
                    'tag',
                    'filter-button',
                    `category-badge--${category.id}`
                );

                button.textContent =
                    getTranslation(
                        `category.label.${category.id}`,
                        category.label
                    );

                button.dataset.category =
                    category.id;

                galleryFiltersContainer.appendChild(
                    button
                );
            }
        );
    }

    // ------------------------------------------------------------
    // Filter click
    // ------------------------------------------------------------

    galleryFiltersContainer.addEventListener(
        'click',
        event => {

            const target =
                event.target.closest(
                    '.filter-button'
                );

            if (!target) {
                return;
            }

            galleryFiltersContainer
                .querySelectorAll(
                    '.filter-button'
                )
                .forEach(button => {

                    button.classList.remove(
                        'active'
                    );
                });

            target.classList.add(
                'active'
            );

            filterGallery(
                target.dataset.category
            );
        }
    );

    // ------------------------------------------------------------
    // Filtering
    // ------------------------------------------------------------

    function filterGallery(
        categoryId
    ) {

        const filteredItems =
            categoryId === 'all'
                ? allGalleryItems
                : allGalleryItems.filter(
                    item =>
                        item.category ===
                        categoryId
                );

        renderGalleryItems(
            filteredItems
        );
    }

    // ------------------------------------------------------------
    // Open lightbox
    // ------------------------------------------------------------

    function openLightbox(
        productIndex,
        imageIndex = 0
    ) {

        if (
            productIndex < 0 ||
            productIndex >=
                currentFilteredItems.length
        ) {
            return;
        }

        const item =
            currentFilteredItems[
                productIndex
            ];

        if (
            !item ||
            !item.galleryImages ||
            item.galleryImages.length === 0
        ) {
            return;
        }

        if (
            imageIndex < 0 ||
            imageIndex >=
                item.galleryImages.length
        ) {
            imageIndex = 0;
        }

        previouslyFocusedElement =
            document.activeElement;

        currentProductIndex =
            productIndex;

        currentImageIndex =
            imageIndex;

        updateLightboxContent();

        lightbox.classList.add(
            'is-open'
        );

        lightbox.setAttribute(
            'aria-hidden',
            'false'
        );

        document.body.classList.add(
            'lightbox-open'
        );

        updateLightboxNavButtons();

        updateFocusableElements();

        if (lightboxClose) {
            lightboxClose.focus();
        }

        lightbox.removeEventListener(
            'keydown',
            trapLightboxFocus
        );

        lightbox.addEventListener(
            'keydown',
            trapLightboxFocus
        );
    }

    // ------------------------------------------------------------
    // Update lightbox content
    // ------------------------------------------------------------

    function updateLightboxContent() {

        const item =
            currentFilteredItems[
                currentProductIndex
            ];

        if (
            !item ||
            !item.galleryImages ||
            !item.galleryImages[
                currentImageIndex
            ]
        ) {
            return;
        }

        const currentImage =
            item.galleryImages[
                currentImageIndex
            ];

        // --------------------------------------------------------
        // Localized product name
        // --------------------------------------------------------

        const localizedName =
            getTranslation(
                `product.name.${item.id}`,
                item.name || ''
            );

        // --------------------------------------------------------
        // Localized gallery caption
        // --------------------------------------------------------

        const localizedCaption =
            item.galleryLocalizationKey
                ? getTranslation(
                    `gallery.caption.${item.galleryLocalizationKey}`,
                    currentImage.caption ||
                    item.description ||
                    ''
                )
                : (
                    currentImage.caption ||
                    item.description ||
                    ''
                );

        // --------------------------------------------------------
        // Image
        // --------------------------------------------------------

        lightboxImage.src =
            currentImage.src;

        lightboxImage.alt =
            localizedName ||
            t(
                'gallery.galleryImage',
                'Gallery image'
            );

        // --------------------------------------------------------
        // Caption
        // --------------------------------------------------------

        lightboxCaptionTitle.textContent =
            localizedName;

        lightboxCaptionDescription.textContent =
            localizedCaption;
    }

    // ------------------------------------------------------------
    // Invalid image
    // ------------------------------------------------------------

    lightboxImage.addEventListener(
        'error',
        () => {

            const item =
                currentFilteredItems[
                    currentProductIndex
                ];

            if (
                !item ||
                !item.galleryImages ||
                !item.galleryImages[
                    currentImageIndex
                ]
            ) {
                return;
            }

            const failedImage =
                item.galleryImages[
                    currentImageIndex
                ];

            if (
                failedImage.src &&
                failedImage.src.includes(
                    'placeholder.jpg'
                )
            ) {
                return;
            }

            item.galleryImages.splice(
                currentImageIndex,
                1
            );

            if (
                item.galleryImages.length === 0
            ) {

                closeLightbox();

                return;
            }

            if (
                currentImageIndex >=
                item.galleryImages.length
            ) {

                currentImageIndex =
                    item.galleryImages.length - 1;
            }

            updateLightboxContent();
            updateLightboxNavButtons();
        }
    );

    // ------------------------------------------------------------
    // Focusable elements
    // ------------------------------------------------------------

    function updateFocusableElements() {

        focusableElementsInLightbox =
            Array.from(
                lightbox.querySelectorAll(
                    'button:not([disabled]), ' +
                    '[href]:not([disabled]), ' +
                    'input:not([disabled]), ' +
                    'select:not([disabled]), ' +
                    'textarea:not([disabled]), ' +
                    '[tabindex]:not([tabindex="-1"]):not([disabled])'
                )
            ).filter(
                element =>
                    element.offsetWidth > 0 ||
                    element.offsetHeight > 0 ||
                    element.getClientRects()
                        .length > 0
            );
    }

    // ------------------------------------------------------------
    // Focus trap
    // ------------------------------------------------------------

    function trapLightboxFocus(
        event
    ) {

        if (
            event.key !== 'Tab' ||
            focusableElementsInLightbox.length === 0
        ) {
            return;
        }

        const firstFocusable =
            focusableElementsInLightbox[0];

        const lastFocusable =
            focusableElementsInLightbox[
                focusableElementsInLightbox.length - 1
            ];

        if (
            event.shiftKey &&
            document.activeElement ===
                firstFocusable
        ) {

            event.preventDefault();

            lastFocusable.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement ===
                lastFocusable
        ) {

            event.preventDefault();

            firstFocusable.focus();
        }
    }

    // ------------------------------------------------------------
    // Close lightbox
    // ------------------------------------------------------------

    function closeLightbox() {

        lightbox.classList.remove(
            'is-open'
        );

        lightbox.setAttribute(
            'aria-hidden',
            'true'
        );

        document.body.classList.remove(
            'lightbox-open'
        );

        lightboxImage.removeAttribute(
            'src'
        );

        lightboxImage.alt = '';

        lightboxCaptionTitle.textContent =
            '';

        lightboxCaptionDescription.textContent =
            '';

        lightbox.removeEventListener(
            'keydown',
            trapLightboxFocus
        );

        if (
            previouslyFocusedElement &&
            typeof previouslyFocusedElement.focus ===
                'function'
        ) {

            previouslyFocusedElement.focus();
        }

        previouslyFocusedElement = null;
    }

    // ------------------------------------------------------------
    // Next image
    // ------------------------------------------------------------

    function showNextImage() {

        const item =
            currentFilteredItems[
                currentProductIndex
            ];

        if (!item) {
            return;
        }

        if (
            currentImageIndex <
            item.galleryImages.length - 1
        ) {

            currentImageIndex++;

            updateLightboxContent();

            updateLightboxNavButtons();
        }
    }

    // ------------------------------------------------------------
    // Previous image
    // ------------------------------------------------------------

    function showPrevImage() {

        const item =
            currentFilteredItems[
                currentProductIndex
            ];

        if (!item) {
            return;
        }

        if (
            currentImageIndex > 0
        ) {

            currentImageIndex--;

            updateLightboxContent();

            updateLightboxNavButtons();
        }
    }

    // ------------------------------------------------------------
    // Navigation buttons
    // ------------------------------------------------------------

    function updateLightboxNavButtons() {

        const item =
            currentFilteredItems[
                currentProductIndex
            ];

        if (!item) {
            return;
        }

        const imageCount =
            item.galleryImages.length;

        lightboxPrev.classList.toggle(
            'is-hidden',
            imageCount <= 1 ||
            currentImageIndex === 0
        );

        lightboxNext.classList.toggle(
            'is-hidden',
            imageCount <= 1 ||
            currentImageIndex ===
                imageCount - 1
        );
    }

    // ------------------------------------------------------------
    // Lightbox buttons
    // ------------------------------------------------------------

    if (lightboxClose) {

        lightboxClose.addEventListener(
            'click',
            event => {

                event.preventDefault();
                event.stopPropagation();

                closeLightbox();
            }
        );
    }

    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            'click',
            event => {

                event.preventDefault();
                event.stopPropagation();

                showPrevImage();
            }
        );
    }

    if (lightboxNext) {

        lightboxNext.addEventListener(
            'click',
            event => {

                event.preventDefault();
                event.stopPropagation();

                showNextImage();
            }
        );
    }

    // ------------------------------------------------------------
    // Click outside lightbox
    // ------------------------------------------------------------

    lightbox.addEventListener(
        'click',
        event => {

            if (
                event.target === lightbox
            ) {
                closeLightbox();
            }
        }
    );

    // ------------------------------------------------------------
    // Keyboard controls
    // ------------------------------------------------------------

    document.addEventListener(
        'keydown',
        event => {

            if (
                !lightbox.classList.contains(
                    'is-open'
                )
            ) {
                return;
            }

            if (
                event.key === 'Escape'
            ) {

                event.preventDefault();

                closeLightbox();

                return;
            }

            if (
                event.key === 'ArrowLeft'
            ) {

                event.preventDefault();

                showPrevImage();

                return;
            }

            if (
                event.key === 'ArrowRight'
            ) {

                event.preventDefault();

                showNextImage();
            }
        }
    );

    // ------------------------------------------------------------
    // Re-render when language changes
    // ------------------------------------------------------------

    document.addEventListener(
        'languageChanged',
        () => {

            renderFilterButtons();

            renderGalleryItems(
                currentFilteredItems
            );

            if (
                lightbox.classList.contains(
                    'is-open'
                )
            ) {

                updateLightboxContent();

                updateLightboxNavButtons();
            }
        }
    );

    // ------------------------------------------------------------
    // Initialize gallery
    // ------------------------------------------------------------

    async function initGallery() {

        try {

            allCategories =
                await fetchData(
                    'content/categories.json'
                );

            const productsData =
                await fetchData(
                    'content/products.json'
                );

            const galleryItemsData =
                await fetchData(
                    'content/gallery-items.json'
                );

            const productGroups =
                new Map();

            // ----------------------------------------------------
            // Create product groups
            // ----------------------------------------------------

            productsData.forEach(
                product => {

                    productGroups.set(
                        product.id,
                        {
                            id: product.id,

                            name: product.name,

                            category:
                                product.category,

                            description:
                                product.description ||
                                '',

                            galleryLocalizationKey:
                                null,

                            galleryImages: []
                        }
                    );
                }
            );

            // ----------------------------------------------------
            // Add gallery images
            // ----------------------------------------------------

            galleryItemsData.forEach(
                galleryItem => {

                    const productId =
                        galleryItem.productId;

                    if (
                        productId &&
                        productGroups.has(
                            productId
                        )
                    ) {

                        const productGroup =
                            productGroups.get(
                                productId
                            );

                        // ------------------------------------------------
                        // Store localization key
                        // ------------------------------------------------

                        if (
                            !productGroup.galleryLocalizationKey &&
                            galleryItem.id
                        ) {

                            productGroup.galleryLocalizationKey =
                                galleryItem.id;
                        }

                        const product =
                            productsData.find(
                                item =>
                                    item.id ===
                                    productId
                            );

                        const imageSrc =
                            galleryItem.image ||
                            product?.image ||
                            'assets/images/placeholder.jpg';

                        const alreadyExists =
                            productGroup.galleryImages.some(
                                image =>
                                    image.src ===
                                    imageSrc
                            );

                        if (
                            !alreadyExists
                        ) {

                            productGroup.galleryImages.push(
                                {
                                    src:
                                        imageSrc,

                                    caption:
                                        galleryItem.caption ||
                                        productGroup.description ||
                                        ''
                                }
                            );
                        }

                        return;
                    }

                    // ------------------------------------------------
                    // Gallery-only item
                    // ------------------------------------------------

                    const standaloneId =
                        galleryItem.id;

                    if (
                        !productGroups.has(
                            standaloneId
                        )
                    ) {

                        const standaloneImage =
                            galleryItem.image ||
                            'assets/images/placeholder.jpg';

                        productGroups.set(
                            standaloneId,
                            {
                                id:
                                    standaloneId,

                                name:
                                    galleryItem.name ||
                                    `Gallery Item: ${galleryItem.id}`,

                                category:
                                    galleryItem.category ||
                                    'unknown',

                                description:
                                    galleryItem.description ||
                                    galleryItem.caption ||
                                    '',

                                galleryLocalizationKey:
                                    galleryItem.id ||
                                    null,

                                galleryImages: [
                                    {
                                        src:
                                            standaloneImage,

                                        caption:
                                            galleryItem.caption ||
                                            galleryItem.description ||
                                            ''
                                    }
                                ]
                            }
                        );
                    }
                }
            );

            // ----------------------------------------------------
            // Ensure every product has an image
            // ----------------------------------------------------

            allGalleryItems =
                Array.from(
                    productGroups.values()
                ).map(
                    product => {

                        if (
                            product.galleryImages
                                .length === 0
                        ) {

                            const sourceProduct =
                                productsData.find(
                                    item =>
                                        item.id ===
                                        product.id
                                );

                            if (
                                sourceProduct?.image
                            ) {

                                product.galleryImages.push(
                                    {
                                        src:
                                            sourceProduct.image,

                                        caption:
                                            product.description ||
                                            ''
                                    }
                                );

                            } else {

                                product.galleryImages.push(
                                    {
                                        src:
                                            'assets/images/placeholder.jpg',

                                        caption:
                                            product.description ||
                                            ''
                                    }
                                );
                            }
                        }

                        return product;
                    }
                );

            // ----------------------------------------------------
            // Render filters
            // ----------------------------------------------------

            renderFilterButtons();

            // ----------------------------------------------------
            // URL category filtering
            // ----------------------------------------------------

            const urlParams =
                new URLSearchParams(
                    window.location.search
                );

            const categoryParam =
                urlParams.get(
                    'category'
                );

            if (categoryParam) {

                filterGallery(
                    categoryParam
                );

                const filterButton =
                    galleryFiltersContainer.querySelector(
                        `[data-category="${categoryParam}"]`
                    );

                if (filterButton) {

                    galleryFiltersContainer
                        .querySelectorAll(
                            '.filter-button'
                        )
                        .forEach(
                            button => {

                                button.classList.remove(
                                    'active'
                                );
                            }
                        );

                    filterButton.classList.add(
                        'active'
                    );
                }

            } else {

                renderGalleryItems(
                    allGalleryItems
                );
            }

        } catch (error) {

            console.error(
                'Failed to initialize gallery:',
                error
            );

            galleryGrid.innerHTML = `
                <p
                    class="text-center"
                    style="grid-column: 1 / -1;"
                >
                    ${t(
                        'gallery.loadError',
                        'Unable to load gallery items.'
                    )}
                </p>
            `;
        }
    }

    initGallery();
});