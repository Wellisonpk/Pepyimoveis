import React, { useState } from 'react';
import { Property } from '../types';

interface RightWidgetsProps {
  currentFloor: number;
  activeProperty: Property;
  onOpenPlantasModal: () => void;
}

export const RightWidgets: React.FC<RightWidgetsProps> = ({
  currentFloor,
  activeProperty,
  onOpenPlantasModal,
}) => {
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const renderContent = () => (
    <>
      {/* Widget PLANTAS */}
      <div className="bg-[#0d1b2a]/90 border border-white/10 border-t-4 border-t-[#39ff14] rounded-xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md transition duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[#39ff14] font-bold text-xs sm:text-sm tracking-wider">
            <i className="fa-solid fa-compass-drafting text-sm" />
            <span>PLANTAS</span>
          </div>
          <button
            onClick={onOpenPlantasModal}
            className="text-[10px] text-[#39ff14] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Ver Plantas</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
          </button>
        </div>

        <div className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
          {currentFloor === 1 && (
            <div>
              <span className="font-semibold text-white block mb-0.5">Modo Planta Térrea (Nível 1)</span>
              Vistoria interna de cômodos (Living 32m², Cozinha Gourmet 20m², Lavabo).
            </div>
          )}
          {currentFloor === 2 && (
            <div>
              <span className="font-semibold text-white block mb-0.5">Vista Completa (2 Pavimentos)</span>
              Fachada com brise ripado, suíte master em balanço e garagem para 2 carros.
            </div>
          )}
          {currentFloor === 3 && (
            <div>
              <span className="font-semibold text-white block mb-0.5">Vista Explodida (3D Cutaway)</span>
              Separação estrutural entre térreo, pavimento superior e cobertura sustentável.
            </div>
          )}
        </div>

        {/* Quick specs pill badges */}
        <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="bg-black/30 px-2 py-1 rounded text-gray-300">
            Área: <span className="font-bold text-white">{activeProperty.area} m²</span>
          </div>
          <div className="bg-black/30 px-2 py-1 rounded text-gray-300">
            Suítes: <span className="font-bold text-white">{activeProperty.suites}</span>
          </div>
        </div>
      </div>

      {/* Widget CONFORTO */}
      <div className="bg-[#0d1b2a]/90 border border-white/10 border-t-4 border-t-[#ff007f] rounded-xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md transition duration-300">
        <div className="flex items-center gap-2 text-[#ff007f] font-bold text-xs sm:text-sm tracking-wider mb-2">
          <i className="fa-solid fa-couch text-sm" />
          <span>CONFORTO</span>
        </div>
        <div className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
          Ambientes com iluminação natural abundante, ventilação cruzada permanente e isolamento acústico superior.
        </div>

        {/* Bioclimatic tags */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ff007f]/15 text-[#ff007f] border border-[#ff007f]/30">
            Ventilação Cruzada
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30">
            Sol Otimizado
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Isolamento Acústico
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Right Flank */}
      <div className="hidden md:flex absolute right-4 lg:right-6 top-24 z-30 flex-col gap-4 w-56 lg:w-64 select-none pointer-events-auto">
        {renderContent()}
      </div>

      {/* Mobile Trigger Button */}
      <div className="md:hidden absolute right-3 top-16 z-30 select-none">
        <button
          onClick={() => setMobileDetailsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d1b2a]/90 border border-[#39ff14] text-white text-xs font-bold shadow-[0_0_12px_rgba(57,255,20,0.35)] backdrop-blur-md active:scale-95 transition"
        >
          <i className="fa-solid fa-circle-info text-[#39ff14] text-xs" />
          <span>Detalhes</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {mobileDetailsOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full bg-[#0d1b2a] border-t-2 border-[#39ff14] rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Ficha Técnica do Imóvel
              </span>
              <button
                onClick={() => setMobileDetailsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-gray-300 flex items-center justify-center text-xs"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};
