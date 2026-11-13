import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BrandTokens, Scene3DSettings } from '../data/studioData';

interface FragmentCanvas3DProps {
  sceneSettings: Scene3DSettings;
  tokens: BrandTokens;
  logoUrl: string;
  scrollProgress: number;
}

/**
 * A single floating 3D Sherif Mohsen medallion, centered on all screens.
 * The original crest, metallic rims, lighting and attached gold gyro ring are
 * preserved. No background monoliths, floating cards or particles are created.
 * Pointer movement gently tilts and offsets the crest without hiding the art.
 */
export const FragmentCanvas3D: React.FC<FragmentCanvas3DProps> = ({
  sceneSettings,
  tokens,
  logoUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const configRef = useRef({ sceneSettings, tokens });

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
    camera.position.set(0, 0, 10.5);
    camera.lookAt(0, 0, 0);

    // Fit the entire medallion and its surrounding ring, even on narrow phones.
    // Compared with the old composition, the crest is larger on both desktop
    // and mobile, without allowing it to clip past the visible viewport.
    const viewport = {
      compact: false,
      scale: 1,
    };

    const updateViewport = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      const visibleHeight = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const visibleWidth = visibleHeight * camera.aspect;
      const ringDiameter = 4.9;
      viewport.compact = width < 900 && camera.aspect < 1.15;
      viewport.scale = Math.min(
        1.38,
        (visibleWidth * 0.86) / ringDiameter,
        (visibleHeight * 0.82) / ringDiameter
      );
      return { width, height };
    };
    updateViewport();

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
    medallionGroup.position.set(0, 0, 0.5);
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

    // The medallion is deliberately the only floating 3D object.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleWindowBlur = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', handleWindowBlur);

    const handleResize = () => {
      if (!container) return;
      const { width, height } = updateViewport();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const afterDraw = (cb: () => void) =>
      requestAnimationFrame(() => setTimeout(cb, 0));

    let disposed = false;
    let rafId = 0;
    const startTime = performance.now();

    const updateScene = (elapsedSec: number) => {
      const { sceneSettings: cfg, tokens: tk } = configRef.current;
      const speed = prefersReducedMotion ? 0 : THREE.MathUtils.clamp(cfg.motionIntensity, 0, 2);

      // Inertia makes the crest feel suspended rather than pinned to the cursor.
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;

      rimLight.color.set(tk.accent || '#FFB629');
      innerRimMat.color.set(tk.accent || '#FFB629');
      innerRimMat.emissive.set(tk.accent || '#FFB629');
      gyroRingMat.color.set(tk.accent || '#FFB629');
      outerRimMat.color.set(tk.lightSurface || '#F4F0E8');

      medallionGroup.visible = cfg.medallionVisible;
      gyroRingMesh.visible = cfg.orbitalRings;
      medallionGroup.scale.setScalar(viewport.scale);

      const driftX = Math.sin(elapsedSec * 0.4 * speed) * (viewport.compact ? 0.05 : 0.11);
      const driftY = Math.sin(elapsedSec * 0.69 * speed) * (viewport.compact ? 0.12 : 0.21);
      const pointerTravel = viewport.compact ? 0.09 : 0.27;
      medallionGroup.position.set(
        driftX + pointer.x * pointerTravel,
        driftY + pointer.y * pointerTravel * 0.68,
        0.5 + Math.cos(elapsedSec * 0.53 * speed) * 0.11
      );

      medallionGroup.rotation.y =
        Math.sin(elapsedSec * 0.46 * speed) * 0.23 +
        pointer.x * 0.34;
      medallionGroup.rotation.x =
        Math.cos(elapsedSec * 0.4 * speed) * 0.11 -
        pointer.y * 0.2;

      gyroRingMesh.rotation.z = elapsedSec * 0.3 * speed;
      gyroRingMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedSec * 0.42 * speed) * 0.14;
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
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handleWindowBlur);
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
      renderer.dispose();
    };
  }, [logoUrl]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
