/* ============================================
   COED Processor Landing Page
   ============================================ */

// Product data
const products = {
    x1: { name: 'COED X1', price: 2499 },
    elite: { name: 'COED ELITE', price: 3499 },
    light: { name: 'COED LIGHT', price: 1799 },
    quantum: { name: 'COED QUANTUM', price: 7999 },
    neural: { name: 'COED NEURAL', price: 12499 }
};

// Cart state
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initHoverEffects();
    initTiltEffect();
    initRippleEffect();
    initReservation();
    
    // Load cart from localStorage
    loadCart();
    
    // Update cart display
    updateCartDisplay();
});

/* Navigation */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset > 50;
        navbar.style.background = scrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.75)';
    }, { passive: true });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                closeMobileMenu();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* Mobile Menu */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        const isActive = menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* Scroll Animations - Optimized */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Feature cards
    document.querySelectorAll('.feature-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        observer.observe(card);
    });
    
    // Breakdown panel
    const panel = document.querySelector('.breakdown-panel');
    if (panel) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        panel.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(panel);
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
}

/* Hover Effects - CSS-based for performance */
function initHoverEffects() {
    // Cards - using CSS for smooth 3D tilt (no JS needed)
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '';
        });
    });
}

/* Performance: Respect reduced motion preference */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

/* 3D Tilt Effect for Processor */
function initTiltEffect() {
    const processorContainer = document.querySelector('.processor-container');
    
    if (!processorContainer) return;
    
    if (window.innerWidth <= 750) return;
    
    document.addEventListener('mousemove', (e) => {
        const rect = processorContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        processorContainer.style.setProperty('--rotateX', `${rotateX}deg`);
        processorContainer.style.setProperty('--rotateY', `${rotateY}deg`);
        processorContainer.classList.add('tilt');
    });
    
    document.addEventListener('mouseleave', () => {
        processorContainer.classList.remove('tilt');
    });
}

/* Ripple Effect for CTA Button */
function initRippleEffect() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (!ctaButton) return;
    
    ctaButton.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

/* ============================================
   Cart Functions
   ============================================ */

// Add item to cart
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    saveCart();
    
    // Update display
    updateCartDisplay();
    
    // Show toast notification
    showToast(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartDisplay();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('coed_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('coed_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart count in navigation
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
    
    // Update cart items display
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <span>Add processors to get started</span>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <div class="mini-chip"></div>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');
    }
    
    // Update cart summary
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Show quantum modal instead of alert
    const modal = document.getElementById('quantum-modal');
    if (modal) {
        modal.classList.add('active');
        // Clear cart after showing modal
        clearCart();
    }
}

// Close quantum modal
function closeQuantumModal() {
    const modal = document.getElementById('quantum-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastMessage = toast.querySelector('.toast-message');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.checkout = checkout;
window.closeQuantumModal = closeQuantumModal;

/* ============================================
   Reservation System
   ============================================ */

// Product prices for reservations
const reservationProducts = {
    x1: { name: 'COED X1', price: 2499 },
    light: { name: 'COED LIGHT', price: 1799 },
    elite: { name: 'COED ELITE', price: 3499 },
    quantum: { name: 'COED QUANTUM', price: 7999 },
    neural: { name: 'COED NEURAL', price: 12499 }
};

// Initialize reservation system
function initReservation() {
    const reserveBtn = document.getElementById('reserve-btn');
    const modal = document.getElementById('reservation-modal');
    const closeBtn = document.getElementById('reservation-close');
    const form = document.getElementById('reservation-form');
    const successModal = document.getElementById('reservation-success');
    const successCloseBtn = document.getElementById('success-close-btn');
    
    if (!reserveBtn || !modal) return;
    
    // Open modal on button click
    reserveBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal on close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal on overlay click
    const overlay = modal.querySelector('.reservation-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reserve-name').value;
            const email = document.getElementById('reserve-email').value;
            const product = document.getElementById('reserve-product').value;
            
            if (name && email && product) {
                // Get product details
                const productInfo = reservationProducts[product];
                
                // Create reservation
                const reservation = {
                    id: 'RES-' + Date.now(),
                    name: name,
                    email: email,
                    product: product,
                    productName: productInfo.name,
                    price: productInfo.price,
                    date: new Date().toLocaleDateString()
                };
                
                // Save to localStorage
                saveReservation(reservation);
                
                // Show success modal
                showReservationSuccess(reservation);
                
                // Close form modal
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset form
                form.reset();
            }
        });
    }
    
    // Close success modal
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', function() {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close success modal on overlay click
    const successOverlay = successModal.querySelector('.reservation-overlay');
    if (successOverlay) {
        successOverlay.addEventListener('click', function() {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Save reservation to localStorage
function saveReservation(reservation) {
    let reservations = JSON.parse(localStorage.getItem('coed_reservations') || '[]');
    reservations.push(reservation);
    localStorage.setItem('coed_reservations', JSON.stringify(reservations));
}

// Show reservation success modal
function showReservationSuccess(reservation) {
    const successModal = document.getElementById('reservation-success');
    const successDetails = document.getElementById('success-details');
    
    if (!successModal || !successDetails) return;
    
    // Populate details
    successDetails.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">NAME</span>
            <span class="detail-value">${reservation.name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">EMAIL</span>
            <span class="detail-value">${reservation.email}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">MODEL</span>
            <span class="detail-value">${reservation.productName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">PRICE</span>
            <span class="detail-value">$${reservation.price.toLocaleString()}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">RESERVATION ID</span>
            <span class="detail-value">${reservation.id}</span>
        </div>
    `;
    
    // Show modal
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Make reservation function globally available
window.openReservationModal = function() {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};
