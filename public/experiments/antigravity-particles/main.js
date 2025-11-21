import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';

// Configuration - Tuned for liquid wave effect (not TV static)
const PARTICLE_COUNT = 3000; // Reduced from 30k to 3k for clean flow field
const WIDTH = Math.ceil(Math.sqrt(PARTICLE_COUNT));
const PARTICLE_SIZE = 4.0; // Slightly larger for better visibility with fewer particles

// Scene setup
let camera, scene, renderer;
let gpuCompute, positionVariable, velocityVariable;
let particleMesh;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;
const mouse3D = new THREE.Vector3();

init();
animate();

function init() {
  // Camera - moved back for more immersive depth
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 700; // Moved from 500 to 700 for better depth perception

  // Scene - dark cinematic background matching CSS
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02030a); // Dark background for Antigravity look

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas-container').appendChild(renderer.domElement);

  // Initialize GPGPU
  initGPGPU();

  // Create particle mesh
  initParticles();

  // Mouse events
  document.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function initGPGPU() {
  gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

  // Create initial position texture
  const dtPosition = gpuCompute.createTexture();
  const dtVelocity = gpuCompute.createTexture();

  fillTextures(dtPosition, dtVelocity);

  // Position variable - updates particle positions
  positionVariable = gpuCompute.addVariable('texturePosition', positionShader(), dtPosition);

  // Velocity variable - updates particle velocities
  velocityVariable = gpuCompute.addVariable('textureVelocity', velocityShader(), dtVelocity);

  // Add dependencies
  gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);
  gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);

  // Add uniforms
  positionVariable.material.uniforms.time = { value: 0.0 };
  positionVariable.material.uniforms.delta = { value: 0.0 };

  velocityVariable.material.uniforms.time = { value: 0.0 };
  velocityVariable.material.uniforms.delta = { value: 0.0 };
  velocityVariable.material.uniforms.mouse3D = { value: new THREE.Vector3() };
  velocityVariable.material.uniforms.mouseRadius = { value: 200.0 }; // Gentle displacement radius for liquid flow

  // Initialize
  const error = gpuCompute.init();
  if (error !== null) {
    console.error(error);
  }
}

function fillTextures(texturePosition, textureVelocity) {
  const posArray = texturePosition.image.data;
  const velArray = textureVelocity.image.data;

  for (let k = 0, kl = posArray.length; k < kl; k += 4) {
    // Position - create deep volumetric field like Antigravity
    // Much wider X/Y range and significantly deeper Z for immersive depth
    const x = (Math.random() - 0.5) * 1600; // Increased from 1000 to 1600
    const y = (Math.random() - 0.5) * 1000; // Increased from 600 to 1000
    const z = (Math.random() - 0.5) * 1200 - 100; // Z from -700 to +500 (was -50 to +50)

    posArray[k + 0] = x; // x
    posArray[k + 1] = y; // y
    posArray[k + 2] = z; // z - deep field effect
    posArray[k + 3] = 1; // w (not used)

    // Velocity - start with small random velocities
    velArray[k + 0] = (Math.random() - 0.5) * 0.5;
    velArray[k + 1] = (Math.random() - 0.5) * 0.5;
    velArray[k + 2] = (Math.random() - 0.5) * 0.5;
    velArray[k + 3] = 1; // w (not used)
  }
}

function positionShader() {
  return `
    uniform float time;
    uniform float delta;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 tmpPos = texture2D(texturePosition, uv);
      vec3 position = tmpPos.xyz;
      vec4 tmpVel = texture2D(textureVelocity, uv);
      vec3 velocity = tmpVel.xyz;

      // Update position based on velocity
      position += velocity * delta * 60.0;

      gl_FragColor = vec4(position, 1.0);
    }
  `;
}

function velocityShader() {
  return `
    uniform float time;
    uniform float delta;
    uniform vec3 mouse3D;
    uniform float mouseRadius;

    // Simplex noise for smooth, flowing waves (not jittery random noise)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Curl noise for swirling, liquid-like flow
    vec3 curlNoise(vec3 p) {
      float eps = 0.1;
      vec3 curl;

      curl.x = snoise(vec3(p.x, p.y + eps, p.z)) - snoise(vec3(p.x, p.y - eps, p.z));
      curl.y = snoise(vec3(p.x, p.y, p.z + eps)) - snoise(vec3(p.x, p.y, p.z - eps));
      curl.z = snoise(vec3(p.x + eps, p.y, p.z)) - snoise(vec3(p.x - eps, p.y, p.z));

      return curl / (2.0 * eps);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 tmpPos = texture2D(texturePosition, uv);
      vec3 position = tmpPos.xyz;
      vec4 tmpVel = texture2D(textureVelocity, uv);
      vec3 velocity = tmpVel.xyz;

      // 1. Smooth flow field using curl noise - creates liquid waves
      vec3 flowFieldPos = position * 0.003 + time * 0.05; // Very slow, large waves
      vec3 flowForce = curlNoise(flowFieldPos) * 2.0; // Gentle flow

      // 2. Mouse displacement - gentle distortion, not explosion
      vec3 toMouse = position - mouse3D;
      float distToMouse = length(toMouse);
      vec3 displacementForce = vec3(0.0);

      if (distToMouse < mouseRadius && distToMouse > 1.0) {
        // Smooth displacement, like pushing smoke
        float influence = smoothstep(mouseRadius, 0.0, distToMouse);
        influence = influence * influence; // Smoother falloff

        // Perpendicular displacement for swirl effect
        vec3 perpendicular = vec3(-toMouse.y, toMouse.x, toMouse.z * 0.5);
        displacementForce = normalize(toMouse) * influence * 8.0; // Gentle push
        displacementForce += normalize(perpendicular) * influence * 3.0; // Swirl
      }

      // 3. Very gentle return force - keeps field from drifting away
      vec3 originalPos = vec3(
        (uv.x - 0.5) * 1600.0,
        (uv.y - 0.5) * 1000.0,
        (uv.x * uv.y - 0.5) * 1200.0 - 100.0
      );
      vec3 returnForce = (originalPos - position) * 0.0005; // Very weak

      // Apply forces
      velocity += flowForce;
      velocity += displacementForce;
      velocity += returnForce;

      // Smooth damping for liquid feel
      velocity *= 0.94;

      // Limit max velocity
      float maxVel = 8.0;
      if (length(velocity) > maxVel) {
        velocity = normalize(velocity) * maxVel;
      }

      gl_FragColor = vec4(velocity, 1.0);
    }
  `;
}

