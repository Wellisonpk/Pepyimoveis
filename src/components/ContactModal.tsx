import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = 'Atendimento Geral PEPY',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferredShift, setPreferredShift] = useState<'manha' | 'tarde' | 'noite'>('tarde');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Olá PEPY Imóveis e Plantas! Me chamo ${name || 'Cliente'} e gostaria de informações sobre: ${
        defaultSubject
      }. Mensagem: ${message || 'Gostaria de agendar um atendimento.'}`
    );
    window.open(`https://wa.me/5511999998888?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0d1b2a] border border-[#ff007f]/50 w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,0,127,0.3)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#39ff14]/15 border border-[#39ff14] flex items-center justify-center text-[#39ff14]">
              <i className="fa-brands fa-whatsapp text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Fale com um Especialista PEPY</h3>
              <span className="text-xs text-gray-400">Atendimento humanizado e consultoria técnica</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#39ff14]/20 border-2 border-[#39ff14] text-[#39ff14] flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_#39ff14]">
              <i className="fa-solid fa-check" />
            </div>
            <h4 className="text-lg font-bold text-white">Solicitação Recebida com Sucesso!</h4>
            <p className="text-xs text-gray-300">
              Nosso consultor de imóveis e engenheiro de plantas entrará em contato em breve pelo WhatsApp fornecido.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {defaultSubject && (
              <div className="bg-[#112233] px-3.5 py-2 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-400">Interesse:</span>
                <span className="font-semibold text-[#39ff14] truncate max-w-[280px]">
                  {defaultSubject}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Seu Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ana Maria Silva"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.4)] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                WhatsApp / Telefone para Contato
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#ff007f] focus:shadow-[0_0_10px_rgba(255,0,127,0.4)] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Melhor Período para Retorno
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['manha', 'tarde', 'noite'] as const).map((shift) => (
                  <button
                    type="button"
                    key={shift}
                    onClick={() => setPreferredShift(shift)}
                    className={`py-2 rounded-lg font-medium capitalize border transition ${
                      preferredShift === shift
                        ? 'bg-[#39ff14]/20 border-[#39ff14] text-[#39ff14]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {shift === 'manha' ? 'Manhã' : shift === 'tarde' ? 'Tarde' : 'Noite'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Mensagem ou Dúvida (Opcional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Gostaria de saber as opções de financiamento ou agendar visita presencial."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#ff007f] transition resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.4)]"
              >
                <i className="fa-solid fa-paper-plane" />
                <span>Enviar Solicitação</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="py-3 px-4 rounded-xl border border-[#39ff14] bg-[#39ff14]/15 hover:bg-[#39ff14]/25 text-[#39ff14] font-bold text-xs tracking-wider transition flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-whatsapp text-sm" />
                <span>Conversar Agora</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
