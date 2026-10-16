import * as THREE from 'three';

// Generates procedural PBR textures via HTML5 2D Canvas so there are zero 404s
export function createGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Mowed Esmeralda / Zoysia lawn base
  ctx.fillStyle = '#204422';
  ctx.fillRect(0, 0, 1024, 1024);

  // Mower stripes subtle tonal variation
  const stripeW = 128;
  for (let s = 0; s < 1024; s += stripeW * 2) {
    ctx.fillStyle = 'rgba(40, 80, 42, 0.22)';
    ctx.fillRect(s, 0, stripeW, 1024);
  }

  // Layer 60,000 fine organic grass blades / micro-shadows
  const colors = ['#274e28', '#2e5c30', '#356338', '#1a371c', '#3f7342', '#4b884f', '#162e17'];
  for (let i = 0; i < 60000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const len = 3 + Math.random() * 6;
    const angle = (Math.random() - 0.5) * 0.45;

    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.lineWidth = 0.9 + Math.random() * 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.sin(angle) * len, y - Math.cos(angle) * len);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWoodSlatsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Cumaru / Freijó warm golden-brown base
  ctx.fillStyle = '#7a4b27';
  ctx.fillRect(0, 0, 1024, 1024);

  const slatHeight = 28;
  const gap = 4;

  for (let y = 0; y < 1024; y += slatHeight + gap) {
    // Slat base with wood grain gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + slatHeight);
    grad.addColorStop(0, '#8c552d');
    grad.addColorStop(0.3, '#7d4924');
    grad.addColorStop(0.7, '#6f3f1e');
    grad.addColorStop(1, '#5a3216');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 1024, slatHeight);

    // Fine organic wood grain fibers
    for (let x = 0; x < 1024; x += 6 + Math.random() * 15) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(40, 20, 10, 0.18)' : 'rgba(160, 110, 60, 0.15)';
      ctx.fillRect(x, y, 1.5 + Math.random() * 5, slatHeight);
    }

    // Wood knot / growth ring subtle detail
    if (Math.random() > 0.6) {
      const knotX = 100 + Math.random() * 800;
      ctx.fillStyle = 'rgba(45, 22, 10, 0.25)';
      ctx.beginPath();
      ctx.ellipse(knotX, y + slatHeight / 2, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shadow groove between slats (deep ambient occlusion)
    ctx.fillStyle = '#140a04';
    ctx.fillRect(0, y + slatHeight, 1024, gap);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStoneWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Travertino Romano / Pedra Moledo warm mineral base
  ctx.fillStyle = '#c5baa8';
  ctx.fillRect(0, 0, 1024, 1024);

  const rows = 14;
  const rowHeight = 1024 / rows;

  for (let r = 0; r < rows; r++) {
    const y = r * rowHeight;
    const stoneWidths = [110, 150, 130, 180, 140, 160];
    let curX = (r % 2 === 0 ? 0 : -50);

    while (curX < 1024) {
      const sw = stoneWidths[Math.floor(Math.random() * stoneWidths.length)];
      const stoneGrad = ctx.createLinearGradient(curX, y, curX + sw, y + rowHeight);

      const stoneColors = [
        ['#dfd8cb', '#c5bbae'],
        ['#e5dfd2', '#cdbfaf'],
        ['#c4b3a0', '#ab9b88'],
        ['#dad1c3', '#baa894'],
        ['#ded5c6', '#bfb09d'],
      ];
      const pair = stoneColors[Math.floor(Math.random() * stoneColors.length)];
      stoneGrad.addColorStop(0, pair[0]);
      stoneGrad.addColorStop(1, pair[1]);

      ctx.fillStyle = stoneGrad;
      ctx.fillRect(curX + 3, y + 3, sw - 6, rowHeight - 6);

      // Organic stone fissures & mineral flecks
      for (let f = 0; f < 45; f++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(70,55,40,0.16)' : 'rgba(255,255,255,0.25)';
        ctx.fillRect(curX + Math.random() * sw, y + Math.random() * rowHeight, 2.5, 2);
      }

      // Joint mortar line with shadow bevel
      ctx.strokeStyle = '#433b31';
      ctx.lineWidth = 3;
      ctx.strokeRect(curX + 1.5, y + 1.5, sw - 3, rowHeight - 3);

      curX += sw;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStuccoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Off-white architectural textured acrylic plaster
  ctx.fillStyle = '#f4f4f5';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle sand aggregate grain
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createConcreteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9e9c96';
  ctx.fillRect(0, 0, 512, 512);

  // Formwork seams (placas de concreto aparente com junta)
  ctx.strokeStyle = 'rgba(50, 48, 45, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, 504, 504);

  // Tie rod holes (furos de ancoragem de fôrma de concreto)
  const holePositions = [
    [40, 40],
    [472, 40],
    [40, 472],
    [472, 472],
  ];
  holePositions.forEach(([hx, hy]) => {
    ctx.fillStyle = '#22201e';
    ctx.beginPath();
    ctx.arc(hx, hy, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#4a4742';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Micro surface noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPaverDrivewayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3a3e46';
  ctx.fillRect(0, 0, 512, 512);

  const blockW = 32;
  const blockH = 16;
  const gap = 2;

  for (let y = 0; y < 512; y += blockH + gap) {
    const row = Math.floor(y / (blockH + gap));
    const offset = (row % 2) * (blockW / 2);

    for (let x = -blockW; x < 512 + blockW; x += blockW + gap) {
      const lightness = 65 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgb(${lightness}, ${lightness + 2}, ${lightness + 5})`;
      ctx.fillRect(x + offset, y, blockW, blockH);

      // Subtle bevel border
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + offset, y, blockW, blockH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 5);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPorcelainTilesTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#edeae4';
  ctx.fillRect(0, 0, 512, 512);

  const tileSize = 128;
  const grout = 2;

  for (let y = 0; y < 512; y += tileSize) {
    for (let x = 0; x < 512; x += tileSize) {
      const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
      grad.addColorStop(0, '#faf7f2');
      grad.addColorStop(0.5, '#eeeae3');
      grad.addColorStop(1, '#f5f2ec');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 1, tileSize - grout, tileSize - grout);

      // Vein stroke (Calacatta Gold)
      ctx.strokeStyle = 'rgba(160, 140, 115, 0.22)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 10);
      ctx.bezierCurveTo(x + 50, y + 60, x + 80, y + 40, x + tileSize - 10, y + tileSize - 20);
      ctx.stroke();

      // Grout line
      ctx.strokeStyle = '#c4beb5';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, tileSize, tileSize);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPoolMosaicTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#084b66';
  ctx.fillRect(0, 0, 512, 512);

  const tile = 16;
  const grout = 1.5;

  for (let y = 0; y < 512; y += tile) {
    for (let x = 0; x < 512; x += tile) {
      const colors = ['#007799', '#0088aa', '#05a0b8', '#005f77', '#086e8a', '#109cb3'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(x + grout, y + grout, tile - grout * 2, tile - grout * 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
