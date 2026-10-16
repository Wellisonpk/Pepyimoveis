import React from 'react';

interface SimsControlsProps {
  currentFloor: number;
  onAdjustFloor: (delta: number) => void;
  isNight: boolean;
  onToggleDayNight: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onToggleExploded: () => void;
}

export const SimsControls: React.FC<SimsControlsProps> = ({
  currentFloor,
  onAdjustFloor,
  isNight,
  onToggleDayNight,
  autoRotate,
  onToggleAutoRotate,
  onToggleExploded,
}) => {
  return (
    <div className="absolute bottom-24 sm:bottom-28 right-3 sm:right-6 z-30 flex flex-col gap-2 select-none pointer-events-auto">
      {/* Subir Pavimento */}
      <button
        onClick={() => onAdjustFloor(1)}
        disabled={currentFloor >= 3}
        title="Subir Andar / Vista Explodida"
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#ff007f] flex items-center justify-center text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,0,127,0.3)] ${
          currentFloor >= 3
            ? 'opacity-40 cursor-not-allowed bg-[#0d1b2a]/50'
            : 'bg-[#0d1b2a]/90 hover:bg-[#ff007f] hover:shadow-[0_0_18px_#ff007f] hover:scale-105 active:scale-90'
        }`}
      >
        <i className="fa-solid fa-arrow-up text-xs sm:text-base" />
      </button>

      {/* Descer Pavimento */}
      <button
        onClick={() => onAdjustFloor(-1)}
        disabled={currentFloor <= 1}
        title="Descer Andar / Ver Térreo"
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#ff007f] flex items-center justify-center text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,0,127,0.3)] ${
          currentFloor <= 1
            ? 'opacity-40 cursor-not-allowed bg-[#0d1b2a]/50'
            : 'bg-[#0d1b2a]/90 hover:bg-[#ff007f] hover:shadow-[0_0_18px_#ff007f] hover:scale-105 active:scale-90'
        }`}
      >
        <i className="fa-solid fa-arrow-down text-xs sm:text-base" />
      </button>

      {/* Vista Explodida Rápida */}
      <button
        onClick={onToggleExploded}
        title="Alternar Vista Explodida 3D"
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#ff007f] flex items-center justify-center text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,0,127,0.3)] ${
          currentFloor === 3
            ? 'bg-[#ff007f] shadow-[0_0_18px_#ff007f]'
            : 'bg-[#0d1b2a]/90 hover:bg-[#ff007f] hover:shadow-[0_0_18px_#ff007f] hover:scale-105 active:scale-90'
        }`}
      >
        <i className="fa-solid fa-layer-group text-xs sm:text-base" />
      </button>

      {/* Alternar Dia / Noite */}
      <button
        onClick={onToggleDayNight}
        title={isNight ? 'Alternar para Luz Solar (Dia)' : 'Alternar para Modo Noturno / Neon'}
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#ff007f] flex items-center justify-center text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,0,127,0.3)] ${
          isNight
            ? 'bg-[#ff007f] text-[#39ff14] shadow-[0_0_18px_#ff007f]'
            : 'bg-[#0d1b2a]/90 text-yellow-300 hover:bg-[#ff007f] hover:text-white hover:shadow-[0_0_18px_#ff007f] hover:scale-105 active:scale-90'
        }`}
      >
        <i className={`fa-solid ${isNight ? 'fa-sun text-yellow-300' : 'fa-moon text-blue-200'} text-xs sm:text-base`} />
      </button>

      {/* Auto-rotação */}
      <button
        onClick={onToggleAutoRotate}
        title={autoRotate ? 'Pausar rotação suave' : 'Ativar rotação suave contínua'}
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#ff007f] flex items-center justify-center text-white transition-all duration-200 shadow-[0_0_10px_rgba(255,0,127,0.3)] ${
          autoRotate
            ? 'bg-[#39ff14]/20 border-[#39ff14] text-[#39ff14]'
            : 'bg-[#0d1b2a]/90 text-gray-300 hover:bg-[#ff007f] hover:text-white hover:shadow-[0_0_18px_#ff007f] active:scale-90'
        }`}
      >
        <i className="fa-solid fa-arrows-rotate text-xs sm:text-base" />
      </button>
    </div>
  );
};
