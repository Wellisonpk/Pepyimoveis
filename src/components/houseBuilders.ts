import * as THREE from 'three';
import { HouseModelStyle } from '../types';

export interface HouseMaterials {
  grassMat: THREE.Material;
  paverMat: THREE.Material;
  porcelainMat: THREE.Material;
  stoneWallMat: THREE.Material;
  woodSlatMat: THREE.Material;
  stuccoMat: THREE.Material;
  darkAlumMat: THREE.Material;
  concreteMat: THREE.Material;
  glassMat: THREE.Material;
  poolWaterMat: THREE.Material;
  poolMosaicTex: THREE.Texture;
  woodTex: THREE.Texture;
}

export interface BuildHouseResult {
  groundFloorGroup: THREE.Group;
  upperFloorGroup: THREE.Group;
  roofGroup: THREE.Group;
  interiorLights: THREE.PointLight[];
  poolLights: THREE.PointLight[];
  landscapeLights: THREE.SpotLight[];
}

export function buildHouseByStyle(
  style: HouseModelStyle,
  houseGroup: THREE.Group,
  mats: HouseMaterials,
  wallColor = 0xf5f5f7,
  woodColor = 0x8b5a2b
): BuildHouseResult {
  // Clear any existing children of houseGroup
  while (houseGroup.children.length > 0) {
    houseGroup.remove(houseGroup.children[0]);
  }

  const interiorLights: THREE.PointLight[] = [];
  const poolLights: THREE.PointLight[] = [];
  const landscapeLights: THREE.SpotLight[] = [];

  // ==========================================
  // REALISTIC SURROUNDINGS (STREET, CURB, LOT)
  // ==========================================
  // 1. Street Asphalt in front of the lot (Condomínio Fechado)
  const asphaltMat = new THREE.MeshStandardMaterial({
    color: 0x22262c,
    roughness: 0.9,
    metalness: 0.05,
  });
  const street = new THREE.Mesh(new THREE.BoxGeometry(32, 0.45, 8), asphaltMat);
  street.position.set(0, -0.25, 17.5);
  street.receiveShadow = true;
  houseGroup.add(street);

  // Concrete Curb (Meio-Fio)
  const curbMat = new THREE.MeshStandardMaterial({ color: 0x90949c, roughness: 0.8 });
  const curb = new THREE.Mesh(new THREE.BoxGeometry(32, 0.25, 0.4), curbMat);
  curb.position.set(0, -0.05, 13.6);
  curb.receiveShadow = true;
  curb.castShadow = true;
  houseGroup.add(curb);

  // Main Manicured Lawn Base
  const lotBase = new THREE.Mesh(new THREE.BoxGeometry(28, 0.5, 27), mats.grassMat);
  lotBase.position.set(0, -0.22, 0);
  lotBase.receiveShadow = true;
  houseGroup.add(lotBase);

  // Extended Green Landscape Buffer around the lot (no floating void)
  const bufferMat = new THREE.MeshStandardMaterial({ color: 0x1a331c, roughness: 0.95 });
  const landscapeBuffer = new THREE.Mesh(new THREE.BoxGeometry(70, 0.3, 70), bufferMat);
  landscapeBuffer.position.set(0, -0.35, 0);
  landscapeBuffer.receiveShadow = true;
  houseGroup.add(landscapeBuffer);

  // Concrete Boundary Walls with Architectural Shadow Reveals
  const boundaryMat = new THREE.MeshStandardMaterial({ color: 0x2b3440, roughness: 0.7 });
  const rearWall = new THREE.Mesh(new THREE.BoxGeometry(28, 2.4, 0.35), boundaryMat);
  rearWall.position.set(0, 1.2, -13.3);
  rearWall.castShadow = true;
  rearWall.receiveShadow = true;
  houseGroup.add(rearWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 27), boundaryMat);
  leftWall.position.set(-13.8, 1.2, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  houseGroup.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.4, 27), boundaryMat);
  rightWall.position.set(13.8, 1.2, 0);
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  houseGroup.add(rightWall);

  // Realistic Organic Tropical Landscaping (Palmeiras Imperiais Reais)
  const buildRealisticPalm = (x: number, z: number, scale = 1.0) => {
    const palmGroup = new THREE.Group();
    palmGroup.position.set(x, 0, z);

    // Segmented Trunk with realistic natural curvature
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d3c2e, roughness: 0.9 });
    for (let s = 0; s < 12; s++) {
      const h = 0.6 * scale;
      const r = (0.28 - s * 0.01) * scale;
      const segment = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.95, r, h, 14), trunkMat);
      segment.position.set(Math.sin(s * 0.15) * 0.08 * scale, s * h + h / 2, 0);
      segment.castShadow = true;
      palmGroup.add(segment);
    }

    // Curved Drooping Fronds (Folhas em Leque Naturais)
    const frondMat = new THREE.MeshStandardMaterial({
      color: 0x276730,
      roughness: 0.55,
      side: THREE.DoubleSide,
    });
    const numFronds = 14;
    for (let f = 0; f < numFronds; f++) {
      const angle = (f / numFronds) * Math.PI * 2;
      const frondGroup = new THREE.Group();
      frondGroup.position.set(0, 7.2 * scale, 0);
      frondGroup.rotation.y = angle;

      // Stem curve
      const stem = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * scale, 0.04 * scale, 3.6 * scale),
        frondMat
      );
      stem.position.set(0, -0.4 * scale, 1.8 * scale);
      stem.rotation.x = -0.35;
      stem.castShadow = true;
      frondGroup.add(stem);

      // Leaf blade feathers
      const feathers = new THREE.Mesh(
        new THREE.BoxGeometry(0.7 * scale, 0.02 * scale, 3.0 * scale),
        frondMat
      );
      feathers.position.set(0, -0.5 * scale, 2.0 * scale);
      feathers.rotation.x = -0.4;
      feathers.castShadow = true;
      frondGroup.add(feathers);

      palmGroup.add(frondGroup);
    }

    // Uplight on palm trunk
    const uplight = new THREE.SpotLight(0xfff1cf, 0, 14, Math.PI / 4, 0.5);
    uplight.position.set(0.6, 0.1, 0.6);
    uplight.target = palmGroup;
    palmGroup.add(uplight);
    landscapeLights.push(uplight);

    return palmGroup;
  };

  houseGroup.add(buildRealisticPalm(10.5, 9.5, 1.0));
  houseGroup.add(buildRealisticPalm(11.8, 4.5, 0.85));

  // Organic Flowering Bushes & Ornamental Shrubs (Strelitzias & Podocarpos)
  const buildOrganicBush = (x: number, y: number, z: number, r: number) => {
    const bushGroup = new THREE.Group();
    bushGroup.position.set(x, y, z);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x205626, roughness: 0.75 });
    for (let i = 0; i < 6; i++) {
      const cluster = new THREE.Mesh(new THREE.SphereGeometry(r * (0.6 + Math.random() * 0.4), 10, 10), leafMat);
      cluster.position.set(
        (Math.random() - 0.5) * r * 0.7,
        (Math.random() * 0.5) * r,
        (Math.random() - 0.5) * r * 0.7
      );
      cluster.scale.set(1.0, 0.85, 1.0);
      cluster.castShadow = true;
      bushGroup.add(cluster);
    }
    return bushGroup;
  };

  const bushCoords = [
    [4.5, 0.2, 8.5, 0.7],
    [2.8, 0.2, 8.5, 0.6],
    [-2.5, 0.2, 8.5, 0.8],
    [-11.5, 0.2, 2.0, 1.1],
    [-11.5, 0.2, 6.0, 0.95],
    [-11.5, 0.2, -4.0, 1.0],
  ];
  bushCoords.forEach(([bx, by, bz, br]) => {
    houseGroup.add(buildOrganicBush(bx, by, bz, br));
  });

  // Concrete Stepping Stones in Lawn
  for (let i = 0; i < 5; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), mats.stuccoMat);
    step.position.set(5.0, 0.04, 5.5 + i * 1.4);
    step.receiveShadow = true;
    step.castShadow = true;
    houseGroup.add(step);
  }

  // Realistic Luxury SUV in Garage
  const buildRealisticCar = () => {
    const carGroup = new THREE.Group();
    const carPaintMat = new THREE.MeshPhysicalMaterial({
      color: 0x161a22,
      roughness: 0.15,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const tintedGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.3,
      transparent: true,
      opacity: 0.9,
    });

    // Lower Aerodynamic Chassis
    const bodyBottom = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.75, 4.8), carPaintMat);
    bodyBottom.position.y = 0.55;
    bodyBottom.castShadow = true;
    carGroup.add(bodyBottom);

    // Contoured Cabin with Sloped Windshield
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.68, 2.8), tintedGlassMat);
    cabin.position.set(0, 1.25, -0.2);
    cabin.castShadow = true;
    carGroup.add(cabin);

    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.06, 2.4), carPaintMat);
    roofCap.position.set(0, 1.6, -0.2);
    carGroup.add(roofCap);

    // Wheels & Alloy Rims
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.85 });
    const alloyMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.9, roughness: 0.2 });
    [
      [-1.18, 0.38, 1.45],
      [1.18, 0.38, 1.45],
      [-1.18, 0.38, -1.45],
      [1.18, 0.38, -1.45],
    ].forEach(([wx, wy, wz]) => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 20), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wx, wy, wz);
      tire.castShadow = true;
      carGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.29, 10), alloyMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, wy, wz);
      carGroup.add(rim);
    });

    // LED Headlight Strip
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headlight = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.06, 0.05), headlightMat);
    headlight.position.set(0, 0.75, 2.41);
    carGroup.add(headlight);

    // Red Tail Light Bar
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff1122 });
    const taillight = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.05, 0.05), taillightMat);
    taillight.position.set(0, 0.85, -2.41);
    carGroup.add(taillight);

    return carGroup;
  };

  const groundFloorGroup = new THREE.Group();
  const upperFloorGroup = new THREE.Group();
  const roofGroup = new THREE.Group();

  houseGroup.add(groundFloorGroup);
  houseGroup.add(upperFloorGroup);
  upperFloorGroup.add(roofGroup);

  // ==========================================
  // MODEL 1: SOBRADO CONTEMPORÂNEO TERRA & LUZ
  // ==========================================
  if (style === 'sobrado-terra') {
    // Driveway with sand-joint pavers
    const driveway = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.52, 9.5), mats.paverMat);
    driveway.position.set(-6.2, -0.21, 8.2);
    driveway.receiveShadow = true;
    houseGroup.add(driveway);

    const mainWalkway = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.52, 8.0), mats.paverMat);
    mainWalkway.position.set(0.6, -0.21, 8.8);
    mainWalkway.receiveShadow = true;
    houseGroup.add(mainWalkway);

    // Swimming Pool with Submerged Wet Deck (Prainha)
    const poolBox = new THREE.Group();
    poolBox.position.set(6.8, 0, -4.5);
    const poolShell = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.3, 5.6), mats.darkAlumMat);
    poolShell.position.y = -0.65;
    poolBox.add(poolShell);

    const poolFloor = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.05, 5.0),
      new THREE.MeshStandardMaterial({ map: mats.poolMosaicTex, roughness: 0.25 })
    );
    poolFloor.position.y = -1.2;
    poolFloor.receiveShadow = true;
    poolBox.add(poolFloor);

    // Prainha (wet deck shelf)
    const prainha = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.95, 5.0),
      new THREE.MeshStandardMaterial({ map: mats.poolMosaicTex, roughness: 0.25 })
    );
    prainha.position.set(-2.3, -0.72, 0);
    prainha.receiveShadow = true;
    poolBox.add(prainha);

    const poolWater = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.05, 5.0), mats.poolWaterMat);
    poolWater.position.y = -0.05;
    poolBox.add(poolWater);

    const pL1 = new THREE.PointLight(0x00e5ff, 2.2, 9);
    pL1.position.set(0.5, -0.3, 0);
    poolBox.add(pL1);
    poolLights.push(pL1);
    houseGroup.add(poolBox);

    // Wooden Solarium Deck with Sun Loungers
    const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.52, 2.8), mats.woodSlatMat);
    poolDeck.position.set(6.8, -0.21, -0.4);
    houseGroup.add(poolDeck);

    // Modern Garage
    const garageGroup = new THREE.Group();
    garageGroup.position.set(-6.2, 0, 4.0);
    const garageRoof = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.38, 6.6), mats.darkAlumMat);
    garageRoof.position.set(0, 3.2, 0);
    garageRoof.castShadow = true;
    garageGroup.add(garageRoof);
    const car = buildRealisticCar();
    garageGroup.add(car);
    houseGroup.add(garageGroup);

    // TÉRREO
    const floorTile = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.16, 9.8), mats.porcelainMat);
    floorTile.position.set(0.5, 0.08, 0.5);
    floorTile.receiveShadow = true;
    groundFloorGroup.add(floorTile);

    // Stone Accent Wall in Moledo Stone
    const stoneWall = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.4, 5.2), mats.stoneWallMat);
    stoneWall.position.set(-2.6, 3.2, 2.0);
    stoneWall.castShadow = true;
    stoneWall.receiveShadow = true;
    groundFloorGroup.add(stoneWall);

    // Rear Wall in Acrylic Stucco
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(10.8, 3.2, 0.38), mats.stuccoMat);
    backWall.position.set(0.5, 1.6, -4.4);
    backWall.castShadow = true;
    groundFloorGroup.add(backWall);

    // Double-Height Front Glass Curtain Wall (Pele de Vidro)
    const facadeGlass = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.1, 0.08), mats.glassMat);
    facadeGlass.position.set(2.8, 1.55, 5.2);
    groundFloorGroup.add(facadeGlass);

    // Black Aluminum Mullions
    for (let m = 0; m <= 3; m++) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 0.14), mats.darkAlumMat);
      mullion.position.set(0.3 + m * 1.7, 1.6, 5.22);
      mullion.castShadow = true;
      groundFloorGroup.add(mullion);
    }

    // Pivot Entrance Door in Cumaru Wood
    const pivotDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.1, 0.16), mats.woodSlatMat);
    pivotDoor.position.set(-1.0, 1.55, 5.25);
    pivotDoor.castShadow = true;
    groundFloorGroup.add(pivotDoor);

    const pullHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 })
    );
    pullHandle.position.set(-0.35, 1.55, 5.35);
    groundFloorGroup.add(pullHandle);

    // Living Room Furniture
    const sofaFabric = new THREE.MeshStandardMaterial({ color: 0x30353d, roughness: 0.85 });
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 1.2), sofaFabric);
    sofaBase.position.set(1.5, 0.38, 2.4);
    sofaBase.castShadow = true;
    groundFloorGroup.add(sofaBase);

    const coffeeTable = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.25, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x11141a, roughness: 0.15, metalness: 0.2 })
    );
    coffeeTable.position.set(1.5, 0.28, 0.8);
    groundFloorGroup.add(coffeeTable);

    // Kitchen Island with Black Granite
    const island = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.95, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x121721, roughness: 0.15 })
    );
    island.position.set(1.8, 0.63, -2.8);
    island.castShadow = true;
    groundFloorGroup.add(island);

    const livingSpot = new THREE.PointLight(0xffecd1, 0, 9);
    livingSpot.position.set(2.0, 2.8, 1.5);
    groundFloorGroup.add(livingSpot);
    interiorLights.push(livingSpot);

    // SUPERIOR
    const midSlab = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.42, 10.4), mats.darkAlumMat);
    midSlab.position.set(0.2, 3.35, 0.3);
    midSlab.castShadow = true;
    upperFloorGroup.add(midSlab);

    const suiteVolume = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.1, 7.0), mats.stuccoMat);
    suiteVolume.position.set(-0.8, 5.0, 0.8);
    suiteVolume.castShadow = true;
    upperFloorGroup.add(suiteVolume);

    const woodFacade = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.9, 0.18), mats.woodSlatMat);
    woodFacade.position.set(-0.8, 5.0, 4.35);
    woodFacade.castShadow = true;
    upperFloorGroup.add(woodFacade);

    const balconyGlass = new THREE.Mesh(new THREE.BoxGeometry(7.0, 1.05, 0.08), mats.glassMat);
    balconyGlass.position.set(-0.8, 4.05, 5.35);
    upperFloorGroup.add(balconyGlass);

    const suiteSpot = new THREE.PointLight(0xffe6c2, 0, 9);
    suiteSpot.position.set(-0.8, 5.8, 1.2);
    upperFloorGroup.add(suiteSpot);
    interiorLights.push(suiteSpot);

    // COBERTURA
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.38, 7.6), mats.darkAlumMat);
    roofSlab.position.set(-0.8, 6.7, 0.8);
    roofGroup.add(roofSlab);

    const greenRoof = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.12, 6.8), mats.grassMat);
    greenRoof.position.set(-0.8, 6.92, 0.8);
    roofGroup.add(greenRoof);

    for (let i = 0; i < 4; i++) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.06, 1.0),
        new THREE.MeshStandardMaterial({ color: 0x071e3d, metalness: 0.9, roughness: 0.1 })
      );
      panel.position.set(-3.0 + i * 1.8, 7.05, -0.6);
      panel.rotation.x = -0.15;
      roofGroup.add(panel);
    }
  }

  // ==========================================
  // MODEL 2: VILLA BIOFÍLICA HORIZON (CASA TÉRREA EM U)
  // ==========================================
  else if (style === 'villa-biofilica') {
    // Pátio central envidraçado com espelho d'água cristalino
    const patioGroup = new THREE.Group();
    patioGroup.position.set(0, 0, 0);

    const waterMirror = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.2, 5.2), mats.poolWaterMat);
    waterMirror.position.y = 0.05;
    patioGroup.add(waterMirror);

    // Árvore Jabuticabeira / Bonsai no Pátio Zen
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.25, 2.2, 10),
      new THREE.MeshStandardMaterial({ color: 0x423528, roughness: 0.9 })
    );
    trunk.position.y = 1.1;
    patioGroup.add(trunk);

    const foliage = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 14),
      new THREE.MeshStandardMaterial({ color: 0x24582a, roughness: 0.7 })
    );
    foliage.position.y = 2.4;
    patioGroup.add(foliage);

    // Vidros que abraçam o Pátio Central
    const glassN = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.2, 0.08), mats.glassMat);
    glassN.position.set(0, 1.6, -2.6);
    patioGroup.add(glassN);
    const glassS = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.2, 0.08), mats.glassMat);
    glassS.position.set(0, 1.6, 2.6);
    patioGroup.add(glassS);
    const glassE = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 5.2), mats.glassMat);
    glassE.position.set(2.6, 1.6, 0);
    patioGroup.add(glassE);
    const glassW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 5.2), mats.glassMat);
    glassW.position.set(-2.6, 1.6, 0);
    patioGroup.add(glassW);

    groundFloorGroup.add(patioGroup);

    // Ala Leste (Social)
    const wingEast = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.4, 12.5), mats.stuccoMat);
    wingEast.position.set(5.2, 1.7, 0);
    wingEast.castShadow = true;
    groundFloorGroup.add(wingEast);

    // Ala Oeste (Suítes Privativas)
    const wingWest = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.4, 12.5), mats.stuccoMat);
    wingWest.position.set(-5.2, 1.7, 0);
    wingWest.castShadow = true;
    groundFloorGroup.add(wingWest);

    // Ala Norte (Cozinha & Parede em Pedra)
    const wingNorth = new THREE.Mesh(new THREE.BoxGeometry(15.4, 3.4, 3.4), mats.stoneWallMat);
    wingNorth.position.set(0, 1.7, -4.6);
    wingNorth.castShadow = true;
    groundFloorGroup.add(wingNorth);

    // Fire Pit Lounge Externo
    const firePit = new THREE.Group();
    firePit.position.set(7.5, 0.1, 4.5);
    const bench = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.45, 24, 1, false, 0, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.8 })
    );
    bench.position.y = 0.22;
    firePit.add(bench);

    const fireCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff4400, emissiveIntensity: 1.0 })
    );
    fireCore.position.y = 0.2;
    firePit.add(fireCore);

    const fireLight = new THREE.PointLight(0xff7700, 2.2, 9);
    fireLight.position.y = 0.8;
    firePit.add(fireLight);
    interiorLights.push(fireLight);
    groundFloorGroup.add(firePit);

    // Piscina Espelho D'água Térrea
    const poolBox = new THREE.Group();
    poolBox.position.set(-7.5, 0, 4.0);
    const poolW = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.15, 6.8), mats.poolWaterMat);
    poolW.position.y = 0.05;
    poolBox.add(poolW);
    const pL = new THREE.PointLight(0x00d2d3, 2.0, 8);
    pL.position.set(0, -0.2, 0);
    poolBox.add(pL);
    poolLights.push(pL);
    groundFloorGroup.add(poolBox);

    // Teto Linear Horizontal com Beiral de Madeira Cumaru
    const villaRoof = new THREE.Mesh(new THREE.BoxGeometry(17.8, 0.45, 14.8), mats.woodSlatMat);
    villaRoof.position.set(0, 3.65, 0);
    villaRoof.castShadow = true;
    roofGroup.add(villaRoof);
  }

  // ==========================================
  // MODEL 3: RESIDÊNCIA BRUTALISTA MINIMALISTA PRIME
  // ==========================================
  else if (style === 'minimalista-prime') {
    // Bloco Térreo em Concreto Aparente Texturizado
    const groundConcrete = new THREE.Mesh(new THREE.BoxGeometry(11.2, 3.3, 10.2), mats.concreteMat);
    groundConcrete.position.set(0, 1.65, 0.5);
    groundConcrete.castShadow = true;
    groundFloorGroup.add(groundConcrete);

    // Grande Fachada Recuada com Vidros Pretos
    const recessedGlass = new THREE.Mesh(new THREE.BoxGeometry(8.8, 3.0, 0.1), mats.glassMat);
    recessedGlass.position.set(0, 1.55, 5.55);
    groundFloorGroup.add(recessedGlass);

    // Bloco Superior em Balanço Deslocado
    const upperConcrete = new THREE.Mesh(new THREE.BoxGeometry(12.8, 2.9, 8.8), mats.concreteMat);
    upperConcrete.position.set(1.0, 4.7, -0.2);
    upperConcrete.castShadow = true;
    upperFloorGroup.add(upperConcrete);

    // Brises Verticais em Alumínio Preto
    for (let b = 0; b < 11; b++) {
      const brise = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.8, 0.45), mats.darkAlumMat);
      brise.position.set(-4.2 + b * 0.9, 4.7, 4.25);
      brise.rotation.y = 0.28;
      brise.castShadow = true;
      upperFloorGroup.add(brise);
    }

    // Cobertura Rooftop com Spa Quadrado de Hidromassagem
    const rooftopSlab = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.38, 9.0), mats.darkAlumMat);
    rooftopSlab.position.set(1.0, 6.25, -0.2);
    roofGroup.add(rooftopSlab);

    const spaTub = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.75, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 })
    );
    spaTub.position.set(-2.5, 6.7, 0);
    roofGroup.add(spaTub);

    const spaWater = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 2.2), mats.poolWaterMat);
    spaWater.position.set(-2.5, 6.95, 0);
    roofGroup.add(spaWater);

    const spaLight = new THREE.PointLight(0x00e5ff, 2.2, 6);
    spaLight.position.set(-2.5, 7.2, 0);
    roofGroup.add(spaLight);
    poolLights.push(spaLight);

    const pergola = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.15, 4.2), mats.darkAlumMat);
    pergola.position.set(3.5, 7.9, 0);
    roofGroup.add(pergola);

    const l1 = new THREE.PointLight(0xfff0dd, 1.4, 10);
    l1.position.set(0, 2.8, 0);
    groundFloorGroup.add(l1);
    interiorLights.push(l1);
  }

  // ==========================================
  // MODEL 4: MANSÃO VOGUE TRIPLEX ALPHA
  // ==========================================
  else if (style === 'mansao-vogue') {
    // Átrio Monumental com Pele de Vidro de 6 metros
    const atriumGlass = new THREE.Mesh(new THREE.BoxGeometry(6.6, 6.4, 0.1), mats.glassMat);
    atriumGlass.position.set(0, 3.3, 5.1);
    groundFloorGroup.add(atriumGlass);

    // Lustre Escultórico de Cristal
    for (let c = 0; c < 6; c++) {
      const crystal = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 14, 14),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.92, roughness: 0.08 })
      );
      crystal.position.set((c - 2.5) * 0.38, 5.0 - c * 0.38, 4.3);
      groundFloorGroup.add(crystal);
    }

    // Pavimento 1 (Living + Jantar + Gourmet)
    const floor1 = new THREE.Mesh(new THREE.BoxGeometry(14.2, 3.5, 11.2), mats.stuccoMat);
    floor1.position.set(0, 1.75, 0);
    floor1.castShadow = true;
    groundFloorGroup.add(floor1);

    // Piscina Monumental em L com Prainha
    const poolL1 = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.2, 4.6), mats.poolWaterMat);
    poolL1.position.set(6.6, 0.05, -3.5);
    groundFloorGroup.add(poolL1);

    const poolL2 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 6.2), mats.poolWaterMat);
    poolL2.position.set(8.7, 0.05, 1.2);
    groundFloorGroup.add(poolL2);

    const pLight = new THREE.PointLight(0x00d2d3, 2.8, 12);
    pLight.position.set(7.6, -0.3, -1.0);
    groundFloorGroup.add(pLight);
    poolLights.push(pLight);

    // Pavimento 2 (Suítes Master em Pedra)
    const floor2 = new THREE.Mesh(new THREE.BoxGeometry(14.4, 3.1, 10.8), mats.stoneWallMat);
    floor2.position.set(0, 5.0, 0);
    floor2.castShadow = true;
    upperFloorGroup.add(floor2);

    // Pavimento 3 / Cobertura Triplex (Lounge Panorâmico)
    const floor3 = new THREE.Mesh(new THREE.BoxGeometry(8.8, 2.7, 6.8), mats.woodSlatMat);
    floor3.position.set(-1.5, 7.8, 0.5);
    floor3.castShadow = true;
    roofGroup.add(floor3);

    const mLight = new THREE.PointLight(0xffecd1, 1.8, 13);
    mLight.position.set(0, 4.6, 2.0);
    groundFloorGroup.add(mLight);
    interiorLights.push(mLight);
  }

  // ==========================================
  // MODEL 5: PAVILION LOFT ESCANDINAVO GLASS
  // ==========================================
  else if (style === 'loft-glass') {
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x221e1a, roughness: 0.75 });

    const mainPavilion = new THREE.Mesh(new THREE.BoxGeometry(9.2, 3.8, 12.4), darkWoodMat);
    mainPavilion.position.set(0, 1.9, 0);
    mainPavilion.castShadow = true;
    groundFloorGroup.add(mainPavilion);

    // Empena Frontal em Vidro Panorâmico
    const glassGable = new THREE.Mesh(new THREE.BoxGeometry(8.8, 3.6, 0.1), mats.glassMat);
    glassGable.position.set(0, 1.8, 6.15);
    groundFloorGroup.add(glassGable);

    // Lareira Suspensa em Ferro Fundido
    const hearthChimney = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 3.6, 16),
      mats.darkAlumMat
    );
    hearthChimney.position.set(0, 3.2, 2.5);
    groundFloorGroup.add(hearthChimney);

    const hearthFire = new THREE.PointLight(0xff6600, 2.5, 8);
    hearthFire.position.set(0, 1.3, 2.5);
    groundFloorGroup.add(hearthFire);
    interiorLights.push(hearthFire);

    // Deck em Madeira
    const timberDeck = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.35, 14.4), mats.woodSlatMat);
    timberDeck.position.set(0, -0.15, 0.5);
    groundFloorGroup.add(timberDeck);

    // Ofurô em Cedro
    const ofuro = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.9, 24),
      mats.woodSlatMat
    );
    ofuro.position.set(5.2, 0.45, -1.0);
    groundFloorGroup.add(ofuro);

    const ofuroWater = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.1, 24), mats.poolWaterMat);
    ofuroWater.position.set(5.2, 0.8, -1.0);
    groundFloorGroup.add(ofuroWater);

    // Telhado Inclinado Nórdico com Zinco
    const roofSlope = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 0.32, 13.8),
      new THREE.MeshStandardMaterial({ color: 0x181c22, roughness: 0.35 })
    );
    roofSlope.position.set(0, 4.6, 0);
    roofSlope.rotation.z = -0.18;
    roofSlope.castShadow = true;
    roofGroup.add(roofSlope);
  }

  return {
    groundFloorGroup,
    upperFloorGroup,
    roofGroup,
    interiorLights,
    poolLights,
    landscapeLights,
  };
}
