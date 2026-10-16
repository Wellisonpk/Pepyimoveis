import React, { useState } from 'react';

interface SonhosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: (subject?: string) => void;
}

export const SonhosModal: React.FC<SonhosModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  const [area, setArea] = useState<number>(200);
  const [standard, setStandard] = useState<'alto' | 'luxo' | 'sob_medida'>('alto');
  const [hasPool, setHasPool] = useState(true);
  const [hasSolar, setHasSolar] = useState(true);

  if (!isOpen) return null;

  // Calculadora aproximada de CUB / m²
  const costPerMeter = standard === 'alto' ? 3800 : standard === 'luxo' ? 5200 : 6800;
  const baseCost = area * costPerMeter;
  const extrasCost = (hasPool ? 65000 : 0) + (hasSolar ? 35000 : 0);
  const totalEstimate = baseCost + extrasCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0d1b2a] border border-[#ff007f]/50 w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-[0_0_40px_rgba(255,0,127,0.3)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff007f]/20 border border-[#ff007f] flex items-center justify-center text-[#ff007f]">
              <i className="fa-solid fa-heart text-base" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Simulador do Seu Sonho PEPY</h3>
              <span className="text-xs text-[#39ff14]">Descubra como transformar ideias em realidade</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quote */}
          <div className="bg-gradient-to-r from-[#ff007f]/15 to-[#39ff14]/15 border border-white/10 p-4 rounded-xl text-center">
            <p className="text-sm font-semibold text-white">
              “Não construímos apenas paredes, criamos o refúgio onde as melhores memórias da sua família serão vividas.”
            </p>
          </div>

          {/* Calculator Section */}
          <div className="bg-[#112233] p-5 rounded-xl border border-white/5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <i className="fa-solid fa-calculator text-[#39ff14]" />
              Simulação de Investimento de Obra
            </h4>

            {/* Area Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Área Construída Desejada:</span>
                <span className="font-bold text-[#39ff14] text-sm">{area} m²</span>
              </div>
              <input
                type="range"
                min="90"
                max="500"
                step="10"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full accent-[#ff007f] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>90 m²</span>
                <span>250 m²</span>
                <span>500 m²</span>
              </div>
            </div>

            {/* Standard Choice */}
            <div>
              <label className="block text-xs text-gray-300 mb-2">Padrão de Acabamento:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['alto', 'luxo', 'sob_medida'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStandard(lvl)}
                    className={`py-2 px-3 rounded-xl border transition text-center ${
                      standard === lvl
                        ? 'bg-[#ff007f]/20 border-[#ff007f] text-white font-bold shadow-[0_0_10px_rgba(255,0,127,0.3)]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {lvl === 'alto' ? 'Alto Padrão' : lvl === 'luxo' ? 'Luxo' : 'Exclusivo'}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPool}
                  onChange={(e) => setHasPool(e.target.checked)}
                  className="accent-[#39ff14] w-4 h-4"
                />
                <span className="text-xs text-gray-300">Piscina com Deck (+ R$ 65k)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/20 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSolar}
                  onChange={(e) => setHasSolar(e.target.checked)}
                  className="accent-[#39ff14] w-4 h-4"
                />
                <span className="text-xs text-gray-300">Energia Solar (+ R$ 35k)</span>
              </label>
            </div>

            {/* Estimated Total */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-gray-400 font-bold block">
                  Estimativa Geral de Execução
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#39ff14]">
                  R$ {totalEstimate.toLocaleString('pt-BR')}
                </span>
              </div>
              <button
                onClick={() => onOpenContact(`Simulação Sonho: ${area}m² - R$ ${totalEstimate.toLocaleString('pt-BR')}`)}
                className="py-2.5 px-4 rounded-xl bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold text-xs tracking-wider transition flex items-center gap-2 shadow-[0_0_12px_rgba(255,0,127,0.3)]"
              >
                <span>Viabilizar Meu Sonho</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
