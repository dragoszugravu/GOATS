// Silk Background Implementation using Three.js
class SilkBackground {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            speed: options.speed || 5,
            scale: options.scale || 1,
            color: options.color || '#7B7481',
            noiseIntensity: options.noiseIntensity || 1.5,
            rotation: options.rotation || 0
        };

        this.init();
    }

    hexToNormalizedRGB(hex) {
        hex = hex.replace("#", "");
        return [
            parseInt(hex.slice(0, 2), 16) / 255,
            parseInt(hex.slice(2, 4), 16) / 255,
            parseInt(hex.slice(4, 6), 16) / 255,
        ];
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.z = 1;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Create shader material
        this.createMaterial();
        
        // Create plane geometry
        this.geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    createMaterial() {
        const vertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;

            void main() {
                vPosition = position;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            varying vec3 vPosition;

            uniform float uTime;
            uniform vec3  uColor;
            uniform float uSpeed;
            uniform float uScale;
            uniform float uRotation;
            uniform float uNoiseIntensity;

            const float e = 2.71828182845904523536;

            float noise(vec2 texCoord) {
                float G = e;
                vec2  r = (G * sin(G * texCoord));
                return fract(r.x * r.y * (1.0 + texCoord.x));
            }

            vec2 rotateUvs(vec2 uv, float angle) {
                float c = cos(angle);
                float s = sin(angle);
                mat2  rot = mat2(c, -s, s, c);
                return rot * uv;
            }

            void main() {
                float rnd        = noise(gl_FragCoord.xy);
                vec2  uv         = rotateUvs(vUv * uScale, uRotation);
                vec2  tex        = uv * uScale;
                float tOffset    = uSpeed * uTime;

                tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

                float pattern = 0.6 +
                              0.4 * sin(5.0 * (tex.x + tex.y +
                                               cos(3.0 * tex.x + 5.0 * tex.y) +
                                               0.02 * tOffset) +
                                       sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

                vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
                col.a = 1.0;
                gl_FragColor = col;
            }
        `;

        const colorRGB = this.hexToNormalizedRGB(this.options.color);
        
        this.uniforms = {
            uTime: { value: 0 },
            uSpeed: { value: this.options.speed },
            uScale: { value: this.options.scale },
            uNoiseIntensity: { value: this.options.noiseIntensity },
            uColor: { value: new THREE.Vector3(...colorRGB) },
            uRotation: { value: this.options.rotation }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update time uniform
        this.uniforms.uTime.value += 0.01;
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.updateProjectionMatrix();
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        if (newOptions.color) {
            const colorRGB = this.hexToNormalizedRGB(newOptions.color);
            this.uniforms.uColor.value.set(...colorRGB);
        }
        if (newOptions.speed !== undefined) {
            this.uniforms.uSpeed.value = newOptions.speed;
        }
        if (newOptions.scale !== undefined) {
            this.uniforms.uScale.value = newOptions.scale;
        }
        if (newOptions.noiseIntensity !== undefined) {
            this.uniforms.uNoiseIntensity.value = newOptions.noiseIntensity;
        }
        if (newOptions.rotation !== undefined) {
            this.uniforms.uRotation.value = newOptions.rotation;
        }
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        if (this.geometry) {
            this.geometry.dispose();
        }
        if (this.material) {
            this.material.dispose();
        }
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize Silk Background when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Three.js to be available
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            const silkBg = new SilkBackground('silk-background', {
                speed: 3,
                scale: 2,
                color: '#7B7481',
                noiseIntensity: 1.2,
                rotation: 0.1
            });
            
            // Store reference globally if needed
            window.silkBackground = silkBg;
        } else {
            console.error('Three.js not loaded');
        }
    }, 100);
}); 