import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BrandTokens, Scene3DSettings } from '../data/studioData';
import { compute3DMonolithLayout } from '../utils/studioLogic';

interface FragmentCanvas3DProps {
  sceneSettings: Scene3DSettings;
  tokens: BrandTokens;
  logoUrl: string;
  scrollProgress: number;
}

/**
 * True Three.js WebGL 3D Scene for Sherif Mohsen's Portfolio.
 * Features:
 * 1. Central 3D Sculpted Calligraphic Emblem Medallion (multi-part Group with beveled metallic cylinder,
 *    glowing gold rim torus, and double-sided textured calligraphic crest).
 * 2. Extruded 3D Architectural Monoliths (multi-part Groups with ExtrudeGeometry beveled bodies,
 *    recessed obsidian cores, and luminous wireframe/edge frames).
 * 3. Orbital 3D Torus Rings & Drifting 3D Particle Field.
 * 4. Cursor-responsive parallax + Scroll-driven camera & monolith choreography.
 * 5. Software WebGL detection (`isSoftwareGl`) and `afterDraw` pacing for reliable headless Chromium rendering.
 */
export const FragmentCanvas3D: React.FC<FragmentCanvas3DProps> = ({
  sceneSettings,
  tokens,
  logoUrl,
  scrollProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  const configRef = useRef({ sceneSettings, tokens });

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    configRef.current = { sceneSettings, tokens };
  }, [sceneSettings, tokens]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe/i.test(rendererInfo);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(tokens.background || '#0B0B0B', 0.042);

    const camera = new THREE.PerspectiveCamera(
      45,
      (container.clientWidth || window.innerWidth) /
        (container.clientHeight || window.innerHeight),
      0.1,
      100
    );
    camera.position.set(0, 0.2, 10.5);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f0e8, 2.2);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(tokens.accent || '#FFB629', 4.5, 22);
    rimLight.position.set(-4.5, 2.5, 4.5);
    scene.add(rimLight);

    const backLight = new THREE.DirectionalLight(0x8a7450, 1.4);
    backLight.position.set(-5, -6, -4);
    scene.add(backLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. CENTRAL 3D SCULPTED CALLIGRAPHIC MEDALLION GROUP
    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(2.4, 0.35, 0.4);
    worldGroup.add(medallionGroup);

    const coinGeo = new THREE.CylinderGeometry(1.72, 1.72, 0.28, isSoftwareGl ? 32 : 64);
    coinGeo.rotateX(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#121212'),
      metalness: 0.85,
      roughness: 0.22,
    });
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    medallionGroup.add(coinMesh);

    const outerRimGeo = new THREE.TorusGeometry(1.76, 0.075, 20, isSoftwareGl ? 48 : 96);
    const outerRimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tokens.lightSurface || '#F4F0E8'),
      metalness: 0.92,
      roughness: 0.16,
    });
    const outerRimMesh = new THREE.Mesh(outerRimGeo, outerRimMat);
    medallionGroup.add(outerRimMesh);

    const innerRimGeo = new THREE.TorusGeometry(1.58, 0.028, 16, isSoftwareGl ? 40 : 80);
    const innerRimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tokens.accent || '#FFB629'),
      emissive: new THREE.Color(tokens.accent || '#FFB629'),
      emissiveIntensity: 0.65,
      metalness: 0.5,
      roughness: 0.2,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeo, innerRimMat);
    innerRimMesh.position.z = 0.145;
    medallionGroup.add(innerRimMesh);

    const innerRimBack = innerRimMesh.clone();
    innerRimBack.position.z = -0.145;
    medallionGroup.add(innerRimBack);

    const faceGeo = new THREE.CircleGeometry(1.56, isSoftwareGl ? 32 : 64);
    // An unlit logo face retains the precise black, white and gold artwork.
    // The surrounding medallion and rings remain physically lit metallic 3D.
    const faceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      logoUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        // The supplied logo includes a separate wordmark below the round crest.
        // Show the round crest on the 3D coin without cropping source files.
        if (logoUrl.includes('sherif-mohsen-gold-logo')) {
          tex.repeat.set(1, 0.89);
          tex.offset.set(0, 0.11);
        }
        faceMat.map = tex;
        faceMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    const frontFace = new THREE.Mesh(faceGeo, faceMat);
    frontFace.position.z = 0.146;
    medallionGroup.add(frontFace);

    const backFace = new THREE.Mesh(faceGeo, faceMat);
    backFace.rotation.y = Math.PI;
    backFace.position.z = -0.146;
    medallionGroup.add(backFace);

    const gyroRingGeo = new THREE.TorusGeometry(2.35, 0.018, 12, isSoftwareGl ? 48 : 96);
    const gyroRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tokens.accent || '#FFB629'),
      emissive: new THREE.Color(tokens.accent || '#FFB629'),
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.72,
    });
    const gyroRingMesh = new THREE.Mesh(gyroRingGeo, gyroRingMat);
    gyroRingMesh.rotation.x = Math.PI / 3;
    medallionGroup.add(gyroRingMesh);

    // 2. EXTRUDED 3D ARCHITECTURAL MONOLITHS (Composite 3-Part Groups)
    const monolithsContainer = new THREE.Group();
    worldGroup.add(monolithsContainer);

    const createRoundedRectShape = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x, y + r);
      shape.lineTo(x, y + h - r);
      shape.quadraticCurveTo(x, y + h, x + r, y + h);
      shape.lineTo(x + w - r, y + h);
      shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
      shape.lineTo(x + w, y + r);
      shape.quadraticCurveTo(x + w, y, x + w - r, y);
      shape.lineTo(x + r, y);
      shape.quadraticCurveTo(x, y, x, y + r);
      return shape;
    };

    const slabShape = createRoundedRectShape(1.55, 2.25, 0.12);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 1,
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: isSoftwareGl ? 2 : 4,
    };

    const slabGeo = new THREE.ExtrudeGeometry(slabShape, extrudeSettings);
    slabGeo.center();

    const coreGeo = new THREE.BoxGeometry(1.18, 1.82, 0.38);
    const edgeGeo = new THREE.EdgesGeometry(slabGeo, 25);

    const slabBodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1C1C1C'),
      metalness: 0.78,
      roughness: 0.24,
    });

    const slabIvoryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tokens.lightSurface || '#F4F0E8'),
      metalness: 0.45,
      roughness: 0.32,
    });

    const slabCoreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0A0A0A'),
      metalness: 0.9,
      roughness: 0.15,
    });

    const accentEdgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(tokens.accent || '#FFB629'),
      transparent: true,
      opacity: 0.55,
    });

    const ivoryEdgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(tokens.lightSurface || '#F4F0E8'),
      transparent: true,
      opacity: 0.28,
    });

    const effectiveCount = Math.max(
      4,
      Math.min(isSoftwareGl ? 10 : 12, sceneSettings.monolithCount)
    );
    const monolithMeshes: THREE.Group[] = [];

    for (let i = 0; i < effectiveCount; i++) {
      const itemGroup = new THREE.Group();
      const isAccentPiece = i % 3 === 0;
      const isIvoryPiece = i % 4 === 1;

      const bodyMesh = new THREE.Mesh(
        slabGeo,
        isIvoryPiece ? slabIvoryMat : slabBodyMat
      );
      itemGroup.add(bodyMesh);

      const coreMesh = new THREE.Mesh(coreGeo, slabCoreMat);
      itemGroup.add(coreMesh);

      const wireLines = new THREE.LineSegments(
        edgeGeo,
        isAccentPiece ? accentEdgeMat : ivoryEdgeMat
      );
      itemGroup.add(wireLines);

      monolithsContainer.add(itemGroup);
      monolithMeshes.push(itemGroup);
    }

    // 3. LARGE ARCHITECTURAL ORBITAL GRID RING
    const orbitalGridGeo = new THREE.TorusGeometry(5.6, 0.012, 8, isSoftwareGl ? 64 : 120);
    const orbitalGridMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(tokens.lightSurface || '#F4F0E8'),
      transparent: true,
      opacity: 0.16,
    });
    const orbitalGridRing = new THREE.Mesh(orbitalGridGeo, orbitalGridMat);
    orbitalGridRing.rotation.x = Math.PI / 2.3;
    orbitalGridRing.rotation.y = -0.22;
    worldGroup.add(orbitalGridRing);

    // 4. AMBIENT 3D DRIFTING PARTICLES
    const pCount = isSoftwareGl ? 32 : 85;
    const particlePositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2 * 3.7;
      const rad = 2.5 + ((i * 1.37) % 7.5);
      particlePositions[i * 3] = Math.cos(angle) * rad;
      particlePositions[i * 3 + 1] = (((i * 0.73) % 1) - 0.5) * 8.5;
      particlePositions[i * 3 + 2] = Math.sin(angle) * rad - 2.0;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(tokens.accent || '#FFB629'),
      size: 0.065,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particleSystem);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: MouseEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const afterDraw = (cb: () => void) =>
      requestAnimationFrame(() => setTimeout(cb, 0));

    let disposed = false;
    let rafId = 0;
    const startTime = performance.now();

    const updateScene = (elapsedSec: number) => {
      const { sceneSettings: cfg, tokens: tk } = configRef.current;
      const sp = scrollRef.current;
      const speed = prefersReducedMotion ? 0 : cfg.motionIntensity;

      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      rimLight.color.set(tk.accent || '#FFB629');
      innerRimMat.color.set(tk.accent || '#FFB629');
      innerRimMat.emissive.set(tk.accent || '#FFB629');
      gyroRingMat.color.set(tk.accent || '#FFB629');
      accentEdgeMat.color.set(tk.accent || '#FFB629');
      particleMat.color.set(tk.accent || '#FFB629');
      outerRimMat.color.set(tk.lightSurface || '#F4F0E8');
      slabIvoryMat.color.set(tk.lightSurface || '#F4F0E8');

      medallionGroup.visible = cfg.medallionVisible;
      orbitalGridRing.visible = cfg.orbitalRings;
      gyroRingMesh.visible = cfg.orbitalRings;
      particleSystem.visible = cfg.ambientParticles;

      const poses = compute3DMonolithLayout(
        sp,
        pointer.x,
        pointer.y,
        elapsedSec,
        monolithMeshes.length,
        speed
      );

      for (let i = 0; i < monolithMeshes.length; i++) {
        const mesh = monolithMeshes[i];
        const p = poses[i];
        if (!p) continue;
        mesh.position.set(p.x, p.y, p.z);
        mesh.rotation.set(p.rx, p.ry, p.rz);
        mesh.scale.set(p.scale, p.scale, p.scale);
      }

      const isMobileViewport = window.innerWidth < 900;
      const baseMedallionX = isMobileViewport ? 0 : 2.55 - sp * 1.8;
      const baseMedallionY = isMobileViewport
        ? 1.35 - sp * 1.1
        : 0.25 + Math.sin(elapsedSec * 0.9) * 0.18;
      medallionGroup.position.set(
        baseMedallionX + pointer.x * 0.35,
        baseMedallionY + pointer.y * 0.25,
        0.5 - sp * 1.4
      );

      medallionGroup.rotation.y =
        Math.sin(elapsedSec * 0.55 * speed) * 0.48 +
        pointer.x * 0.42 +
        sp * Math.PI * 1.2;
      medallionGroup.rotation.x =
        Math.cos(elapsedSec * 0.42 * speed) * 0.16 - pointer.y * 0.24;

      gyroRingMesh.rotation.z = elapsedSec * 0.45 * speed;
      gyroRingMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedSec * 0.6) * 0.35;

      orbitalGridRing.rotation.z = elapsedSec * 0.08 * speed + sp * 1.2;
      particleSystem.rotation.y = elapsedSec * 0.05 * speed + pointer.x * 0.15;
      particleSystem.position.y = sp * 1.8;

      camera.position.x = pointer.x * 0.55;
      camera.position.y = 0.2 + pointer.y * 0.35 - sp * 0.65;
      camera.lookAt(0, -sp * 0.4, 0);
    };

    updateScene(0.8);
    renderer.render(scene, camera);

    const tick = () => {
      if (disposed) return;
      const elapsedSec = (performance.now() - startTime) * 0.001 + 0.8;
      updateScene(elapsedSec);
      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          rafId = requestAnimationFrame(tick);
        }
      }
    };

    if (!prefersReducedMotion) {
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      envMap.dispose();
      coinGeo.dispose();
      coinMat.dispose();
      outerRimGeo.dispose();
      outerRimMat.dispose();
      innerRimGeo.dispose();
      innerRimMat.dispose();
      faceGeo.dispose();
      faceMat.dispose();
      gyroRingGeo.dispose();
      gyroRingMat.dispose();
      slabGeo.dispose();
      coreGeo.dispose();
      edgeGeo.dispose();
      slabBodyMat.dispose();
      slabIvoryMat.dispose();
      slabCoreMat.dispose();
      accentEdgeMat.dispose();
      ivoryEdgeMat.dispose();
      orbitalGridGeo.dispose();
      orbitalGridMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [logoUrl, sceneSettings.monolithCount]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
