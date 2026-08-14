import React from 'react';
import { Course } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

interface ReceiptModalProps {
  course: Course | null;
  onClose: () => void;
  onDownloadTxt: (course: Course) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ course, onClose, onDownloadTxt }) => {
  if (!course) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(course.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const montantTotal = course.prixAccepte || course.prixPropose || 1500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#1C1C1C] border border-[#333] rounded-3xl w-full max-w-xl p-5 sm:p-8 relative shadow-2xl text-white space-y-6 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Close button (Hidden during printing) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 print:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 1. Header with Golden Hippo Logo next to NIF and TVA */}
        <div className="border-b border-[#333] pb-5 flex items-center justify-between gap-4 print:border-gray-300">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo exact 64x64px or 80x80px with golden border */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#121212] border-2 border-[var(--accent-color)] p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-lg print:border-amber-600">
              <img
                src="/logo-tak-tak.png"
                alt="Logo TAK TAK TAXI Hippopotame Doré"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white print:text-black tracking-tight flex items-center gap-2">
                <span>TAK TAK TAXI NIGER</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/40 print:bg-amber-100 print:text-amber-800">
                  SARL
                </span>
              </h2>
              {/* Fiscal Identification: NIF & TVA */}
              <div className="text-[11px] sm:text-xs text-gray-300 print:text-gray-700 font-mono space-y-0.5 mt-1">
                <p>
                  <strong className="text-[var(--accent-color)] print:text-amber-800">NIF :</strong> NIF-2026-NE-84920
                </p>
                <p>
                  <strong className="text-[var(--accent-color)] print:text-amber-800">TVA (19%) :</strong> Exonérée 0% (Régime Transport Niamey)
                </p>
                <p className="text-[10px] text-gray-400 print:text-gray-500 font-sans">
                  Avenue du Fleuve, Quartier Grand Marché, Niamey
                </p>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 hidden sm:block">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg print:border-emerald-700 print:text-emerald-800">
              FACTURÉ / REÇU
            </span>
            <p className="text-[11px] text-gray-400 mt-2 font-mono">Facture N° FACT-{course.id}</p>
          </div>
        </div>

        {/* 2. Facture Overview */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 text-xs space-y-3 print:bg-gray-50 print:border-gray-200 print:text-black">
          <div className="flex justify-between items-center text-gray-400 print:text-gray-600 border-b border-[#262626] print:border-gray-200 pb-2">
            <span>Date & Heure :</span>
            <span className="font-semibold text-white print:text-black">{formattedDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 print:text-gray-600 block mb-0.5">
                Passager
              </span>
              <p className="font-bold text-white print:text-black text-sm">{course.passagerName}</p>
              <p className="text-gray-400 print:text-gray-600 font-mono text-[11px]">{course.passagerPhone}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 print:text-gray-600 block mb-0.5">
                Chauffeur & Véhicule
              </span>
              <p className="font-bold text-white print:text-black text-sm">
                {course.chauffeurName || 'Abdoulaye Moussa'}
              </p>
              <p className="text-[var(--accent-color)] print:text-amber-800 font-mono text-[11px] font-bold">
                Plaque: {course.chauffeurPlaque || 'RN-4582-NY'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Trajet */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-gray-300 print:text-gray-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>Détail du Trajet Niamey</span>
          </h4>
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-3.5 space-y-2 print:bg-gray-50 print:border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-gray-400 print:text-gray-600 w-16 shrink-0">Départ :</span>
              <span className="font-bold text-white print:text-black truncate">{course.departNom}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
              <span className="text-gray-400 print:text-gray-600 w-16 shrink-0">Arrivée :</span>
              <span className="font-bold text-white print:text-black truncate">{course.arriveeNom}</span>
            </div>
          </div>
        </div>

        {/* 4. Tableau des Prix & Fiscalité */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 space-y-2 text-xs print:bg-gray-50 print:border-gray-200">
          <div className="flex justify-between items-center text-gray-300 print:text-gray-700">
            <span>Tarif Course Négocié (Espèces)</span>
            <span className="font-bold text-white print:text-black">{montantTotal} FCFA</span>
          </div>
          <div className="flex justify-between items-center text-gray-300 print:text-gray-700">
            <span>Frais de service TAK TAK TAXI</span>
            <span className="font-bold text-emerald-400 print:text-emerald-700">0 FCFA (0% Bêta)</span>
          </div>
          <div className="flex justify-between items-center text-gray-300 print:text-gray-700 border-b border-[#262626] print:border-gray-200 pb-2">
            <span>TVA Exonérée (NIF-2026-NE-84920)</span>
            <span className="font-bold text-white print:text-black">0 FCFA</span>
          </div>

          <div className="flex justify-between items-center pt-2 text-sm">
            <span className="font-extrabold text-white print:text-black uppercase">Total Payé :</span>
            <span className="text-base font-black text-[var(--accent-color)] print:text-amber-800">
              {montantTotal} FCFA
            </span>
          </div>
        </div>

        {/* Mention Légale */}
        <div className="p-3 rounded-xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 text-[11px] text-gray-300 print:text-gray-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
          <span>
            Facture officielle conforme aux réglementations de transport à Niamey. Aucune commission n&apos;est prélevée durant la phase Bêta.
          </span>
        </div>

        {/* Actions (Hidden when printing) */}
        <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
          <button
            onClick={() => onDownloadTxt(course)}
            className="px-4 py-2.5 rounded-xl bg-[#262626] hover:bg-[#333] border border-[#444] text-xs font-bold text-gray-200 flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Fichier .TXT</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
