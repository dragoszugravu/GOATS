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
    const wrapper = document.createElement('div');
    wrapper.className = 'pc-card-wrapper';
    
    // Check if player image exists, otherwise use default
    const avatarImage = player.image || 'images/default.jpg';
    const celebrationImage = player.image ? player.image.replace('.jpg', '_celebration.jpg') : 'images/default_celebration.jpg';
    
    // Generate player handle from name
    const handle = player.name.toLowerCase().replace(/\s+/g, '');
    
    wrapper.innerHTML = `
        <section class="pc-card">
            <div class="pc-inside">
                <div class="pc-shine"></div>
                <div class="pc-glare"></div>
                <div class="pc-content pc-avatar-content">
                    <img class="avatar" src="${avatarImage}" alt="${player.name} avatar" loading="lazy" onerror="this.src='images/default.jpg'">
                    <div class="pc-user-info">
                        <div class="pc-user-details">
                            <div class="pc-mini-avatar">
                                <img src="${avatarImage}" alt="${player.name} mini avatar" loading="lazy" onerror="this.src='images/default.jpg'">
                            </div>
                            <div class="pc-user-text">
                                <div class="pc-handle">@${handle}</div>
                                <div class="pc-status">GOATS</div>
                            </div>
                        </div>
                        <button class="pc-contact-btn" type="button" aria-label="Contact ${player.name}">
                            View
                        </button>
                    </div>
                </div>
                <div class="pc-content">
                    <div class="pc-details">
                        <h3>${player.name}</h3>
                        <p>${player.position}</p>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    // Special card for new player (visible for 1 day)
    if (player.newPlayer && isNewPlayerActive(player.joinedDate)) {
        wrapper.classList.add('special-new-player');
        wrapper.innerHTML += `<div class="new-player-badge">NEW!</div>`;
    }
    
    return wrapper;
}

// ProfileCard Tilt Effect Implementation
class ProfileCardTilt {
    constructor(element, options = {}) {
        this.element = element;
        this.card = element.querySelector('.pc-card');
        this.options = {
            enableTilt: true,
            ...options
        };
        
        this.animationHandlers = null;
        
        if (this.options.enableTilt && this.card) {
            this.init();
        }
    }
    
    init() {
        const ANIMATION_CONFIG = {
            SMOOTH_DURATION: 600,
            INITIAL_DURATION: 1500,
            INITIAL_X_OFFSET: 70,
            INITIAL_Y_OFFSET: 60,
        };
        
        const clamp = (value, min = 0, max = 100) =>
            Math.min(Math.max(value, min), max);
        
        const round = (value, precision = 3) =>
            parseFloat(value.toFixed(precision));
        
        const adjust = (value, fromMin, fromMax, toMin, toMax) =>
            round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
        
        const easeInOutCubic = (x) =>
            x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        
        let rafId = null;
        
        const updateCardTransform = (offsetX, offsetY, card, wrap) => {
            const width = card.clientWidth;
            const height = card.clientHeight;
            
            const percentX = clamp((100 / width) * offsetX);
            const percentY = clamp((100 / height) * offsetY);
            
            const centerX = percentX - 50;
            const centerY = percentY - 50;
            
            const properties = {
                "--pointer-x": `${percentX}%`,
                "--pointer-y": `${percentY}%`,
                "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
                "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
                "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                "--pointer-from-top": `${percentY / 100}`,
                "--pointer-from-left": `${percentX / 100}`,
                "--rotate-x": `${round(-(centerX / 5))}deg`,
                "--rotate-y": `${round(centerY / 4)}deg`,
            };
            
            Object.entries(properties).forEach(([property, value]) => {
                wrap.style.setProperty(property, value);
            });
        };
        
        const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
            const startTime = performance.now();
            const targetX = wrap.clientWidth / 2;
            const targetY = wrap.clientHeight / 2;
            
            const animationLoop = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = clamp(elapsed / duration);
                const easedProgress = easeInOutCubic(progress);
                
                const currentX = adjust(easedProgress, 0, 1, startX, targetX);
                const currentY = adjust(easedProgress, 0, 1, startY, targetY);
                
                updateCardTransform(currentX, currentY, card, wrap);
                
                if (progress < 1) {
                    rafId = requestAnimationFrame(animationLoop);
                }
            };
            
            rafId = requestAnimationFrame(animationLoop);
        };
        
        const handlePointerMove = (event) => {
            if (!this.card || !this.element) return;
            
            // On mobile, only respond to mouse events, not touch events to avoid interfering with scroll
            if (window.innerWidth <= 768 && event.pointerType === 'touch') {
                return;
            }
            
            const rect = this.card.getBoundingClientRect();
            updateCardTransform(
                event.clientX - rect.left,
                event.clientY - rect.top,
                this.card,
                this.element
            );
        };
        
        const handlePointerEnter = (event) => {
            if (!this.card || !this.element) return;
            
            // On mobile, only respond to mouse events, not touch events to avoid interfering with scroll
            if (window.innerWidth <= 768 && event.pointerType === 'touch') {
                return;
            }
            
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            this.element.classList.add('active');
            this.card.classList.add('active');
        };
        
        const handlePointerLeave = (event) => {
            if (!this.card || !this.element) return;
            
            createSmoothAnimation(
                ANIMATION_CONFIG.SMOOTH_DURATION,
                event.offsetX,
                event.offsetY,
                this.card,
                this.element
            );
            this.element.classList.remove('active');
            this.card.classList.remove('active');
        };
        
        // Add event listeners
        this.card.addEventListener('pointerenter', handlePointerEnter);
        this.card.addEventListener('pointermove', handlePointerMove);
        this.card.addEventListener('pointerleave', handlePointerLeave);
        
        // Initial animation
        const initialX = this.element.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        
        updateCardTransform(initialX, initialY, this.card, this.element);
        createSmoothAnimation(
            ANIMATION_CONFIG.INITIAL_DURATION,
            initialX,
            initialY,
            this.card,
            this.element
        );
        
        // Store cleanup function
        this.cleanup = () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            this.card.removeEventListener('pointerenter', handlePointerEnter);
            this.card.removeEventListener('pointermove', handlePointerMove);
            this.card.removeEventListener('pointerleave', handlePointerLeave);
        };
    }
    
    destroy() {
        if (this.cleanup) {
            this.cleanup();
        }
    }
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
    const main = document.querySelector('main');
    
    // Clear any existing content
    main.innerHTML = '';
    
    // Add Goalkeepers section
    main.appendChild(createSection('Goalkeepers', players.goalkeepers));
    
    // Add Defenders section
    main.appendChild(createSection('Defenders', players.defenders));
    
    // Add Midfielders section
    main.appendChild(createSection('Midfielders', players.midfielders));
    
    // Add Forwards section
    main.appendChild(createSection('Forwards', players.forwards));
    
    // Initialize ProfileCard tilt effects
    initProfileCardTilts();
}

function initProfileCardTilts() {
    // Wait for DOM to be ready
    setTimeout(() => {
        const cardWrappers = document.querySelectorAll('.pc-card-wrapper');
        cardWrappers.forEach(wrapper => {
            new ProfileCardTilt(wrapper, {
                enableTilt: true
            });
        });
    }, 100);
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

// LiquidChrome Background Effect
function initLiquidChrome() {
    const container = document.querySelector('.liquidChrome-container');
    if (!container) return;

    console.log('LiquidChrome: Container found');

    // Create canvas manually
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    console.log('LiquidChrome: WebGL context created');

    // Configuration
    const config = {
        baseColor: [0.1, 0.1, 0.1],
        speed: 0.2,
        amplitude: 0.3,
        frequencyX: 3,
        frequencyY: 3,
        interactive: true
    };

    // Vertex shader
    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 vUv;
        void main() {
            vUv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    // Fragment shader
    const fragmentShaderSource = `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uBaseColor;
        uniform float uAmplitude;
        uniform float uFrequencyX;
        uniform float uFrequencyY;
        uniform vec2 uMouse;
        varying vec2 vUv;

        vec4 renderImage(vec2 uvCoord) {
            vec2 fragCoord = uvCoord * uResolution;
            vec2 uv = (2.0 * fragCoord - uResolution) / min(uResolution.x, uResolution.y);

            for (float i = 1.0; i < 10.0; i++){
                uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
                uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
            }

            vec2 diff = (uvCoord - uMouse);
            float dist = length(diff);
            float falloff = exp(-dist * 20.0);
            float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
            uv += (diff / (dist + 0.0001)) * ripple * falloff;

            vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
            return vec4(color, 1.0);
        }

        void main() {
            vec4 col = vec4(0.0);
            int samples = 0;
            for (int i = -1; i <= 1; i++){
                for (int j = -1; j <= 1; j++){
                    vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                    col += renderImage(vUv + offset);
                    samples++;
                }
            }
            gl_FragColor = col / float(samples);
        }
    `;

    // Compile shader
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Create program
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
        console.error('Failed to create shader program');
        return;
    }

    console.log('LiquidChrome: Shaders compiled successfully');

    // Create geometry (fullscreen quad)
    const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const baseColorLocation = gl.getUniformLocation(program, 'uBaseColor');
    const amplitudeLocation = gl.getUniformLocation(program, 'uAmplitude');
    const frequencyXLocation = gl.getUniformLocation(program, 'uFrequencyX');
    const frequencyYLocation = gl.getUniformLocation(program, 'uFrequencyY');
    const mouseLocation = gl.getUniformLocation(program, 'uMouse');

    let mouseX = 0, mouseY = 0;

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        canvas.style.width = container.offsetWidth + 'px';
        canvas.style.height = container.offsetHeight + 'px';
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function handleMouseMove(event) {
        const rect = container.getBoundingClientRect();
        mouseX = (event.clientX - rect.left) / rect.width;
        mouseY = 1 - (event.clientY - rect.top) / rect.height;
    }

    function handleTouchMove(event) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            const rect = container.getBoundingClientRect();
            mouseX = (touch.clientX - rect.left) / rect.width;
            mouseY = 1 - (touch.clientY - rect.top) / rect.height;
        }
    }

    let isAnimating = false;
    const baseConfig = {
        amplitude: config.amplitude,
        frequencyX: config.frequencyX,
        frequencyY: config.frequencyY
    };

    function handleClick(event) {
        // Prevent multiple simultaneous animations
        if (isAnimating) return;
        
        console.log('LiquidChrome: Click detected at', event.clientX, event.clientY);
        const rect = container.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1 - (event.clientY - rect.top) / rect.height;
        
        // Create ripple effect on click
        mouseX = x;
        mouseY = y;
        isAnimating = true;
        
        // Use moderate values to avoid glitch
        config.amplitude = baseConfig.amplitude * 1.8;
        config.frequencyX = baseConfig.frequencyX * 1.3;
        config.frequencyY = baseConfig.frequencyY * 1.3;
        
        // Gradually reset values for smoother transition
        let progress = 0;
        const duration = 600; // ms
        const startTime = Date.now();
        
        function resetValues() {
            const now = Date.now();
            progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            config.amplitude = baseConfig.amplitude * (1.8 - 0.8 * easeOut);
            config.frequencyX = baseConfig.frequencyX * (1.3 - 0.3 * easeOut);
            config.frequencyY = baseConfig.frequencyY * (1.3 - 0.3 * easeOut);
            
            if (progress < 1) {
                requestAnimationFrame(resetValues);
            } else {
                // Ensure exact reset to base values
                config.amplitude = baseConfig.amplitude;
                config.frequencyX = baseConfig.frequencyX;
                config.frequencyY = baseConfig.frequencyY;
                isAnimating = false;
            }
        }
        
        requestAnimationFrame(resetValues);
    }

    function handleTouchStart(event) {
        if (event.touches.length > 0) {
            // Prevent multiple simultaneous animations
            if (isAnimating) return;
            
            const touch = event.touches[0];
            const rect = container.getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = 1 - (touch.clientY - rect.top) / rect.height;
            
            // Create ripple effect on touch
            mouseX = x;
            mouseY = y;
            isAnimating = true;
            
            // Use moderate values to avoid glitch
            config.amplitude = baseConfig.amplitude * 1.8;
            config.frequencyX = baseConfig.frequencyX * 1.3;
            config.frequencyY = baseConfig.frequencyY * 1.3;
            
            // Gradually reset values for smoother transition
            let progress = 0;
            const duration = 600; // ms
            const startTime = Date.now();
            
            function resetValues() {
                const now = Date.now();
                progress = Math.min((now - startTime) / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                
                config.amplitude = baseConfig.amplitude * (1.8 - 0.8 * easeOut);
                config.frequencyX = baseConfig.frequencyX * (1.3 - 0.3 * easeOut);
                config.frequencyY = baseConfig.frequencyY * (1.3 - 0.3 * easeOut);
                
                if (progress < 1) {
                    requestAnimationFrame(resetValues);
                } else {
                    // Ensure exact reset to base values
                    config.amplitude = baseConfig.amplitude;
                    config.frequencyX = baseConfig.frequencyX;
                    config.frequencyY = baseConfig.frequencyY;
                    isAnimating = false;
                }
            }
            
            requestAnimationFrame(resetValues);
        }
    }

    // Event listeners
    window.addEventListener('resize', resize);
    if (config.interactive) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('click', handleClick);
        container.addEventListener('touchstart', handleTouchStart);
    }

    container.appendChild(canvas);
    resize();

    console.log('LiquidChrome: Canvas added to DOM');

    let startTime = Date.now();
    let animationId;

    function render() {
        const currentTime = (Date.now() - startTime) * 0.001 * config.speed;
        
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        
        // Bind position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Set uniforms
        gl.uniform1f(timeLocation, currentTime);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform3f(baseColorLocation, config.baseColor[0], config.baseColor[1], config.baseColor[2]);
        gl.uniform1f(amplitudeLocation, config.amplitude);
        gl.uniform1f(frequencyXLocation, config.frequencyX);
        gl.uniform1f(frequencyYLocation, config.frequencyY);
        gl.uniform2f(mouseLocation, mouseX, mouseY);
        
        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationId = requestAnimationFrame(render);
    }

    render();
    console.log('LiquidChrome: Animation started');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayPlayers();
    initMobileMenu();
    optimizeAnimations();
    
    // Initialize LiquidChrome background
    initLiquidChrome();
    
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleScroll);
    }
    
    // Re-optimize on window resize
    window.addEventListener('resize', optimizeAnimations);
    
    // Initialize scroll animation
    initScrollAnimation();
}); 