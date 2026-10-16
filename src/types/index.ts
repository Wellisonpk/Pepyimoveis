export type ViewerMode = 'visitar' | 'comprar' | 'plantar' | 'alugar';

export type HouseModelStyle = 'sobrado-terra' | 'villa-biofilica' | 'minimalista-prime' | 'mansao-vogue' | 'loft-glass';

export interface Property {
  id: string;
  title: string;
  type: 'casa' | 'sobrado' | 'apartamento' | 'terreno';
  purpose: 'venda' | 'aluguel';
  price: number;
  condoFee?: number;
  location: string;
  neighborhood: string;
  area: number; // m²
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  featured: boolean;
  tags: string[];
  description: string;
  modelStyle: HouseModelStyle;
  palette: {
    wallColor: number;
    woodColor: number;
    accentColor: number;
  };
  hotspots?: RoomHotspot[];
}

export interface Blueprint {
  id: string;
  title: string;
  category: 'Sobrado Contemporâneo' | 'Casa Térrea Biofílica' | 'Loft Minimalista' | 'Mansão Sustentável';
  builtArea: number;
  lotMinSize: string;
  floors: number;
  suites: number;
  solarOrientation: string;
  ventilation: string;
  description: string;
  features: string[];
}

export interface RoomHotspot {
  id: string;
  name: string;
  area: string;
  floor: 1 | 2;
  position: [number, number, number];
  description: string;
  highlight: string;
}
