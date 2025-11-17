/// <reference types="react" />
/// <reference types="react/jsx-runtime" />
import React, { useState } from 'react';
import { X, User, BadgeCheck } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface RankingNameModalProps {
  open: boolean;
  defaultName: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export function RankingNameModal({ open, defaultName, onConfirm, onCancel }: RankingNameModalProps) {
  const [name, setName] = useState(defaultName || '');
  if (!open) return null;

  const submit = (e: any) => {
    e.preventDefault();
    const trimmed = name.trim();
    onConfirm(trimmed.length >= 3 ? trimmed : defaultName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-4 border-purple-500 rounded-lg shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' }}>
        <div className="relative bg-black/50 p-6 border-b-2 border-purple-500/50">
          <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <BadgeCheck className="w-7 h-7 text-purple-400" />
            <h2 className="text-white" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.8)', fontFamily: 'monospace' }}>
              Nombre para el ranking
            </h2>
          </div>
          <p className="text-purple-200 text-sm">Este nombre aparecerá en la tabla de posiciones para este juego. Puedes cambiarlo luego desde tu Perfil.</p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rankingName" className="text-purple-200 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre a mostrar (3-30 caracteres)
            </Label>
            <Input
              id="rankingName"
              type="text"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              className="bg-black/50 border-purple-500/50 text-white focus:border-purple-400"
              placeholder={defaultName}
              maxLength={30}
            />
            <p className="text-xs text-gray-400">Si lo dejas vacío, usaremos tu nombre de usuario: <span className="text-purple-300">{defaultName}</span></p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="border-purple-500/50 text-purple-200 hover:bg-purple-600/30 hover:text-white w-1/3">Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 w-2/3" style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
