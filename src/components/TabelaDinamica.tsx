import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

interface TabelaDinamicaProps {
  colunas: string[];
  linhas: string[][];
  onColunasChange: (colunas: string[]) => void;
  onLinhasChange: (linhas: string[][]) => void;
}

const TabelaDinamica: React.FC<TabelaDinamicaProps> = ({
  colunas,
  linhas,
  onColunasChange,
  onLinhasChange,
}) => {
  const [novaColuna, setNovaColuna] = useState('');

  const adicionarColuna = () => {
    if (!novaColuna.trim()) return;

    onColunasChange([...colunas, novaColuna]);
    onLinhasChange(linhas.map((linha) => [...linha, '']));
    setNovaColuna('');
  };

  const removerColuna = (index: number) => {
    onColunasChange(colunas.filter((_, i) => i !== index));
    onLinhasChange(linhas.map((linha) => linha.filter((_, i) => i !== index)));
  };

  const adicionarLinha = () => {
    onLinhasChange([...linhas, Array(colunas.length).fill('')]);
  };

  const removerLinha = (index: number) => {
    onLinhasChange(linhas.filter((_, i) => i !== index));
  };

  const atualizarCelula = (linhaIndex: number, colunaIndex: number, valor: string) => {
    const novasLinhas = [...linhas];
    novasLinhas[linhaIndex][colunaIndex] = valor;
    onLinhasChange(novasLinhas);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Tabela de Dados Técnicos</h2>

      {/* Adicionar Coluna */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={novaColuna}
          onChange={(e) => setNovaColuna(e.target.value)}
          placeholder="Nome da nova coluna..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && adicionarColuna()}
        />
        <button
          onClick={adicionarColuna}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Adicionar Coluna
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {colunas.map((coluna, i) => (
                <th key={i} className="border border-gray-300 px-4 py-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{coluna}</span>
                    <button
                      onClick={() => removerColuna(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {linha.map((celula, j) => (
                  <td key={j} className="border border-gray-300 p-1">
                    <input
                      type="text"
                      value={celula}
                      onChange={(e) => atualizarCelula(i, j, e.target.value)}
                      className="w-full px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 text-center">
                  <button
                    onClick={() => removerLinha(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={adicionarLinha}
        className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Adicionar Linha
      </button>
    </div>
  );
};

export default TabelaDinamica;