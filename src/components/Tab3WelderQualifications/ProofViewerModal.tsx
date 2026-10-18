import React from 'react';
import { X, Download, ShieldCheck } from 'lucide-react';

interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentUrl: string;
  welderName: string;
  stampNumber: string;
  process: string;
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({
  isOpen,
  onClose,
  documentName,
  documentUrl,
  welderName,
  stampNumber,
  process,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = documentUrl;
    a.download = documentName || `WPQR_Cert_${stampNumber}_${process}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Welder Performance Qualification Record (WPQR) Proof</h3>
              <p className="text-xs text-slate-400">
                {welderName} (Stamp #{stampNumber}) · Process {process}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview viewport */}
        <div className="p-6 overflow-y-auto flex items-center justify-center bg-slate-100 flex-1 min-h-[400px]">
          {documentUrl.startsWith('data:image') || documentUrl.startsWith('http') || documentUrl.startsWith('blob:') ? (
            <img
              src={documentUrl}
              alt={documentName}
              className="max-w-full max-h-[65vh] object-contain rounded border border-slate-300 shadow-sm bg-white"
            />
          ) : (
            <div className="text-center p-8 bg-white rounded-lg border border-slate-300 max-w-md">
              <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">{documentName}</p>
              <p className="text-xs text-slate-500 mt-1">Certified qualification record on file.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>File: <strong className="text-slate-700 font-mono">{documentName}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
