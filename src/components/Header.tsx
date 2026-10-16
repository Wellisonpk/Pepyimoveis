import React, { useState } from 'react';
import { Property } from '../types';

interface HeaderProps {
  onSearchSelect: (property: Property) => void;
  properties: Property[];
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchSelect, properties, onOpenContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const filteredProperties = searchTerm.trim()
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0d1b2a]/95 border-b-2 border-[#ff007f] px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between backdrop-blur-md shadow-lg">
      {/* Brand logo & title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="bg-[#ff007f] text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-extrabold text-base sm:text-lg tracking-wider shadow-[0_0_12px_#ff007f] select-none">
          PEPŶ
        </div>
        <div className="leading-tight select-none">
          <h1 className="text-xs sm:text-base font-bold tracking-wider sm:tracking-widest text-white uppercase">
            IMÓVEIS E PLANTAS
          </h1>
          <span className="text-[9px] sm:text-[11px] font-semibold text-[#39ff14] tracking-wider block -mt-0.5">
            INTERATIVIDADE DIGITAL
          </span>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden sm:block relative w-64 md:w-80">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Buscar projeto ou cidade..."
            className="w-full py-1.5 pl-4 pr-10 rounded-full border border-white/20 bg-white/5 text-white text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.5)] transition duration-200"
          />
          <i className="fa-solid fa-magnifying-glass absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ff007f] text-sm pointer-events-none" />
        </div>

        {/* Autocomplete Dropdown */}
        {isFocused && filteredProperties.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1b2a] border border-[#ff007f]/40 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-md max-h-64 overflow-y-auto">
            {filteredProperties.map((prop) => (
              <button
                key={prop.id}
                onMouseDown={() => {
                  onSearchSelect(prop);
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center justify-between border-b border-white/5 transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{prop.title}</div>
                  <div className="text-[10px] text-gray-400">{prop.neighborhood}, {prop.location}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#39ff14]">
                    {prop.purpose === 'venda'
                      ? `R$ ${(prop.price / 1000000).toFixed(2)}M`
                      : `R$ ${prop.price.toLocaleString('pt-BR')}/mês`}
                  </span>
                  <span className="block text-[9px] text-[#ff007f] uppercase font-mono">{prop.purpose}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Search Toggle & WhatsApp Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="sm:hidden w-8 h-8 rounded-full bg-white/5 border border-white/15 text-[#ff007f] flex items-center justify-center text-xs"
          title="Buscar"
        >
          <i className="fa-solid fa-magnifying-glass" />
        </button>

        <button
          onClick={onOpenContact}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#39ff14]/40 bg-[#39ff14]/10 hover:bg-[#39ff14]/20 text-[#39ff14] text-[11px] sm:text-xs font-semibold tracking-wide transition shadow-[0_0_8px_rgba(57,255,20,0.2)]"
        >
          <i className="fa-brands fa-whatsapp text-sm" />
          <span className="hidden xs:inline sm:inline">WhatsApp</span>
        </button>
      </div>

      {/* Mobile Search Input Overlay */}
      {mobileSearchOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-[#0d1b2a] border-b border-[#ff007f]/40 p-2.5 shadow-2xl flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar imóvel, bairro ou cidade..."
              className="w-full py-2 pl-3 pr-8 rounded-xl border border-white/20 bg-white/5 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#ff007f]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          {filteredProperties.length > 0 && (
            <div className="max-h-48 overflow-y-auto bg-black/40 rounded-xl divide-y divide-white/5">
              {filteredProperties.map((prop) => (
                <button
                  key={prop.id}
                  onClick={() => {
                    onSearchSelect(prop);
                    setSearchTerm('');
                    setMobileSearchOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-white block">{prop.title}</span>
                    <span className="text-[10px] text-gray-400">{prop.location}</span>
                  </div>
                  <span className="text-[#39ff14] font-bold text-[11px]">
                    {prop.purpose === 'venda'
                      ? `R$ ${(prop.price / 1000000).toFixed(2)}M`
                      : `R$ ${prop.price.toLocaleString('pt-BR')}/mês`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
