// Profile Card Enhanced Effects JavaScript
class ProfileCardManager {
    constructor() {
        this.cards = [];
        this.animationHandlers = new Map();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeCards());
        } else {
            this.initializeCards();
        }
    }

    initializeCards() {
        // Find all player cards and enhance them
        const playerCards = document.querySelectorAll('.player-card');
        console.log(`Found ${playerCards.length} player cards to enhance`);
        playerCards.forEach((card, index) => {
            console.log(`Enhancing card ${index + 1}:`, card);
            this.enhanceCard(card);
        });
    }

    enhanceCard(originalCard) {
        // Wrap the original card with profile card structure
        const wrapper = document.createElement('div');
        wrapper.className = 'pc-card-wrapper';
        
        const pcCard = document.createElement('section');
        pcCard.className = 'pc-card';
        
        const inside = document.createElement('div');
        inside.className = 'pc-inside';
        
        const shine = document.createElement('div');
        shine.className = 'pc-shine';
        
        const glare = document.createElement('div');
        glare.className = 'pc-glare';
        
        const content = document.createElement('div');
        content.className = 'pc-content';
        
        // Extract content from original card
        const playerImageDiv = originalCard.querySelector('.player-image');
        const playerName = originalCard.querySelector('.player-name') || originalCard.querySelector('h3');
        const playerPosition = originalCard.querySelector('.player-position') || originalCard.querySelector('p');
        
        if (playerImageDiv) {
            // Get the serious photo (first img in the player-image div)
            const seriousPhoto = playerImageDiv.querySelector('.serious-photo') || playerImageDiv.querySelector('img');
            console.log('Found player image div:', playerImageDiv);
            console.log('Found serious photo:', seriousPhoto);
            if (seriousPhoto) {
                console.log('Image source:', seriousPhoto.src);
                const newImage = document.createElement('img');
                newImage.src = seriousPhoto.src;
                newImage.alt = seriousPhoto.alt || 'Player image';
                newImage.className = 'pc-player-image';
                newImage.loading = 'lazy';
                // Add error handling to fallback to default image
                newImage.onerror = function() {
                    console.log('Image failed to load, using default:', this.src);
                    this.src = 'images/default.jpg';
                };
                newImage.onload = function() {
                    console.log('Image loaded successfully:', this.src);
                };
                content.appendChild(newImage);
            }
        } else {
            console.log('No player image div found in card:', originalCard);
        }
        
        const playerInfo = document.createElement('div');
        playerInfo.className = 'pc-player-info';
        
        if (playerName) {
            const newName = playerName.cloneNode(true);
            newName.className = 'pc-player-name';
            playerInfo.appendChild(newName);
        }
        
        if (playerPosition) {
            const newPosition = playerPosition.cloneNode(true);
            newPosition.className = 'pc-player-position';
            playerInfo.appendChild(newPosition);
        }
        
        // Stats removed as requested
        content.appendChild(playerInfo);
        
        // Build the structure
        pcCard.appendChild(inside);
        pcCard.appendChild(shine);
        pcCard.appendChild(glare);
        pcCard.appendChild(content);
        wrapper.appendChild(pcCard);
        
        // Replace original card
        originalCard.parentNode.replaceChild(wrapper, originalCard);
        
        // Initialize tilt effect
        this.initializeTiltEffect(wrapper, pcCard);
        
        this.cards.push({ wrapper, pcCard });
    }

    initializeTiltEffect(wrapper, card) {
        let rafId = null;
        
        const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
        const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
        const adjust = (value, fromMin, fromMax, toMin, toMax) =>
            round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
        const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

        const updateCardTransform = (offsetX, offsetY) => {
            const width = card.clientWidth;
            const height = card.clientHeight;

            const percentX = clamp((100 / width) * offsetX);
            const percentY = clamp((100 / height) * offsetY);

            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${round(-(centerX / 5))}deg`,
                '--rotate-y': `${round(centerY / 4)}deg`,
            };

            Object.entries(properties).forEach(([property, value]) => {
                wrapper.style.setProperty(property, value);
            });
        };

        const createSmoothAnimation = (duration, startX, startY) => {
            const startTime = performance.now();
            const targetX = wrapper.clientWidth / 2;
            const targetY = wrapper.clientHeight / 2;

            const animationLoop = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = clamp(elapsed / duration);
                const easedProgress = easeInOutCubic(progress);

                const currentX = adjust(easedProgress, 0, 1, startX, targetX);
                const currentY = adjust(easedProgress, 0, 1, startY, targetY);

                updateCardTransform(currentX, currentY);

                if (progress < 1) {
                    rafId = requestAnimationFrame(animationLoop);
                }
            };

            rafId = requestAnimationFrame(animationLoop);
        };

        const cancelAnimation = () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const handlePointerMove = (event) => {
            const rect = card.getBoundingClientRect();
            updateCardTransform(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
        };

        const handlePointerEnter = () => {
            cancelAnimation();
            wrapper.classList.add('active');
            card.classList.add('active');
        };

        const handlePointerLeave = (event) => {
            createSmoothAnimation(600, event.offsetX, event.offsetY);
            wrapper.classList.remove('active');
            card.classList.remove('active');
        };

        // Add event listeners
        card.addEventListener('pointerenter', handlePointerEnter);
        card.addEventListener('pointermove', handlePointerMove);
        card.addEventListener('pointerleave', handlePointerLeave);

        // Initial animation
        const initialX = wrapper.clientWidth - 70;
        const initialY = 60;
        updateCardTransform(initialX, initialY);
        createSmoothAnimation(1500, initialX, initialY);

        // Store handlers for cleanup
        this.animationHandlers.set(wrapper, {
            handlePointerMove,
            handlePointerEnter,
            handlePointerLeave,
            cancelAnimation
        });
    }

    // Method to refresh cards (useful when new cards are added dynamically)
    refresh() {
        this.initializeCards();
    }

    // Cleanup method
    destroy() {
        this.cards.forEach(({ wrapper, pcCard }) => {
            const handlers = this.animationHandlers.get(wrapper);
            if (handlers) {
                pcCard.removeEventListener('pointerenter', handlers.handlePointerEnter);
                pcCard.removeEventListener('pointermove', handlers.handlePointerMove);
                pcCard.removeEventListener('pointerleave', handlers.handlePointerLeave);
                handlers.cancelAnimation();
                this.animationHandlers.delete(wrapper);
            }
        });
        this.cards = [];
    }
}

// Initialize the profile card manager
let profileCardManager;

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        profileCardManager = new ProfileCardManager();
        window.profileCardManager = profileCardManager;
    }, 1000);
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileCardManager;
} 