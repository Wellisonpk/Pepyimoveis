import React, { useState } from 'react';
import { Blueprint } from '../types';
import { mockBlueprints } from '../data/mockProperties';

interface PlantasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBlueprintToViewer: (bp: Blueprint) => void;
  onOpenContact: (customSubject?: string) => void;
}

export const PlantasModal: React.FC<PlantasModalProps> = ({
  isOpen,
  onClose,
  onApplyBlueprintToViewer,
  onOpenContact,
}) => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint>(mockBlueprints[0]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0d1b2a] border border-[#39ff14]/40 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-[0_0_40px_rgba(57,255,20,0.2)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Plantas Arquitetônicas & Construção PEPY
              </h2>
              <span className="text-xs text-[#39ff14]">
                Projetos inteligentes prontos para construir no seu terreno
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Blueprint Selector Tabs */}
        <div className="px-6 py-3 border-b border-white/10 flex items-center gap-2 overflow-x-auto bg-white/[0.02]">
          {mockBlueprints.map((bp) => (
            <button
              key={bp.id}
              onClick={() => setSelectedBlueprint(bp)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                selectedBlueprint.id === bp.id
                  ? 'bg-[#39ff14] text-black shadow-[0_0_12px_rgba(57,255,20,0.5)] font-bold'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <i className="fa-solid fa-compass-drafting text-xs" />
              <span>{bp.title}</span>
            </button>
          ))}
        </div>

        {/* Blueprint Content */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Blueprint Details (Left 2 cols) */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30 font-semibold">
                  {selectedBlueprint.category}
                </span>
                <span className="text-sm font-bold text-white">
                  Área: <span className="text-[#39ff14]">{selectedBlueprint.builtArea} m²</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {selectedBlueprint.title}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {selectedBlueprint.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#112233] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">
                    Lote Mínimo Recomendado
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-ruler-combined text-[#ff007f]" />
                    {selectedBlueprint.lotMinSize}
                  </div>
                </div>

                <div className="bg-[#112233] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">
                    Pavimentos / Suítes
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-layer-group text-[#39ff14]" />
                    {selectedBlueprint.floors} Pavimentos • {selectedBlueprint.suites} Suítes
                  </div>
                </div>

                <div className="bg-[#112233] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">
                    Insolação Térmica
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-sun text-yellow-400" />
                    {selectedBlueprint.solarOrientation}
                  </div>
                </div>

                <div className="bg-[#112233] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1">
                    Ventilação Natural
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-wind text-cyan-400" />
                    {selectedBlueprint.ventilation}
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Diferenciais Construtivos do Projeto
                </h4>
                <div className="space-y-1.5">
                  {selectedBlueprint.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <i className="fa-solid fa-circle-check text-[#39ff14] text-xs" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onApplyBlueprintToViewer(selectedBlueprint);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-bold text-xs tracking-wider transition flex items-center gap-2 shadow-[0_0_12px_rgba(57,255,20,0.4)]"
              >
                <i className="fa-solid fa-cubes text-sm" />
                <span>Simular Esta Planta no 3D</span>
              </button>

              <button
                onClick={handleSimulateDownload}
                className="py-2.5 px-4 rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold text-xs transition flex items-center gap-2 bg-white/5"
              >
                <i className="fa-solid fa-file-pdf text-red-400 text-sm" />
                <span>{downloadSuccess ? 'Memorial Baixado!' : 'Baixar Planta (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* Plantar & Construir Card (Right col) */}
          <div className="bg-gradient-to-b from-[#112233] to-[#0a1522] border border-[#ff007f]/30 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#ff007f]/20 border border-[#ff007f] flex items-center justify-center text-[#ff007f] mb-4">
                <i className="fa-solid fa-seedling text-lg" />
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                Tem um terreno e quer construir?
              </h4>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Com o serviço <strong className="text-white">PEPY Plantar</strong>, nós adaptamos esta planta ao relevo, dimensões e normas do seu condomínio com acompanhamento de engenharia completo do alicerce à entrega das chaves.
              </p>

              <div className="space-y-2 text-[11px] text-gray-300 bg-black/30 p-3 rounded-xl border border-white/5 mb-4">
                <div className="flex justify-between">
                  <span>Prazo médio de obra:</span>
                  <strong className="text-white">8 a 10 meses</strong>
                </div>
                <div className="flex justify-between">
                  <span>Economia por m²:</span>
                  <strong className="text-[#39ff14]">Até 22%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Garantia estrutural:</span>
                  <strong className="text-white">5 anos</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenContact(`Construir Projeto: ${selectedBlueprint.title}`)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.4)]"
            >
              <i className="fa-solid fa-calculator" />
              <span>Simular Orçamento de Obra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
