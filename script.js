/**
 * MUKU // Slow Living - Curated Marketplace Architecture
 * Secure state machinery driven by Vanilla EcmaScript 6+.
 */

// ==========================================================================
// 1. CURATED SUSTAINABLE PRODUCT DATABASE
// ==========================================================================
const PRODUCT_DATA = [
    {
        id: "muku-v1",
        name: "Hand-Thrown Ceramic Vase",
        category: "Ceramics",
        price: 85.00,
        rating: 4.9,
        reviewsCount: 42,
        image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80"
    },
    {
        id: "muku-t2",
        name: "Organic Flax Linen Throw",
        category: "Textiles",
        price: 120.00,
        rating: 4.8,
        reviewsCount: 61,
        image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&q=80"
    },
    {
        id: "muku-c3",
        name: "Stoneware Matte Mug Set",
        category: "Ceramics",
        price: 48.00,
        rating: 5.0,
        reviewsCount: 19,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80"
    },
    {
        id: "muku-a4",
        name: "Travertine Incense Block",
        category: "Apothecary",
        price: 35.00,
        rating: 4.6,
        reviewsCount: 33,
        image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600&q=80"
    },
    {
        id: "muku-o5",
        name: "Hand-Woven Rattan Basket",
        category: "Organization",
        price: 65.00,
        rating: 4.7,
        reviewsCount: 54,
        image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=600&q=80"
    },
    {
        id: "muku-a6",
        name: "Soy Wax Botanical Candle",
        category: "Apothecary",
        price: 28.00,
        rating: 4.9,
        reviewsCount: 112,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80"
    }
];

// ==========================================================================
// 2. STATE MANAGER
// ==========================================================================
let storeState = {
    products: [...PRODUCT_DATA],
    cart: [],
    filters: {
        category: 'all',
        sort: 'default'
    },
    taxRate: 0.08,        // 8% Structural Assessment Fee
    appliedDiscount: 0.0  // Tracks active promo percentage (e.g., 0.10 for 10%)
};

// ==========================================================================
// 3. DOM INTERFACE SELECTORS CACHE
// ==========================================================================
const DOM = {
    productGrid: document.getElementById('productGrid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sort-select'),
    cartToggle: document.getElementById('cartToggle'),
    cartClose: document.getElementById('cartClose'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartOverlay: document.getElementById('cartOverlay'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartBadge: document.getElementById('cartBadge'),
    cartCountHeader: document.getElementById('cartCountHeader'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTax: document.getElementById('cartTax'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    currentYear: document.getElementById('currentYear'),
    newsletterForm: document.getElementById('newsletterForm'),
    announceBar: document.getElementById('announcementBar'),
    closeAnnounceBtn: document.getElementById('closeAnnouncement'),
    applyPromoBtn: document.getElementById('applyPromoBtn'),
    promoInput: document.getElementById('promoInput'),
    promoFeedback: document.getElementById('promoFeedback')
};

// ==========================================================================
// 4. BUSINESS CORE AND UI RENDER ENGINES
// ==========================================================================

function renderProductGrid() {
    let targetProducts = [...storeState.products];

    // Execution of Sorting/Filtering Channels Rules
    if (storeState.filters.category !== 'all') {
        targetProducts = targetProducts.filter(item => item.category === storeState.filters.category);
    }

    if (storeState.filters.sort === 'low-high') {
        targetProducts.sort((a, b) => a.price - b.price);
    } else if (storeState.filters.sort === 'high-low') {
        targetProducts.sort((a, b) => b.price - a.price);
    }

    if (targetProducts.length === 0) {
        DOM.productGrid.innerHTML = `<p class="cart-empty-message">No curated artifacts found matching this filter selection.</p>`;
        return;
    }

    DOM.productGrid.innerHTML = targetProducts.map(product => {
        let starsHTML = '';
        const fullStars = Math.floor(product.rating);
        for(let i = 0; i < 5; i++) {
            starsHTML += i < fullStars 
                ? `<i class="fa-solid fa-star"></i>` 
                : `<i class="fa-regular fa-star-half-stroke"></i>`;
        }

        return `
            <article class="product-card" data-id="${product.id}">
                <div class="product-image-wrap">
                    <button class="wishlist-btn" aria-label="Add to wishlist">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-card-action">
                        <button class="btn btn-primary btn-block add-to-cart-trigger">
                            <i class="fa-solid fa-plus"></i> Add to Basket
                        </button>
                    </div>
                </div>
                <div class="product-meta-cat">${product.category}</div>
                <h3 class="product-meta-title">${product.name}</h3>
                <div class="product-rating">
                    ${starsHTML}
                    <span>(${product.reviewsCount})</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </article>
        `;
    }).join('');
}

function updateCartUI() {
    const aggregateUnitsCount = storeState.cart.reduce((accum, curr) => accum + curr.quantity, 0);
    
    DOM.cartBadge.textContent = aggregateUnitsCount;
    DOM.cartCountHeader.textContent = aggregateUnitsCount;

    if (storeState.cart.length === 0) {
        DOM.cartItemsContainer.innerHTML = `
            <div class="cart-empty-message">
                <i class="fa-solid fa-seedling"></i>
                <p>Your basket is currently empty.</p>
            </div>
        `;
        DOM.cartSubtotal.textContent = "$0.00";
        DOM.cartTax.textContent = "$0.00";
        DOM.cartTotal.textContent = "$0.00";
        DOM.checkoutBtn.disabled = true;
        return;
    }

    DOM.checkoutBtn.disabled = false;

    DOM.cartItemsContainer.innerHTML = storeState.cart.map(cartItem => {
        return `
            <div class="cart-item" data-id="${cartItem.product.id}">
                <img src="${cartItem.product.image}" alt="${cartItem.product.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${cartItem.product.name}</h4>
                    <p class="cart-item-cat">${cartItem.product.category}</p>
                    <div class="cart-item-price">$${(cartItem.product.price * cartItem.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-remove-btn" aria-label="Remove item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <div class="quantity-picker">
                        <button class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
                        <span class="qty-val">${cartItem.quantity}</span>
                        <button class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Dynamic Balance Computations
    const calculatedSubtotal = storeState.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    // Process Promo Deductions
    const discountAmount = calculatedSubtotal * storeState.appliedDiscount;
    const runningSubtotalAfterDiscount = calculatedSubtotal - discountAmount;
    
    const operationalTaxValue = runningSubtotalAfterDiscount * storeState.taxRate;
    const finalInvoiceTotal = runningSubtotalAfterDiscount + operationalTaxValue;

    // Output formatting
    if (discountAmount > 0) {
        DOM.cartSubtotal.innerHTML = `<del>$${calculatedSubtotal.toFixed(2)}</del> <span style="color:#487858; margin-left: 8px;">-$${discountAmount.toFixed(2)}</span>`;
    } else {
        DOM.cartSubtotal.textContent = `$${calculatedSubtotal.toFixed(2)}`;
    }
    
    DOM.cartTax.textContent = `$${operationalTaxValue.toFixed(2)}`;
    DOM.cartTotal.textContent = `$${finalInvoiceTotal.toFixed(2)}`;
}

function pushProductToCart(targetedId) {
    const identifiedInventoryModel = storeState.products.find(p => p.id === targetedId);
    if (!identifiedInventoryModel) return;

    const existingEntryIndex = storeState.cart.findIndex(entry => entry.product.id === targetedId);

    if (existingEntryIndex > -1) {
        storeState.cart[existingEntryIndex].quantity += 1;
    } else {
        storeState.cart.push({
            product: identifiedInventoryModel,
            quantity: 1
        });
    }

    updateCartUI();
    toggleCartDrawer(true);
}

function adjustCartLineItemQuantity(lineItemId, scalarOffsetDelta) {
    const lookupIndex = storeState.cart.findIndex(item => item.product.id === lineItemId);
    if (lookupIndex === -1) return;

    storeState.cart[lookupIndex].quantity += scalarOffsetDelta;

    if (storeState.cart[lookupIndex].quantity <= 0) {
        storeState.cart.splice(lookupIndex, 1);
    }

    updateCartUI();
}

function purgeCartLineItem(lineItemId) {
    storeState.cart = storeState.cart.filter(item => item.product.id !== lineItemId);
    updateCartUI();
}

function toggleCartDrawer(forceState) {
    const isPresentlyVisible = DOM.cartDrawer.classList.contains('active');
    const directResolutionState = (typeof forceState === 'boolean') ? forceState : !isPresentlyVisible;

    if (directResolutionState) {
        DOM.cartDrawer.classList.add('active');
        DOM.cartOverlay.classList.add('active');
        DOM.cartDrawer.setAttribute('aria-hidden', 'false');
    } else {
        DOM.cartDrawer.classList.remove('active');
        DOM.cartOverlay.classList.remove('active');
        DOM.cartDrawer.setAttribute('aria-hidden', 'true');
    }
}

// ==========================================================================
// 5. EVENT HANDLERS & BOOTSTRAP CHANNELS
// ==========================================================================
function bindApplicationEventsListeners() {
    
    // Category filtering
    DOM.filterBtns.forEach(buttonElement => {
        buttonElement.addEventListener('click', (e) => {
            DOM.filterBtns.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            storeState.filters.category = e.currentTarget.getAttribute('data-category');
            renderProductGrid();
        });
    });

    // Catalog sorting
    DOM.sortSelect.addEventListener('change', (e) => {
        storeState.filters.sort = e.target.value;
        renderProductGrid();
    });

    // Main product actions catch delegation
    DOM.productGrid.addEventListener('click', (eventInstance) => {
        const closestAddBtn = eventInstance.target.closest('.add-to-cart-trigger');
        const wishBtn = eventInstance.target.closest('.wishlist-btn');
        const containerCardArticle = eventInstance.target.closest('.product-card');
        
        if (!containerCardArticle) return;
        const internalModelIdentityKey = containerCardArticle.getAttribute('data-id');

        if (closestAddBtn) {
            pushProductToCart(internalModelIdentityKey);
        } 
        else if (wishBtn) {
            const heartIcon = wishBtn.querySelector('i');
            if (heartIcon.classList.contains('fa-regular')) {
                heartIcon.className = "fa-solid fa-heart";
            } else {
                heartIcon.className = "fa-regular fa-heart";
            }
        }
    });

    // Cart modification actions delegation
    DOM.cartItemsContainer.addEventListener('click', (eventContext) => {
        const targetElement = eventContext.target;
        const lineItemCard = targetElement.closest('.cart-item');
        if (!lineItemCard) return;
        
        const runtimeItemId = lineItemCard.getAttribute('data-id');

        if (targetElement.classList.contains('qty-minus')) {
            adjustCartLineItemQuantity(runtimeItemId, -1);
        }
        else if (targetElement.classList.contains('qty-plus')) {
            adjustCartLineItemQuantity(runtimeItemId, 1);
        }
        else if (targetElement.closest('.cart-remove-btn')) {
            purgeCartLineItem(runtimeItemId);
        }
    });

    // Drawer visibility triggers
    DOM.cartToggle.addEventListener('click', () => toggleCartDrawer(true));
    DOM.cartClose.addEventListener('click', () => toggleCartDrawer(false));
    DOM.cartOverlay.addEventListener('click', () => toggleCartDrawer(false));

    // Top announcement bar dismissal
    if (DOM.closeAnnounceBtn && DOM.announceBar) {
        DOM.closeAnnounceBtn.addEventListener('click', () => {
            DOM.announceBar.style.display = 'none';
        });
    }

    // Promo Code Valuation Pipeline
    if (DOM.applyPromoBtn && DOM.promoInput) {
        DOM.applyPromoBtn.addEventListener('click', () => {
            const enteredCode = DOM.promoInput.value.trim().toUpperCase();
            
            if (enteredCode === 'SLOW10') {
                storeState.appliedDiscount = 0.10; // 10% Off calculated base invoice
                DOM.promoFeedback.textContent = "Code 'SLOW10' applied! 10% savings deducted.";
                DOM.promoFeedback.className = "promo-feedback success";
                updateCartUI();
            } else {
                DOM.promoFeedback.textContent = "Invalid studio code. Try 'SLOW10'";
                DOM.promoFeedback.className = "promo-feedback error";
            }
        });
    }

    // Checkout pipeline simulation execution
    DOM.checkoutBtn.addEventListener('click', () => {
        alert('🌿 Thank you for walking the slow path. Your order checkout simulation is successfully complete.');
        storeState.cart = [];
        storeState.appliedDiscount = 0.0;
        if (DOM.promoInput) DOM.promoInput.value = '';
        if (DOM.promoFeedback) {
            DOM.promoFeedback.textContent = '';
            DOM.promoFeedback.className = 'promo-feedback';
        }
        updateCartUI();
        toggleCartDrawer(false);
    });
}

function initializeStorefront() {
    bindApplicationEventsListeners();
    renderProductGrid();
    updateCartUI();

    // Structural contextual synchronizations
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }

    if (DOM.newsletterForm) {
        DOM.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputField = DOM.newsletterForm.querySelector('input');
            alert(`📨 Handshake success. Studio notes will arrive safely at: ${inputField.value}`);
            inputField.value = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeStorefront);