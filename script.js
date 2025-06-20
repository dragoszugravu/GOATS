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

function createSection(title, players) {
    const section = document.createElement('section');
    section.className = 'section';
    
    const titleElement = document.createElement('h2');
    titleElement.className = 'section-title shiny-text';
    titleElement.textContent = title;
    
    const grid = document.createElement('div');
    grid.className = 'players-grid';
    
    players.forEach(player => {
        grid.appendChild(createPlayerCard(player));
    });
    
    section.appendChild(titleElement);
    section.appendChild(grid);
    
    return section;
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
    // Populate existing HTML structure instead of creating new sections
    const goalkeepersContainer = document.querySelector('.players-row.goalkeepers');
    const defendersContainer = document.querySelector('.players-row.defenders');
    const midfieldersContainer = document.querySelector('.players-row.midfielders');
    const forwardsContainer = document.querySelector('.players-row.forwards');
    
    // Clear existing content and add section titles + players
    if (goalkeepersContainer) {
        goalkeepersContainer.innerHTML = '<h2 class="section-title shiny-text">Goalkeepers</h2>';
        players.goalkeepers.forEach(player => {
            goalkeepersContainer.appendChild(createPlayerCard(player));
        });
    }
    
    if (defendersContainer) {
        defendersContainer.innerHTML = '<h2 class="section-title shiny-text">Defenders</h2>';
        players.defenders.forEach(player => {
            defendersContainer.appendChild(createPlayerCard(player));
        });
    }
    
    if (midfieldersContainer) {
        midfieldersContainer.innerHTML = '<h2 class="section-title shiny-text">Midfielders</h2>';
        players.midfielders.forEach(player => {
            midfieldersContainer.appendChild(createPlayerCard(player));
        });
    }
    
    if (forwardsContainer) {
        forwardsContainer.innerHTML = '<h2 class="section-title shiny-text">Forwards</h2>';
        players.forwards.forEach(player => {
            forwardsContainer.appendChild(createPlayerCard(player));
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayPlayers();
    initMobileMenu();
    optimizeAnimations();
    
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleScroll);
    }
    
    // Re-optimize on window resize
    window.addEventListener('resize', optimizeAnimations);
    
    // Initialize scroll animation
    initScrollAnimation();
}); 