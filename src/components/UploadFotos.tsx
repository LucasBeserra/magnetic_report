import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import type { Foto } from '../types/types';

interface UploadFotosProps {
  fotos: Foto[];
  onFotosChange: (fotos: Foto[]) => void;
}

const UploadFotos: React.FC<UploadFotosProps> = ({ fotos, onFotosChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são permitidas!');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const novaFoto: Foto = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target?.result as string,
          nome: file.name,
          descricao: '',
        };

        onFotosChange([...fotos, novaFoto]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removerFoto = (id: number) => {
    onFotosChange(fotos.filter((f) => f.id !== id));
  };

  const atualizarDescricao = (id: number, descricao: string) => {
    onFotosChange(
      fotos.map((f) => (f.id === id ? { ...f, descricao } : f))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Upload className="text-blue-600" size={24} />
        Registro Fotográfico
      </h2>

      <div className="mb-4">
        <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="font-medium text-gray-600">
              Clique para fazer upload ou arraste imagens aqui
            </span>
            <span className="text-xs text-gray-500">PNG, JPG, WEBP até 5MB</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {fotos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fotos.map((foto) => (
            <div key={foto.id} className="border rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={foto.preview}
                  alt={foto.nome}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removerFoto(foto.id!)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 mb-2 truncate">{foto.nome}</p>
                <input
                  type="text"
                  value={foto.descricao}
                  onChange={(e) => atualizarDescricao(foto.id!, e.target.value)}
                  placeholder="Descrição da foto..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadFotos;