/* ============================================
   COED Processor Landing Page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initHoverEffects();
    initTiltEffect();
    initRippleEffect();
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
