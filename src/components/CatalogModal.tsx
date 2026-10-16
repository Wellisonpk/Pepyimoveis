import React, { useState } from 'react';
import { Property } from '../types';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  initialPurpose?: 'venda' | 'aluguel';
  onSelectProperty: (property: Property) => void;
  onOpenContact: (propertyTitle?: string) => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  onClose,
  properties,
  initialPurpose = 'venda',
  onSelectProperty,
  onOpenContact,
}) => {
  const [purpose, setPurpose] = useState<'venda' | 'aluguel'>(initialPurpose);
  const [selectedType, setSelectedType] = useState<string>('todos');

  if (!isOpen) return null;

  const filtered = properties.filter((p) => {
    const matchesPurpose = p.purpose === purpose;
    const matchesType = selectedType === 'todos' || p.type === selectedType;
    return matchesPurpose && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0d1b2a] border border-[#ff007f]/40 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-[0_0_40px_rgba(255,0,127,0.25)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#ff007f] shadow-[0_0_8px_#ff007f]" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              {purpose === 'venda' ? 'Imóveis Exclusivos para Compra' : 'Imóveis Selecionados para Locação'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
          {/* Venda vs Aluguel */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setPurpose('venda')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                purpose === 'venda'
                  ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Comprar
            </button>
            <button
              onClick={() => setPurpose('aluguel')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                purpose === 'aluguel'
                  ? 'bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Alugar
            </button>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['todos', 'casa', 'sobrado', 'apartamento'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  selectedType === t
                    ? 'bg-[#39ff14]/20 border border-[#39ff14] text-[#39ff14]'
                    : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {t === 'todos' ? 'Todos os Tipos' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#112233]/70 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-[#ff007f]/50 transition group hover:shadow-[0_0_20px_rgba(255,0,127,0.15)]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    {item.type}
                  </span>
                  <span className="text-sm font-bold text-[#39ff14]">
                    {item.purpose === 'venda'
                      ? `R$ ${item.price.toLocaleString('pt-BR')}`
                      : `R$ ${item.price.toLocaleString('pt-BR')}/mês`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#ff007f] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                  <i className="fa-solid fa-location-dot text-[#ff007f] mr-1 text-[11px]" />
                  {item.neighborhood}, {item.location}
                </p>

                <p className="text-xs text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-4 gap-1.5 py-2 border-y border-white/5 text-center text-[10px] text-gray-300 mb-3">
                  <div className="bg-black/20 p-1.5 rounded">
                    <span className="block font-bold text-white text-xs">{item.area}m²</span>
                    Área
                  </div>
                  <div className="bg-black/20 p-1.5 rounded">
                    <span className="block font-bold text-white text-xs">{item.bedrooms}</span>
                    Dorm.
                  </div>
                  <div className="bg-black/20 p-1.5 rounded">
                    <span className="block font-bold text-white text-xs">{item.suites}</span>
                    Suítes
                  </div>
                  <div className="bg-black/20 p-1.5 rounded">
                    <span className="block font-bold text-white text-xs">{item.parking}</span>
                    Vagas
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    onSelectProperty(item);
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-semibold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,0,127,0.3)]"
                >
                  <i className="fa-solid fa-cubes text-xs" />
                  <span>Ver no Tour 3D</span>
                </button>
                <button
                  onClick={() => onOpenContact(item.title)}
                  className="py-2 px-3 rounded-lg border border-white/20 hover:border-[#39ff14] hover:text-[#39ff14] text-gray-300 font-semibold text-xs transition"
                  title="Falar com Corretor"
                >
                  <i className="fa-brands fa-whatsapp text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
