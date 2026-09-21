/**
 * VELOMETRIC™ - 3D Visual Effects Engine
 * Includes: Three.js Interactive Canvas Heroes & Pure JS 3D Tilt Card Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHero3DCanvas();
  initTiltCards();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Three.js Interactive Hero Backgrounds
   -------------------------------------------------------------------------- */
function initHero3DCanvas() {
  const container = document.getElementById('hero3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 32;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group for all rotating objects
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Check hero mode (home1 = bike wireframe & data particles, home2 = kinetic velocity field)
  const isHome2 = document.body.dataset.page === 'home2';

  if (!isHome2) {
    // HOME 1: Realistic 3D Time-Trial Bicycle Geometry with Rotating Wheels & Telemetry Stream
    const bikeMatFrame = new THREE.MeshPhongMaterial({ color: 0xFF5A1F, emissive: 0x441200, shininess: 90 });
    const bikeMatTeal = new THREE.MeshPhongMaterial({ color: 0x00D9C0, emissive: 0x002220, shininess: 80 });
    const bikeMatCarbon = new THREE.MeshPhongMaterial({ color: 0x1E2228, shininess: 50 });
    const bikeMatSpoke = new THREE.LineBasicMaterial({ color: 0x00D9C0, transparent: true, opacity: 0.65 });
    const bikeMatChrome = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 100 });

    const bikeGroup = new THREE.Group();

    // Helper: Create 3D Tube between 2 vectors
    function createTube(p1, p2, radius = 0.22, material = bikeMatFrame) {
      const distance = p1.distanceTo(p2);
      const geometry = new THREE.CylinderGeometry(radius, radius, distance, 12);
      const mesh = new THREE.Mesh(geometry, material);
      const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mesh.position.copy(midpoint);
      const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      return mesh;
    }

    // Bike Frame Keypoints
    const bb = new THREE.Vector3(0, -3.5, 0);
    const rearAxle = new THREE.Vector3(-7.5, -3.5, 0);
    const frontAxle = new THREE.Vector3(7.5, -3.5, 0);
    const seatJoint = new THREE.Vector3(-2.2, 3.2, 0);
    const headTop = new THREE.Vector3(4.8, 4.2, 0);
    const headBot = new THREE.Vector3(4.4, 2.2, 0);
    const saddlePos = new THREE.Vector3(-2.8, 5.0, 0);
    const stemPos = new THREE.Vector3(5.6, 4.5, 0);

    // Frame Main Tubes
    bikeGroup.add(createTube(bb, seatJoint, 0.35, bikeMatFrame));
    bikeGroup.add(createTube(seatJoint, headTop, 0.32, bikeMatFrame));
    bikeGroup.add(createTube(bb, headBot, 0.42, bikeMatFrame));
    bikeGroup.add(createTube(headBot, headTop, 0.38, bikeMatFrame));

    // 3D Stays & Fork (Left/Right offsets)
    const zOff = 0.7;
    const rAxleL = new THREE.Vector3(-7.5, -3.5, zOff);
    const rAxleR = new THREE.Vector3(-7.5, -3.5, -zOff);
    const fAxleL = new THREE.Vector3(7.5, -3.5, zOff);
    const fAxleR = new THREE.Vector3(7.5, -3.5, -zOff);
    const bbL = new THREE.Vector3(0, -3.5, zOff * 0.5);
    const bbR = new THREE.Vector3(0, -3.5, -zOff * 0.5);

    bikeGroup.add(createTube(seatJoint, rAxleL, 0.16, bikeMatFrame));
    bikeGroup.add(createTube(seatJoint, rAxleR, 0.16, bikeMatFrame));
    bikeGroup.add(createTube(bbL, rAxleL, 0.18, bikeMatFrame));
    bikeGroup.add(createTube(bbR, rAxleR, 0.18, bikeMatFrame));
    bikeGroup.add(createTube(headBot, fAxleL, 0.20, bikeMatFrame));
    bikeGroup.add(createTube(headBot, fAxleR, 0.20, bikeMatFrame));

    // Seatpost & Saddle
    bikeGroup.add(createTube(seatJoint, saddlePos, 0.28, bikeMatCarbon));
    const saddleMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 0.9), bikeMatCarbon);
    saddleMesh.position.copy(saddlePos).add(new THREE.Vector3(-0.3, 0.25, 0));
    saddleMesh.rotation.z = -0.06;
    bikeGroup.add(saddleMesh);

    // Cockpit & Aerobars
    bikeGroup.add(createTube(headTop, stemPos, 0.22, bikeMatCarbon));
    bikeGroup.add(createTube(new THREE.Vector3(5.6, 4.5, 1.4), new THREE.Vector3(5.6, 4.5, -1.4), 0.15, bikeMatCarbon)); // Basebar
    bikeGroup.add(createTube(new THREE.Vector3(5.6, 4.7, 0.4), new THREE.Vector3(7.6, 5.0, 0.4), 0.12, bikeMatChrome)); // TT Ext L
    bikeGroup.add(createTube(new THREE.Vector3(5.6, 4.7, -0.4), new THREE.Vector3(7.6, 5.0, -0.4), 0.12, bikeMatChrome)); // TT Ext R

    // Rotating Wheel Generator
    function makeWheel(pos) {
      const wGroup = new THREE.Group();
      wGroup.position.copy(pos);

      // Aero Carbon Rim
      const rim = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.42, 16, 48), bikeMatTeal);
      wGroup.add(rim);

      // Rim Highlight Ring
      const rimRing = new THREE.Mesh(new THREE.TorusGeometry(3.38, 0.05, 8, 48), bikeMatChrome);
      wGroup.add(rimRing);

      // Hub
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, zOff * 2.2, 12), bikeMatChrome);
      hub.rotation.x = Math.PI / 2;
      wGroup.add(hub);

      // Radial Spokes
      const spokePts = [];
      const spokeNum = 24;
      for (let i = 0; i < spokeNum; i++) {
        const ang = (i / spokeNum) * Math.PI * 2;
        const rx = Math.cos(ang) * 3.4;
        const ry = Math.sin(ang) * 3.4;
        const fZ = (i % 2 === 0) ? (zOff * 0.8) : (-zOff * 0.8);
        spokePts.push(new THREE.Vector3(0, 0, fZ), new THREE.Vector3(rx, ry, 0));
      }
      const spokes = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(spokePts), bikeMatSpoke);
      wGroup.add(spokes);

      return wGroup;
    }

    const rearWheel = makeWheel(rearAxle);
    const frontWheel = makeWheel(frontAxle);
    bikeGroup.add(rearWheel);
    bikeGroup.add(frontWheel);

    // Rotating Crankset
    const crankGroup = new THREE.Group();
    crankGroup.position.copy(bb);
    const chainring = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.08, 24), bikeMatFrame);
    chainring.rotation.x = Math.PI / 2;
    chainring.position.z = zOff * 0.55;
    crankGroup.add(chainring);

    const crankL = createTube(new THREE.Vector3(0, 0, zOff * 0.7), new THREE.Vector3(0, -1.8, zOff * 0.7), 0.14, bikeMatChrome);
    const crankR = createTube(new THREE.Vector3(0, 0, -zOff * 0.7), new THREE.Vector3(0, 1.8, -zOff * 0.7), 0.14, bikeMatChrome);
    crankGroup.add(crankL);
    crankGroup.add(crankR);

    bikeGroup.add(crankGroup);

    // Store references for animation loop
    scene.userData.rearWheel = rearWheel;
    scene.userData.frontWheel = frontWheel;
    scene.userData.crankGroup = crankGroup;

    // 3D Scene Lights for realistic specular highlights
    const pLight1 = new THREE.PointLight(0xFF5A1F, 2.2, 60);
    pLight1.position.set(6, 12, 18);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x00D9C0, 2.2, 60);
    pLight2.position.set(-6, -6, 18);
    scene.add(pLight2);

    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.75));

    mainGroup.add(bikeGroup);
    bikeGroup.scale.set(0.85, 0.85, 0.85);
    bikeGroup.position.set(8, 0, 0);

    // Kinematic Biomechanical Data Particle Stream
    const particleCount = 320;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 55;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 28;

      const r = Math.random();
      if (r < 0.4) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.35; colors[i * 3 + 2] = 0.12;
      } else if (r < 0.75) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0.75;
      } else {
        colors[i * 3] = 0.83; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.0;
      }
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    mainGroup.add(particles);

  } else {
    // HOME 2: Dynamic Kinetic Wave Velocity Mesh
    const meshGeometry = new THREE.PlaneGeometry(60, 40, 28, 20);
    const meshMaterial = new THREE.MeshBasicMaterial({
      color: 0x00D9C0,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const kineticPlane = new THREE.Mesh(meshGeometry, meshMaterial);
    kineticPlane.rotation.x = -Math.PI / 3;
    kineticPlane.position.y = -6;
    mainGroup.add(kineticPlane);

    // Dynamic wave animation loop state
    scene.userData.kineticPlane = kineticPlane;
  }

  // Mouse interaction listener
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.0008;
    mouseY = (e.clientY - windowHalfY) * 0.0008;
  });

  // Responsive resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Render loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth camera / group rotation with mouse reaction
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = targetX * 1.5 + Math.sin(elapsedTime * 0.4) * 0.08;
    mainGroup.rotation.x = -targetY * 1.5;

    // Spin wheels & cranks for realistic motion
    if (scene.userData.rearWheel) {
      scene.userData.rearWheel.rotation.z -= 0.04;
      scene.userData.frontWheel.rotation.z -= 0.04;
      scene.userData.crankGroup.rotation.z -= 0.02;
    }

    if (scene.userData.kineticPlane) {
      const pos = scene.userData.kineticPlane.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.3 + elapsedTime * 2.0) * Math.cos(v * 0.3 + elapsedTime * 1.5) * 1.6;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. Pure JS 3D Tilt Card Engine with Dynamic Specular Glare
   -------------------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt], .card-center, .price-card');

  cards.forEach(card => {
    // Add glare overlay element if not present
    let glare = card.querySelector('.glare-overlay');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'glare-overlay';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (max +/- 10 deg)
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Update glare position
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    });
  });
}

/* --------------------------------------------------------------------------
   3. Intersection Observer Scroll Fade / Slide Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.card-center, .price-card, .process-step-card, .section-header');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s`;
    observer.observe(el);
  });
}
