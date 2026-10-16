import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Property, RoomHotspot } from '../types';
import {
  createGrassTexture,
  createWoodSlatsTexture,
  createStoneWallTexture,
  createStuccoTexture,
  createConcreteTexture,
  createPaverDrivewayTexture,
  createPorcelainTilesTexture,
  createPoolMosaicTexture,
} from '../utils/textureGenerator';
import { createAtmosphericSky } from '../utils/environmentSky';
import { buildHouseByStyle, HouseMaterials } from './houseBuilders';

export type CameraPreset = 'isometric' | 'front' | 'pool' | 'top';

interface Viewer3DProps {
  currentFloor: number; // 1 = Térreo, 2 = Completo, 3 = Explodido
  isNight: boolean;
  autoRotate: boolean;
  activeProperty: Property;
  allProperties: Property[];
  onSelectProperty: (property: Property) => void;
  selectedHotspot: RoomHotspot | null;
  onSelectHotspot: (hotspot: RoomHotspot | null) => void;
}

export const Viewer3D: React.FC<Viewer3DProps> = ({
  currentFloor,
  isNight,
  autoRotate,
  activeProperty,
  allProperties,
  onSelectProperty,
  selectedHotspot,
  onSelectHotspot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const upperFloorGroupRef = useRef<THREE.Group | null>(null);
  const roofGroupRef = useRef<THREE.Group | null>(null);
  const skyMeshRef = useRef<THREE.Mesh | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(22, 14, 22));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 0));
  const [activePreset, setActivePreset] = useState<CameraPreset>('isometric');
  const [houseSelectorOpen, setHouseSelectorOpen] = useState(false);
  const [photoMode, setPhotoMode] = useState(false); // Modo Foto / Cinema sem ícones

  const interiorLightsRef = useRef<THREE.PointLight[]>([]);
  const poolLightsRef = useRef<THREE.PointLight[]>([]);
  const landscapeLightsRef = useRef<THREE.SpotLight[]>([]);
  const lightsRef = useRef<{
    hemiLight?: THREE.HemisphereLight;
    dirLight?: THREE.DirectionalLight;
    backLight?: THREE.DirectionalLight;
  }>({});
  const hotspotMeshesRef = useRef<{ mesh: THREE.Mesh; hotspot: RoomHotspot }[]>([]);
  const isDraggingRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const [hoveredHotspot, setHoveredHotspot] = useState<RoomHotspot | null>(null);
  const materialsRef = useRef<HouseMaterials | null>(null);

  // Set camera angle preset
  const setCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (!houseGroupRef.current || !containerRef.current) return;

    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const isPortrait = aspect < 1;
    const m = isPortrait ? 1.35 : 1.0;

    if (preset === 'isometric') {
      targetCameraPosRef.current.set(22 * m, 15 * m, 22 * m);
      targetLookAtRef.current.set(0, 2.5, 0);
    } else if (preset === 'front') {
      targetCameraPosRef.current.set(0, 3.8 * m, 19 * m);
      targetLookAtRef.current.set(0, 2.8, 2);
    } else if (preset === 'pool') {
      targetCameraPosRef.current.set(17 * m, 5.5 * m, -12 * m);
      targetLookAtRef.current.set(3.5, 2, -2);
    } else if (preset === 'top') {
      targetCameraPosRef.current.set(0.1, 30 * m, 0.1);
      targetLookAtRef.current.set(0, 0, 0);
    }
  };

  // Rebuild house model whenever the active property changes
  const rebuildHouse = (prop: Property) => {
    if (!houseGroupRef.current || !materialsRef.current) return;

    const result = buildHouseByStyle(
      prop.modelStyle,
      houseGroupRef.current,
      materialsRef.current,
      prop.palette.wallColor,
      prop.palette.woodColor
    );

    upperFloorGroupRef.current = result.upperFloorGroup;
    roofGroupRef.current = result.roofGroup;
    interiorLightsRef.current = result.interiorLights;
    poolLightsRef.current = result.poolLights;
    landscapeLightsRef.current = result.landscapeLights;

    // Apply current floor visibility
    if (currentFloor === 1) {
      result.upperFloorGroup.visible = false;
      result.roofGroup.visible = false;
    } else if (currentFloor === 2) {
      result.upperFloorGroup.visible = true;
      result.roofGroup.visible = true;
      result.upperFloorGroup.position.y = 0;
      result.roofGroup.position.y = 0;
    } else if (currentFloor === 3) {
      result.upperFloorGroup.visible = true;
      result.roofGroup.visible = true;
      result.upperFloorGroup.position.y = 3.0;
      result.roofGroup.position.y = 2.5;
    }

    // Elegant architectural callout badges (no cartoon wireframe rings)
    hotspotMeshesRef.current = [];
    if (!photoMode) {
      const spots = prop.hotspots || [];
      const badgeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.2,
        clearcoat: 1.0,
      });
      const badgeBorderMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.3,
        metalness: 0.8,
      });

      spots.forEach((spot) => {
        const pinHolder = new THREE.Group();
        pinHolder.position.set(spot.position[0], spot.position[1], spot.position[2]);

        // Sleek architectural circular badge
        const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 24), badgeMat);
        badge.rotation.x = Math.PI / 2;
        badge.userData = { hotspot: spot };
        pinHolder.add(badge);

        const border = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.02, 8, 24), badgeBorderMat);
        pinHolder.add(border);

        // Core indicator dot
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0x111111 })
        );
        dot.position.z = 0.05;
        pinHolder.add(dot);

        houseGroupRef.current!.add(pinHolder);
        hotspotMeshesRef.current.push({ mesh: badge, hotspot: spot });
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup with Realistic Sky Gradient and Natural Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const dayBg = new THREE.Color(0xdceaf5);
    scene.background = dayBg;
    scene.fog = new THREE.FogExp2(0xdceaf5, 0.008);

    // Add Realistic Atmospheric Sky Dome
    const sky = createAtmosphericSky(isNight);
    scene.add(skyMeshRef.current = sky);

    // 2. High-grade Perspective Camera for Architectural Realism
    const aspect = container.clientWidth / container.clientHeight;
    const isPortrait = aspect < 1;
    const initialFov = isPortrait ? Math.min(60, 42 / aspect) : 40;
    const camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.5, 1000);
    const m = isPortrait ? 1.35 : 1.0;
    camera.position.set(22 * m, 14 * m, 22 * m);
    camera.lookAt(0, 2.5, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with Physically Correct Lighting Pipeline
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Procedural Studio Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 5. Realistic Daylight Lighting Rig (Sun, Sky and Earth fill)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x445544, 0.85);
    hemiLight.position.set(0, 40, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.45); // Warm Brazilian Sunlight
    dirLight.position.set(20, 28, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 80;
    const shadowD = 18;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x7da4d4, 0.4);
    backLight.position.set(-20, 14, -20);
    scene.add(backLight);

    lightsRef.current = { hemiLight, dirLight, backLight };

    // 6. Generate Realistic Procedural PBR Textures
    const grassTex = createGrassTexture();
    const woodTex = createWoodSlatsTexture();
    const stoneTex = createStoneWallTexture();
    const stuccoTex = createStuccoTexture();
    const concreteTex = createConcreteTexture();
    const paverTex = createPaverDrivewayTexture();
    const porcelainTex = createPorcelainTilesTexture();
    const poolMosaicTex = createPoolMosaicTexture();

    const mats: HouseMaterials = {
      grassMat: new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.82, metalness: 0.02 }),
      paverMat: new THREE.MeshStandardMaterial({ map: paverTex, roughness: 0.75, metalness: 0.05 }),
      porcelainMat: new THREE.MeshStandardMaterial({ map: porcelainTex, roughness: 0.12, metalness: 0.08 }),
      stoneWallMat: new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.82, metalness: 0.02 }),
      woodSlatMat: new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.5, metalness: 0.05 }),
      stuccoMat: new THREE.MeshStandardMaterial({ map: stuccoTex, roughness: 0.65, metalness: 0.02 }),
      darkAlumMat: new THREE.MeshStandardMaterial({ color: 0x181a1e, roughness: 0.28, metalness: 0.85 }),
      concreteMat: new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.78, metalness: 0.05 }),
      glassMat: new THREE.MeshPhysicalMaterial({
        color: 0x98c5d9,
        roughness: 0.04,
        transmission: 0.92,
        thickness: 0.6,
        ior: 1.52,
        reflectivity: 0.9,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      }),
      poolWaterMat: new THREE.MeshPhysicalMaterial({
        color: 0x00c8d7,
        roughness: 0.04,
        metalness: 0.1,
        transmission: 0.75,
        transparent: true,
        opacity: 0.88,
      }),
      poolMosaicTex,
      woodTex,
    };
    materialsRef.current = mats;

    // 7. Master House Group
    const houseGroup = new THREE.Group();
    scene.add(houseGroupRef.current = houseGroup);

    // Initial house build
    rebuildHouse(activeProperty);

    // 8. Interaction Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let initialPinchDist = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2) {
        isDraggingRef.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        return;
      }
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousPointerPosRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (initialPinchDist > 0) {
          const delta = dist - initialPinchDist;
          camera.fov = Math.max(20, Math.min(75, camera.fov - delta * 0.08));
          camera.updateProjectionMatrix();
        }
        initialPinchDist = dist;
        return;
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingRef.current && houseGroupRef.current) {
        const deltaX = clientX - previousPointerPosRef.current.x;
        houseGroupRef.current.rotation.y += deltaX * 0.007;
      }
      previousPointerPosRef.current = { x: clientX, y: clientY };

      const rect = container.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes = hotspotMeshesRef.current.map((h) => h.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const matched = hotspotMeshesRef.current.find((h) => h.mesh === intersects[0].object);
        if (matched) {
          setHoveredHotspot(matched.hotspot);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredHotspot(null);
      container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      initialPinchDist = 0;
      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      const rect = container.getBoundingClientRect();
      const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as MouseEvent).clientY;
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes = hotspotMeshesRef.current.map((h) => h.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const matched = hotspotMeshesRef.current.find((h) => h.mesh === intersects[0].object);
        if (matched) {
          onSelectHotspot(matched.hotspot);
        }
      }
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newAspect = container.clientWidth / container.clientHeight;
      const isP = newAspect < 1;
      camera.aspect = newAspect;
      camera.fov = isP ? Math.min(60, 42 / newAspect) : 40;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      camera.position.lerp(targetCameraPosRef.current, 0.06);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.06);
      camera.lookAt(currentLookAtRef.current);

      if (!isDraggingRef.current && autoRotate && houseGroupRef.current) {
        houseGroupRef.current.rotation.y += 0.0012;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Re-run build whenever active property or photo mode changes
  useEffect(() => {
    rebuildHouse(activeProperty);
  }, [activeProperty, photoMode]);

  // Floor Level Adjustments
  useEffect(() => {
    if (!upperFloorGroupRef.current || !roofGroupRef.current) return;

    if (currentFloor === 1) {
      upperFloorGroupRef.current.visible = false;
      roofGroupRef.current.visible = false;
      upperFloorGroupRef.current.position.y = 0;
    } else if (currentFloor === 2) {
      upperFloorGroupRef.current.visible = true;
      roofGroupRef.current.visible = true;
      upperFloorGroupRef.current.position.y = 0;
      roofGroupRef.current.position.y = 0;
    } else if (currentFloor === 3) {
      upperFloorGroupRef.current.visible = true;
      roofGroupRef.current.visible = true;
      upperFloorGroupRef.current.position.y = 3.0;
      roofGroupRef.current.position.y = 2.5;
    }
  }, [currentFloor]);

  // Day & Night Lighting and Sky Adjustments
  useEffect(() => {
    const { hemiLight, dirLight, backLight } = lightsRef.current;
    if (!hemiLight || !dirLight || !backLight || !sceneRef.current) return;

    // Update Atmospheric Sky
    if (skyMeshRef.current) {
      sceneRef.current.remove(skyMeshRef.current);
      skyMeshRef.current.geometry.dispose();
    }
    const newSky = createAtmosphericSky(isNight);
    sceneRef.current.add(skyMeshRef.current = newSky);

    if (isNight) {
      const nightColor = new THREE.Color(0x0e1726);
      sceneRef.current.background = nightColor;
      sceneRef.current.fog = new THREE.FogExp2(0x0e1726, 0.012);

      hemiLight.intensity = 0.18;
      dirLight.intensity = 0.15;
      backLight.intensity = 0.65;
      backLight.color.setHex(0x406085);

      interiorLightsRef.current.forEach((light) => {
        light.intensity = 3.8;
      });
      poolLightsRef.current.forEach((light) => {
        light.intensity = 3.4;
      });
      landscapeLightsRef.current.forEach((light) => {
        light.intensity = 4.8;
      });
    } else {
      const dayColor = new THREE.Color(0xdceaf5);
      sceneRef.current.background = dayColor;
      sceneRef.current.fog = new THREE.FogExp2(0xdceaf5, 0.008);

      hemiLight.intensity = 0.85;
      dirLight.intensity = 1.45;
      backLight.intensity = 0.4;
      backLight.color.setHex(0x7da4d4);

      interiorLightsRef.current.forEach((light) => {
        light.intensity = 0.6;
      });
      poolLightsRef.current.forEach((light) => {
        light.intensity = 0.9;
      });
      landscapeLightsRef.current.forEach((light) => {
        light.intensity = 0;
      });
    }
  }, [isNight]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* House Model Switcher (Top Left Pill / Dropdown) */}
      <div className="absolute top-14 sm:top-20 left-3 sm:left-6 z-30 select-none">
        <button
          onClick={() => setHouseSelectorOpen(!houseSelectorOpen)}
          className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0d1b2a]/95 border border-[#39ff14] text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)] backdrop-blur-md hover:bg-[#39ff14]/10 active:scale-95 transition"
        >
          <i className="fa-solid fa-house-laptop text-[#39ff14]" />
          <span>Trocar Modelo ({allProperties.length})</span>
          <i className={`fa-solid fa-chevron-${houseSelectorOpen ? 'up' : 'down'} text-[10px] text-gray-400`} />
        </button>

        {/* Dropdown with all house architectural options */}
        {houseSelectorOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#0d1b2a]/95 border border-[#39ff14]/50 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-md space-y-1 max-h-[70vh] overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider border-b border-white/10 flex justify-between">
              <span>Modelos Arquitetônicos Reais</span>
              <span className="text-[#39ff14]">{allProperties.length} Opções</span>
            </div>
            {allProperties.map((prop) => {
              const isSelected = prop.id === activeProperty.id;
              return (
                <button
                  key={prop.id}
                  onClick={() => {
                    onSelectProperty(prop);
                    setHouseSelectorOpen(false);
                    setCameraPreset('isometric');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between border ${
                    isSelected
                      ? 'bg-[#39ff14]/20 border-[#39ff14] text-white shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold leading-snug">{prop.title}</div>
                    <div className="text-[10px] text-gray-400">
                      {prop.area} m² • {prop.suites} Suítes • {prop.neighborhood}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#39ff14] whitespace-nowrap ml-2">
                    {prop.purpose === 'venda'
                      ? `R$ ${(prop.price / 1000000).toFixed(2)}M`
                      : `R$ ${prop.price.toLocaleString('pt-BR')}/m`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Camera View Angle Presets Pill Bar + Cinema / Foto Mode Toggle */}
      <div className="absolute top-24 sm:top-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 sm:gap-1.5 bg-[#0d1b2a]/90 border border-white/10 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full shadow-2xl backdrop-blur-md max-w-[95vw] overflow-x-auto">
        <button
          onClick={() => setCameraPreset('isometric')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition ${
            activePreset === 'isometric'
              ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-cube mr-1 text-[9px] sm:text-[10px]" />
          Isométrica
        </button>

        <button
          onClick={() => setCameraPreset('front')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition ${
            activePreset === 'front'
              ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-door-open mr-1 text-[9px] sm:text-[10px]" />
          Fachada
        </button>

        <button
          onClick={() => setCameraPreset('pool')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition ${
            activePreset === 'pool'
              ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-water-ladder mr-1 text-[9px] sm:text-[10px]" />
          Piscina & Lazer
        </button>

        <button
          onClick={() => setCameraPreset('top')}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition ${
            activePreset === 'top'
              ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-layer-group mr-1 text-[9px] sm:text-[10px]" />
          Planta Superior
        </button>

        {/* Photorealistic Cinema Mode (Clean view without callout pins) */}
        <button
          onClick={() => setPhotoMode(!photoMode)}
          title={photoMode ? 'Mostrar Pontos de Interesse' : 'Modo Foto Realista (Ocultar Marcadores)'}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition ml-1 border ${
            photoMode
              ? 'bg-[#39ff14] text-black border-[#39ff14] font-bold shadow-[0_0_10px_rgba(57,255,20,0.5)]'
              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-camera mr-1 text-[9px] sm:text-[10px]" />
          {photoMode ? 'Foto Real' : 'Modo Foto'}
        </button>
      </div>

      {/* Hover tooltip for 3D room hotspots */}
      {!photoMode && hoveredHotspot && (
        <div className="absolute top-36 sm:top-40 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-900/95 border border-[#ff007f]/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.3)] backdrop-blur-md flex items-center gap-2.5 max-w-[90vw]">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14] shrink-0" />
          <div className="truncate">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white truncate">
              {hoveredHotspot.name} <span className="text-[#39ff14] font-mono">({hoveredHotspot.area})</span>
            </div>
            <div className="text-[10px] text-slate-300 hidden xs:block">Toque para ver memorial descritivo</div>
          </div>
        </div>
      )}
    </div>
  );
};
