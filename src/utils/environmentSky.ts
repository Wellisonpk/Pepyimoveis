import * as THREE from 'three';

// Creates a realistic sky dome with realistic atmospheric color gradient
export function createAtmosphericSky(isNight: boolean): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 0, 1024);

  if (isNight) {
    // Twilight / Deep Luxury Architectural Night Sky
    gradient.addColorStop(0, '#060a14'); // Deep zenith
    gradient.addColorStop(0.5, '#0b1424');
    gradient.addColorStop(0.85, '#121e33');
    gradient.addColorStop(1, '#1b2a44'); // Warm horizon glow from city/sunset
  } else {
    // High-end Architectural Sunlit Sky (São Paulo / Campinas / Curitiba sunny day)
    gradient.addColorStop(0, '#2b6cb0'); // Vibrant azure zenith
    gradient.addColorStop(0.35, '#4299e1');
    gradient.addColorStop(0.65, '#63b3ed');
    gradient.addColorStop(0.85, '#bee3f8'); // Pale blue
    gradient.addColorStop(1, '#e2e8f0'); // Warm horizon haze
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft atmospheric cloud whisps in daytime
  if (!isNight) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    for (let i = 0; i < 15; i++) {
      const cx = (i * 120 + 50) % 1024;
      const cy = 400 + Math.sin(i * 1.5) * 120;
      const r = 160 + Math.sin(i) * 60;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.8, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Subtle distant stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let s = 0; s < 120; s++) {
      const sx = Math.random() * 1024;
      const sy = Math.random() * 600;
      const size = Math.random() * 1.5;
      ctx.fillRect(sx, sy, size, size);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const skyGeo = new THREE.SphereGeometry(250, 32, 24);
  const skyMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
    depthWrite: false,
  });

  return new THREE.Mesh(skyGeo, skyMat);
}
