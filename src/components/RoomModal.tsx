import React from 'react';
import { RoomHotspot } from '../types';

interface RoomModalProps {
  hotspot: RoomHotspot | null;
  onClose: () => void;
  onOpenContact: (roomName?: string) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({ hotspot, onClose, onOpenContact }) => {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0d1b2a] border border-[#ff007f]/50 w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(255,0,127,0.3)]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]" />
            <div>
              <h3 className="text-base font-bold text-white">{hotspot.name}</h3>
              <span className="text-[10px] text-[#ff007f] font-mono uppercase tracking-wider font-semibold">
                Pavimento {hotspot.floor === 1 ? 'Térreo' : 'Superior'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between bg-[#112233] p-3 rounded-xl border border-white/5">
            <span className="text-xs text-gray-300">Área útil privativa:</span>
            <span className="text-sm font-bold text-[#39ff14] font-mono">{hotspot.area}</span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            {hotspot.description}
          </p>

          <div className="bg-[#ff007f]/10 border border-[#ff007f]/30 p-3 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-[#ff007f] tracking-wider mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-star text-[10px]" />
              Destaque de Acabamento & Conforto
            </div>
            <div className="text-xs text-gray-200">
              {hotspot.highlight}
            </div>
          </div>

          {/* Action */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onOpenContact(`Dúvida sobre o cômodo: ${hotspot.name}`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,0,127,0.3)]"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
              <span>Solicitar Detalhes do Cômodo</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
