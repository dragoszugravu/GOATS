// Simple 3D Tilt Effect - Copied from team-generator working version
class ProfileCardManager {
    constructor() {
        this.cards = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeCards());
        } else {
            this.initializeCards();
        }
    }

    initializeCards() {
        const playerCards = document.querySelectorAll('.player-card');
        console.log(`Found ${playerCards.length} player cards to enhance`);
        console.log('Player cards found:', playerCards);
        playerCards.forEach((card, index) => {
            console.log(`Adding tilt effect to card ${index + 1}:`, card);
            this.initializeTiltEffect(card);
        });
    }

    initializeTiltEffect(card) {
        let rotateX = 0;
        let rotateY = 0;
        
        // Add tilt-active class
        card.classList.add('tilt-active');
        
        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }
        
        function updateTransform() {
            const transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            console.log('Setting transform:', transform);
            card.style.setProperty('transform', transform, 'important');
        }
        
        function handleMouseMove(e) {
            const rect = card.getBoundingClientRect();
            const offsetX = e.clientX - rect.left - rect.width / 2;
            const offsetY = e.clientY - rect.top - rect.height / 2;
            
            const rotateAmplitude = 14;
            const targetRotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
            const targetRotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
            
            rotateX = targetRotationX;
            rotateY = targetRotationY;
            
            console.log('Mouse move - rotateX:', rotateX, 'rotateY:', rotateY);
            updateTransform();
        }
        
        function handleMouseLeave() {
            card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            // Animate back to center
            const animate = () => {
                rotateX = lerp(rotateX, 0, 0.1);
                rotateY = lerp(rotateY, 0, 0.1);
                
                updateTransform();
                
                if (Math.abs(rotateX) > 0.1 || Math.abs(rotateY) > 0.1) {
                    requestAnimationFrame(animate);
                } else {
                    rotateX = 0;
                    rotateY = 0;
                    updateTransform();
                }
            };
            
            animate();
        }
        
        function handleTouchStart(e) {
            card.style.transition = 'none';
        }
        
        function handleTouchMove(e) {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const rect = card.getBoundingClientRect();
                const offsetX = touch.clientX - rect.left - rect.width / 2;
                const offsetY = touch.clientY - rect.top - rect.height / 2;
                
                const rotateAmplitude = 14;
                const targetRotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
                const targetRotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
                
                rotateX = targetRotationX;
                rotateY = targetRotationY;
                
                updateTransform();
            }
        }
        
        function handleTouchEnd() {
            handleMouseLeave();
        }
        
        // Mouse events for desktop
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        
        // Touch events for mobile
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: true });
        card.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Initial transform
        updateTransform();
        
        this.cards.push(card);
    }

    refresh() {
        this.initializeCards();
    }

    destroy() {
        this.cards = [];
    }
}

// Initialize the profile card manager
let profileCardManager;

document.addEventListener('DOMContentLoaded', function() {
    profileCardManager = new ProfileCardManager();
    window.profileCardManager = profileCardManager;
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileCardManager;
} 