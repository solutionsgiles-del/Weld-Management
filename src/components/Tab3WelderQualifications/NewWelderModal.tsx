import React, { useState } from 'react';
import { Welder } from '../../types';
import { X, UserPlus, Stamp } from 'lucide-react';

interface NewWelderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWelder: (welder: Welder) => void;
  existingStamps: string[];
}

export const NewWelderModal: React.FC<NewWelderModalProps> = ({
  isOpen,
  onClose,
  onAddWelder,
  existingStamps,
}) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [stampNumber, setStampNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formattedStamp = stampNumber.trim().toUpperCase();

    if (!firstName.trim() || !surname.trim() || !idNumber.trim() || !formattedStamp) {
      setError('Please fill in all required welder identity fields.');
      return;
    }

    if (existingStamps.map((s) => s.toUpperCase()).includes(formattedStamp)) {
      setError(`Stamp number "${formattedStamp}" is already assigned to another welder in the registry.`);
      return;
    }

    const newWelder: Welder = {
      id: `WLD-${Date.now()}`,
      firstName: firstName.trim(),
      surname: surname.trim(),
      idNumber: idNumber.trim(),
      stampNumber: formattedStamp,
      hireDate: new Date().toISOString().split('T')[0],
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      qualifications: [],
    };

    onAddWelder(newWelder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Load New Welder</h3>
              <p className="text-xs text-slate-400">Register welder credentials &amp; stamp number</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Name & Surname */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Liam"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Surname *
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="e.g. O'Connor"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* ID Number */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>National ID / Employee Number *</span>
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g. ID-890214-7712 or EMP-1049"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              required
            />
          </div>

          {/* Stamp Number */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Stamp className="w-3.5 h-3.5 text-amber-600" />
                <span>Welder Stamp Number *</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Unique Identifier</span>
            </label>
            <input
              type="text"
              value={stampNumber}
              onChange={(e) => setStampNumber(e.target.value)}
              placeholder="e.g. W-620"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono uppercase font-bold text-amber-900"
              required
            />
          </div>

          {/* Contact Details (optional) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0192"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="welder@fabworks.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              Register Welder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
