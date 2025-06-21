// Player data for GOATS FC
const players = {
    goalkeepers: [
        {
            name: "Gabriel Ciulpan",
            position: "Goalkeeper",
            number: 1,
            image: "images/players/CIULPAN_Gabriel.jpg"
        },
        {
            name: "Theodor Calin",
            position: "Goalkeeper",
            number: 25,
            image: "images/players/CALIN_Theodor.jpg"
        }
    ],
    defenders: [
        {
            name: "Dragos Zugravu",
            position: "Defender",
            number: 4,
            image: "images/players/ZUGRAVU_Dragos.jpg"
        },
        {
            name: "Sebastian Plaiasu",
            position: "Defender",
            number: 3,
            image: "images/players/PLAIASU_Sebastian.jpg"
        },
        {
            name: "Robert Fita",
            position: "Defender",
            number: 5,
            image: "images/players/FITA_Robert.jpg"
        },
        {
            name: "Alex Stanciu",
            position: "Defender",
            number: 2,
            image: "images/players/STANCIU_Alex.jpg"
        },
        {
            name: "Mihai Paun",
            position: "Defender",
            number: 18,
            image: "images/players/PAUN_Mihai.jpg"
        }
    ],
    midfielders: [
        {
            name: "Adrian Petrache",
            position: "Midfielder",
            number: 8,
            image: "images/players/PETRACHE_Adrian.jpg"
        },
        {
            name: "Luca Spirea",
            position: "Midfielder",
            number: 10,
            image: "images/players/SPIREA_Luca.jpg"
        },
        {
            name: "Romeo Gemalescu",
            position: "Midfielder",
            number: 7,
            image: "images/players/GEMALESCU_Romeo.jpg"
        },
        {
            name: "Sebi Budan",
            position: "Midfielder",
            number: 14,
            image: "images/players/BUDAN_Sebi.jpg"
        },
        {
            name: "Alexandru Dinu",
            position: "Midfielder",
            number: 17,
            image: "images/players/DINU_Alexandru.jpg"
        },
        {
            name: "Catalin Nicolae",
            position: "Midfielder",
            number: 19,
            image: "images/players/NICOLAE_Catalin.jpg"
        },
        {
            name: "Rober Duna",
            position: "Midfielder",
            number: 21,
            image: "images/players/DUNA_Rober.jpg"
        }
    ],
    forwards: [
        {
            name: "Andrei Marcu",
            position: "Forward",
            number: 9,
            image: "images/players/MARCU_Andrei.jpg"
        },
        {
            name: "Ionut Bustea",
            position: "Forward",
            number: 11,
            image: "images/players/BUSTEA_Ionut.jpg"
        }
    ]
};

function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    
    // Special card for new player (visible for 1 day)
    if (player.newPlayer && isNewPlayerActive(player.joinedDate)) {
        card.classList.add('special-new-player');
        card.innerHTML += `<div class="new-player-badge">NEW!</div>`;
    }
    
    // Check if player image exists, otherwise use default
    const seriousImage = player.image || 'images/default.jpg';
    const celebrationImage = player.image ? player.image.replace('.jpg', '_celebration.jpg') : 'images/default_celebration.jpg';
    
    card.innerHTML = `
        <div class="player-image">
            <img src="${seriousImage}" alt="${player.name}" class="serious-photo" onerror="this.src='images/default.jpg'">
            <img src="${celebrationImage}" alt="${player.name}" class="celebration-photo" onerror="this.src='images/default_celebration.jpg'">
        </div>
        <div class="player-info">
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
        </div>
        <div class="player-logo">
            <img src="images/GOATS.png" alt="GOATS FC Logo">
        </div>
    `;
    
    return card;
}



function handleScroll() {
    const scrollPosition = window.scrollY;
    const lines = document.querySelectorAll('.line');
    
    lines.forEach((line, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = scrollPosition * speed;
        line.style.transform = `translateY(${yPos}px)`;
    });
}

function displayPlayers() {
    // Use the existing structure from HTML
    const goalkeepersRow = document.querySelector('.players-row.goalkeepers');
    const defendersRow = document.querySelector('.players-row.defenders');
    const midfieldersRow = document.querySelector('.players-row.midfielders');
    const forwardsRow = document.querySelector('.players-row.forwards');
    
    // Add players to their respective rows
    if (goalkeepersRow) {
        players.goalkeepers.forEach(player => {
            goalkeepersRow.appendChild(createPlayerCard(player));
        });
    }
    
    if (defendersRow) {
        players.defenders.forEach(player => {
            defendersRow.appendChild(createPlayerCard(player));
        });
    }
    
    if (midfieldersRow) {
        players.midfielders.forEach(player => {
            midfieldersRow.appendChild(createPlayerCard(player));
        });
    }
    
    if (forwardsRow) {
        players.forwards.forEach(player => {
            forwardsRow.appendChild(createPlayerCard(player));
        });
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    
    // Copy navigation links to mobile menu
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    mobileNav.appendChild(navLinks);
    document.body.appendChild(mobileNav);
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Optimize animations for mobile
function optimizeAnimations() {
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        document.querySelectorAll('.motion-circle').forEach(circle => {
            circle.style.animationDuration = '30s';
        });
        
        // Disable parallax effect on mobile
        window.removeEventListener('scroll', handleScroll);
    }
}

// Scroll Animation
function initScrollAnimation() {
    const scrollLines = document.querySelectorAll('.scroll-line');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateLines() {
        const scrollPosition = window.scrollY;
        const scrollDelta = scrollPosition - lastScrollY;
        
        scrollLines.forEach((line, index) => {
            const speed = 0.8 + (index * 0.2); // Increased base speed
            const yPos = scrollPosition * speed;
            const opacity = Math.min(0.6, 0.4 + Math.abs(scrollDelta) * 0.01); // Dynamic opacity based on scroll speed
            
            line.style.transform = `translateY(${yPos}px)`;
            line.style.opacity = opacity;
        });
        
        lastScrollY = scrollPosition;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateLines);
            ticking = true;
        }
    });
}

// Helper to check if new player badge should be shown (1 day)
function isNewPlayerActive(joinedDate) {
    const now = new Date();
    const joined = new Date(joinedDate);
    const diff = (now - joined) / (1000 * 60 * 60 * 24);
    return diff < 1;
}

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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayPlayers();
    initMobileMenu();
    optimizeAnimations();
    
    // Initialize 3D tilt effect after player cards are created
    setTimeout(() => {
        const profileCardManager = new ProfileCardManager();
        window.profileCardManager = profileCardManager;
    }, 100);
    
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleScroll);
    }
    
    // Re-optimize on window resize
    window.addEventListener('resize', optimizeAnimations);
    
    // Initialize scroll animation
    initScrollAnimation();
}); 