function initParticles() {
  const positions = new Float32Array(WIDTH * WIDTH * 3);
  const uvs = new Float32Array(WIDTH * WIDTH * 2);

  let p = 0;
  for (let j = 0; j < WIDTH; j++) {
    for (let i = 0; i < WIDTH; i++) {
      uvs[p++] = i / (WIDTH - 1);
      uvs[p++] = j / (WIDTH - 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(WIDTH * WIDTH * 3), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  // Particle material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      texturePosition: { value: null },
      textureVelocity: { value: null },
      cameraConstant: { value: getCameraConstant(camera) }
    },
    vertexShader: particleVertexShader(),
    fragmentShader: particleFragmentShader(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particleMesh = new THREE.Points(geometry, material);
  scene.add(particleMesh);
}

function particleVertexShader() {
  return `
    uniform sampler2D texturePosition;
    uniform sampler2D textureVelocity;
    uniform float cameraConstant;

    varying vec4 vColor;

    void main() {
      vec4 posTemp = texture2D(texturePosition, uv);
      vec3 pos = posTemp.xyz;

      vec4 velTemp = texture2D(textureVelocity, uv);
      vec3 vel = velTemp.xyz;

      // Depth-based color variation for Antigravity look
      // Normalize Z depth: -700 to +500 → 0 to 1
      float depthFactor = (pos.z + 700.0) / 1200.0;
      depthFactor = clamp(depthFactor, 0.0, 1.0);

      // Closer particles are brighter white/blue, farther are dimmer blue
      vec3 nearColor = vec3(0.9, 0.95, 1.0);  // Bright white-blue
      vec3 farColor = vec3(0.2, 0.4, 0.7);    // Darker blue
      vec3 particleColor = mix(farColor, nearColor, depthFactor);

      vColor = vec4(particleColor, 1.0);

      // Lower base opacity for glow effect with additive blending
      float baseOpacity = 0.4; // Reduced from 1.0 for smoother glow

      // Depth-based alpha: farther particles more transparent
      float depthAlpha = 0.1 + depthFactor * 0.4; // 0.1 to 0.5 (reduced range)

      // Velocity-based alpha: faster particles slightly more visible
      float speed = length(vel);
      float speedAlpha = clamp(0.2 + speed * 0.05, 0.0, 1.0);

      vColor.a = baseOpacity * depthAlpha * speedAlpha;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      // Depth-based size: closer particles larger
      float sizeMultiplier = 0.5 + depthFactor * 1.5; // 0.5x to 2x
      gl_PointSize = ${PARTICLE_SIZE.toFixed(1)} * sizeMultiplier * cameraConstant / (-mvPosition.z);

      gl_Position = projectionMatrix * mvPosition;
    }
  `;
}

function particleFragmentShader() {
  return `
    varying vec4 vColor;

    void main() {
      // Create circular particles with soft edges
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) {
        discard;
      }

      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);
    }
  `;
}

function getCameraConstant(camera) {
  return window.innerHeight / (Math.tan(THREE.MathUtils.DEG2RAD * 0.5 * camera.fov) / camera.zoom);
}

function onMouseMove(event) {
  targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  particleMesh.material.uniforms.cameraConstant.value = getCameraConstant(camera);
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse movement
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Subtle camera parallax for depth perception (Antigravity-style)
  camera.position.x = mouseX * 30; // Subtle X offset based on mouse
  camera.position.y = mouseY * 20; // Subtle Y offset based on mouse
  camera.lookAt(scene.position); // Always look at center

  // Convert 2D mouse to 3D position
  mouse3D.set(
    mouseX * (window.innerWidth / 2),
    mouseY * (window.innerHeight / 2),
    0
  );

  // Update GPGPU uniforms
  const now = performance.now() * 0.001;
  const delta = 0.016; // ~60fps

  positionVariable.material.uniforms.time.value = now;
  positionVariable.material.uniforms.delta.value = delta;

  velocityVariable.material.uniforms.time.value = now;
  velocityVariable.material.uniforms.delta.value = delta;
  velocityVariable.material.uniforms.mouse3D.value.copy(mouse3D);

  // Compute!
  gpuCompute.compute();

  // Update particle material with computed textures
  particleMesh.material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
  particleMesh.material.uniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;

  renderer.render(scene, camera);
}
