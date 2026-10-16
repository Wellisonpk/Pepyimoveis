import React from 'react';

interface FooterProps {
  onSelectPillar: (pillar: 'imoveis' | 'plantas' | 'sonhos') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPillar }) => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 bg-gradient-to-t from-[#0b111e] via-[#0b111e]/90 to-transparent pt-2.5 sm:pt-4 pb-2 sm:pb-3 px-3 sm:px-6 flex flex-col items-center gap-1.5 sm:gap-2.5 select-none pointer-events-auto">
      {/* Slogan */}
      <div className="text-xs sm:text-base md:text-lg font-medium tracking-wide text-center text-white drop-shadow-md">
        Com a PEPY, seu sonho ganha{' '}
        <span className="text-[#39ff14] border-b-2 border-[#39ff14] pb-0.5 font-semibold">
          endereço!
        </span>
      </div>

      {/* Nav Pillars */}
      <div className="flex justify-center items-center gap-8 sm:gap-16 w-full max-w-lg border-t border-white/10 pt-1.5 sm:pt-2">
        <button
          onClick={() => onSelectPillar('imoveis')}
          className="group flex flex-col items-center gap-1 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-building text-base group-hover:text-[#ff007f] group-hover:-translate-y-0.5 transition duration-200" />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
            Imóveis
          </span>
        </button>

        <button
          onClick={() => onSelectPillar('plantas')}
          className="group flex flex-col items-center gap-1 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-seedling text-base group-hover:text-[#39ff14] group-hover:-translate-y-0.5 transition duration-200" />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
            Plantas
          </span>
        </button>

        <button
          onClick={() => onSelectPillar('sonhos')}
          className="group flex flex-col items-center gap-1 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <i className="fa-solid fa-heart text-base group-hover:text-[#ff007f] group-hover:-translate-y-0.5 transition duration-200" />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
            Sonhos
          </span>
        </button>
      </div>
    </footer>
  );
};
