/// <reference types="react" />
/// <reference types="react/jsx-runtime" />
import React, { useState } from 'react';
import { X, User, BadgeCheck, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { api } from '../lib/api';

interface RankingNameModalProps {
  open: boolean;
  defaultName: string;
  game?: string;
  userId?: number;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export function RankingNameModal({ open, defaultName, game, userId, onConfirm, onCancel }: RankingNameModalProps) {
  const [name, setName] = useState(defaultName || '');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  if (!open) return null;

  const validateName = (n: string) => {
    const trimmed = n.trim();
    if (trimmed.length < 3) return 'El nombre debe tener al menos 3 caracteres';
    if (trimmed.length > 30) return 'El nombre no debe superar 30 caracteres';
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(trimmed)) {
      return 'Solo se permiten letras, números, espacios, guiones y guiones bajos';
    }
    return '';
  };

  const submit = async (e: any) => {
    e.preventDefault();
    const trimmed = name.trim();
    
    // Validar formato
    const validationError = validateName(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Si es el nombre por defecto, no validar duplicados
    if (trimmed === defaultName) {
      onConfirm(trimmed);
      return;
    }

    // Validar que no sea un nombre duplicado en el ranking
    if (game && userId) {
      setChecking(true);
      try {
        const result = await api.checkRankingNameExists(game, trimmed, userId);
        if (result.exists) {
          setError('❌ Este nombre ya existe en el ranking. Elige otro');
          setChecking(false);
          return;
        }
      } catch (err) {
        console.warn('Error verificando nombre:', err);
        // Continuar igualmente
      }
      setChecking(false);
    }

    setError('');
    onConfirm(trimmed || defaultName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-4 border-purple-500 rounded-lg shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' }}>
        <div className="relative bg-black/50 p-6 border-b-2 border-purple-500/50">
          <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-white active:text-purple-300 transition-colors duration-200 ease-out">
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
              onChange={(e: any) => {
                setName(e.target.value);
                setError('');
              }}
              className="bg-black/50 border-purple-500/50 text-white focus:border-purple-400"
              placeholder={defaultName}
              maxLength={30}
              disabled={checking}
            />
            <p className="text-xs text-gray-400">Si lo dejas vacío, usaremos tu nombre de usuario: <span className="text-purple-300">{defaultName}</span></p>
            
            {error && (
              <div className="flex items-start gap-2 p-3 rounded bg-red-900/30 border border-red-500/50 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="border-purple-500/50 text-purple-200 hover:bg-purple-600/30 active:bg-purple-700/40 active:scale-95 hover:text-white transition-all duration-200 ease-out w-1/3" disabled={checking}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 active:scale-95 transition-all duration-200 ease-out w-2/3" style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }} disabled={checking}>
              {checking ? 'Validando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
