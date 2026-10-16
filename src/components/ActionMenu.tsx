import React, { useState } from 'react';
import { ViewerMode } from '../types';

interface ActionMenuProps {
  activeMode: ViewerMode;
  onSelectMode: (mode: ViewerMode) => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ activeMode, onSelectMode }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const menuItems: { id: ViewerMode; label: string; icon: string }[] = [
    { id: 'comprar', label: 'COMPRAR', icon: 'fa-house-chimney' },
    { id: 'plantar', label: 'PLANTAR', icon: 'fa-leaf' },
    { id: 'alugar', label: 'ALUGAR', icon: 'fa-key' },
    { id: 'visitar', label: 'VISITAR 3D', icon: 'fa-cubes' },
  ];

  return (
    <>
      {/* Desktop Left Action Menu */}
      <div className="hidden md:flex absolute left-4 lg:left-6 top-24 z-30 flex-col gap-3 select-none">
        {menuItems.map((item) => {
          const isActive = activeMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className={`group text-left flex items-center gap-3.5 px-4 lg:px-5 py-3 rounded-lg border transition-all duration-300 min-w-[160px] shadow-lg ${
                isActive
                  ? 'bg-[#ff007f]/20 border-[#ff007f] border-l-4 border-l-[#39ff14] translate-x-1.5 shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                  : 'bg-[#0d1b2a]/70 border-white/10 border-l-4 border-l-[#ff007f] hover:bg-white/10 hover:border-[#ff007f]/50 hover:translate-x-1'
              }`}
            >
              <i
                className={`fa-solid ${item.icon} text-base lg:text-lg w-5 text-center transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#39ff14]' : 'text-[#ff007f]'
                }`}
              />
              <span className="font-semibold text-xs lg:text-sm tracking-wider text-white">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile Action Bar / Floating Pill Trigger */}
      <div className="md:hidden absolute left-3 top-16 z-30 select-none">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d1b2a]/90 border border-[#ff007f] text-white text-xs font-bold shadow-[0_0_12px_rgba(255,0,127,0.35)] backdrop-blur-md active:scale-95 transition"
        >
          <i className="fa-solid fa-bars text-[#ff007f] text-xs" />
          <span>Menu PEPY</span>
          <i className={`fa-solid fa-chevron-${mobileExpanded ? 'up' : 'down'} text-[10px] text-gray-400`} />
        </button>

        {/* Mobile Dropdown Drawer */}
        {mobileExpanded && (
          <div className="mt-2 flex flex-col gap-1.5 p-2 bg-[#0d1b2a]/95 border border-[#ff007f]/50 rounded-2xl shadow-2xl backdrop-blur-md min-w-[180px] animate-in fade-in duration-150">
            {menuItems.map((item) => {
              const isActive = activeMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectMode(item.id);
                    setMobileExpanded(false);
                  }}
                  className={`text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
                      : 'bg-white/5 text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <i className={`fa-solid ${item.icon} w-4 text-center ${isActive ? 'text-white' : 'text-[#ff007f]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
