/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewerMode, Property, Blueprint, RoomHotspot } from './types';
import { mockProperties } from './data/mockProperties';
import { Viewer3D } from './components/Viewer3D';
import { Header } from './components/Header';
import { ActionMenu } from './components/ActionMenu';
import { RightWidgets } from './components/RightWidgets';
import { SimsControls } from './components/SimsControls';
import { Footer } from './components/Footer';
import { CatalogModal } from './components/CatalogModal';
import { PlantasModal } from './components/PlantasModal';
import { RoomModal } from './components/RoomModal';
import { ContactModal } from './components/ContactModal';
import { SonhosModal } from './components/SonhosModal';

export default function App() {
  const [activeMode, setActiveMode] = useState<ViewerMode>('visitar');
  const [currentFloor, setCurrentFloor] = useState<number>(2); // 1 = Térreo, 2 = Completo, 3 = Explodido
  const [isNight, setIsNight] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<RoomHotspot | null>(null);

  // Active property loaded in 3D
  const [activeProperty, setActiveProperty] = useState<Property>(mockProperties[0]);

  // Modal states
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogPurpose, setCatalogPurpose] = useState<'venda' | 'aluguel'>('venda');
  const [plantasModalOpen, setPlantasModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string>('Interesse em Imóvel PEPY');
  const [sonhosModalOpen, setSonhosModalOpen] = useState(false);

  // Handle Action Menu selection
  const handleSelectMode = (mode: ViewerMode) => {
    setActiveMode(mode);
    if (mode === 'comprar') {
      setCatalogPurpose('venda');
      setCatalogOpen(true);
    } else if (mode === 'alugar') {
      setCatalogPurpose('aluguel');
      setCatalogOpen(true);
    } else if (mode === 'plantar') {
      setPlantasModalOpen(true);
    }
  };

  // Adjust floor level up/down
  const handleAdjustFloor = (delta: number) => {
    setCurrentFloor((prev) => {
      const next = prev + delta;
      return Math.max(1, Math.min(3, next));
    });
  };

  // Toggle Day / Night
  const handleToggleDayNight = () => {
    setIsNight((prev) => !prev);
  };

  // Toggle Exploded View
  const handleToggleExploded = () => {
    setCurrentFloor((prev) => (prev === 3 ? 2 : 3));
  };

  // Select property from search or catalog
  const handleSelectProperty = (property: Property) => {
    setActiveProperty(property);
    setActiveMode('visitar');
  };

  // Apply Blueprint to 3D Viewer
  const handleApplyBlueprint = (blueprint: Blueprint) => {
    setActiveMode('visitar');
    if (blueprint.id === 'planta-01') {
      setActiveProperty(mockProperties[0]); // Sobrado Terra
    } else if (blueprint.id === 'planta-02') {
      setActiveProperty(mockProperties[1]); // Villa Biofílica
    } else if (blueprint.id === 'planta-03') {
      setActiveProperty(mockProperties[3]); // Mansão Vogue
    }
    setCurrentFloor(blueprint.floors === 1 ? 1 : 2);
  };

  // Open contact with specific subject
  const handleOpenContactWithSubject = (subject?: string) => {
    setContactSubject(subject || 'Atendimento PEPY Imóveis e Plantas');
    setContactModalOpen(true);
  };

  // Handle Footer Pillar Clicks
  const handleSelectPillar = (pillar: 'imoveis' | 'plantas' | 'sonhos') => {
    if (pillar === 'imoveis') {
      setCatalogPurpose('venda');
      setCatalogOpen(true);
    } else if (pillar === 'plantas') {
      setPlantasModalOpen(true);
    } else if (pillar === 'sonhos') {
      setSonhosModalOpen(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b111e] text-white select-none">
      {/* Topbar / Navegação Superior */}
      <Header
        properties={mockProperties}
        onSearchSelect={handleSelectProperty}
        onOpenContact={() => handleOpenContactWithSubject('Gostaria de falar com um corretor')}
      />

      {/* Main Viewport Container */}
      <main className="relative w-full h-full pt-[60px]">
        {/* Central Tour Header Title */}
        <div className="absolute top-14 sm:top-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none px-3 max-w-[85vw]">
          <div className="flex items-center gap-1.5 sm:gap-2 justify-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <span className="text-[#ff007f] text-xs sm:text-base font-bold">➔</span>
            <h2 className="text-xs sm:text-base md:text-lg font-bold tracking-[1.5px] sm:tracking-[2px] text-white uppercase whitespace-nowrap">
              TOUR VIRTUAL 3D
            </h2>
            <span className="text-[#ff007f] text-xs sm:text-base font-bold rotate-180">➔</span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono text-[#39ff14] mt-0.5 tracking-wider truncate">
            {activeProperty.title}
          </div>
        </div>

        {/* Left Action Menu */}
        <ActionMenu activeMode={activeMode} onSelectMode={handleSelectMode} />

        {/* Interactive 3D WebGL Canvas */}
        <div className="w-full h-full">
          <Viewer3D
            currentFloor={currentFloor}
            isNight={isNight}
            autoRotate={autoRotate}
            activeProperty={activeProperty}
            allProperties={mockProperties}
            onSelectProperty={handleSelectProperty}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
          />
        </div>

        {/* Interaction Tip (Center Bottom) */}
        <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/70 border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] text-gray-300 flex items-center gap-1.5 sm:gap-2 shadow-lg backdrop-blur-xs whitespace-nowrap max-w-[90vw] overflow-hidden text-ellipsis">
          <i className="fa-solid fa-hand-pointer text-[#ff007f] text-[10px] sm:text-xs" />
          <span>Arraste para girar • Pinça com 2 dedos para zoom</span>
        </div>

        {/* Right Widgets (Plantas & Conforto) */}
        <RightWidgets
          currentFloor={currentFloor}
          activeProperty={activeProperty}
          onOpenPlantasModal={() => setPlantasModalOpen(true)}
        />

        {/* The Sims Camera & Floor Controls (Bottom Right) */}
        <SimsControls
          currentFloor={currentFloor}
          onAdjustFloor={handleAdjustFloor}
          isNight={isNight}
          onToggleDayNight={handleToggleDayNight}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
          onToggleExploded={handleToggleExploded}
        />

        {/* Footer with Slogan and Pillars */}
        <Footer onSelectPillar={handleSelectPillar} />
      </main>

      {/* Interactive Modals */}
      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => {
          setCatalogOpen(false);
          setActiveMode('visitar');
        }}
        properties={mockProperties}
        initialPurpose={catalogPurpose}
        onSelectProperty={handleSelectProperty}
        onOpenContact={handleOpenContactWithSubject}
      />

      <PlantasModal
        isOpen={plantasModalOpen}
        onClose={() => {
          setPlantasModalOpen(false);
          setActiveMode('visitar');
        }}
        onApplyBlueprintToViewer={handleApplyBlueprint}
        onOpenContact={handleOpenContactWithSubject}
      />

      <RoomModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
        onOpenContact={handleOpenContactWithSubject}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultSubject={contactSubject}
      />

      <SonhosModal
        isOpen={sonhosModalOpen}
        onClose={() => setSonhosModalOpen(false)}
        onOpenContact={handleOpenContactWithSubject}
      />
    </div>
  );
}
