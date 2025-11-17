import React, { useState } from 'react';
import { FileText, Save, Eye, Download } from 'lucide-react';
import UploadFotos from './components/UploadFotos';
import TabelaDinamica from './components/TabelaDinamica';
import type { FormData, Foto } from './types/types';
import * as api from './services/api';

function App() {
  const [formData, setFormData] = useState<FormData>({
    codigoPedido: '',
    titulo: '',
    clienteNome: '',
    clienteEmail: '',
    produtoNome: '',
    produtoCodigo: '',
    descricao: '',
    observacoes: '',
  });

  const [fotos, setFotos] = useState<Foto[]>([]);
  const [colunas, setColunas] = useState<string[]>(['Medida', 'Valor', 'Status']);
  const [linhas, setLinhas] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
  ]);

  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relatorioId, setRelatorioId] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const salvarRelatorio = async () => {
    try {
      setLoading(true);

      // Validações básicas
      if (!formData.codigoPedido || !formData.clienteNome || !formData.produtoNome) {
        alert('Preencha os campos obrigatórios: Código do Pedido, Cliente e Produto');
        return;
      }

      // 1. Criar/buscar cliente
      const cliente = await api.criarCliente({
        nome: formData.clienteNome,
        email: formData.clienteEmail || undefined,
      });

      // 2. Criar/buscar produto
      const produto = await api.criarProduto({
        nome: formData.produtoNome,
        codigo: formData.produtoCodigo || `PROD-${Date.now()}`,
      });

      // 3. Criar relatório
      const relatorio = await api.criarRelatorio({
        codigo_pedido: formData.codigoPedido,
        titulo: formData.titulo || undefined,
        descricao: formData.descricao || undefined,
        observacoes: formData.observacoes || undefined,
        cliente_id: cliente.id!,
        produto_id: produto.id!,
        dados_tabela: {
          estrutura: { colunas },
          dados: linhas,
        },
        status: 'rascunho',
      });

      setRelatorioId(relatorio.id!);

      // 4. Upload das fotos
      for (const foto of fotos) {
        if (foto.file) {
          await api.adicionarFoto(relatorio.id!, foto.file, foto.descricao);
        }
      }

      alert('✅ Relatório salvo com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar relatório:', error);
      alert(`❌ Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!relatorioId) {
      alert('Salve o relatório primeiro!');
      return;
    }

    try {
      setLoading(true);
      await api.downloadPDF(relatorioId, formData.codigoPedido);
      alert('✅ PDF baixado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error);
      alert(`❌ Erro ao gerar PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Modo Visualização
  if (modoVisualizacao) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MAGNETIC REPORT</h1>
            <p className="text-gray-600">Relatório Técnico</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informações do Pedido</h2>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <span className="font-semibold">Código do Pedido:</span>{' '}
                {formData.codigoPedido || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Título:</span> {formData.titulo || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Cliente:</span> {formData.clienteNome || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {formData.clienteEmail || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Produto:</span> {formData.produtoNome || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Código Produto:</span>{' '}
                {formData.produtoCodigo || 'N/A'}
              </div>
            </div>
          </div>

          {formData.descricao && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{formData.descricao}</p>
            </div>
          )}

          {linhas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Dados Técnicos</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      {colunas.map((col, i) => (
                        <th key={i} className="border border-gray-300 px-4 py-2">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((linha, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {linha.map((celula, j) => (
                          <td key={j} className="border border-gray-300 px-4 py-2">
                            {celula || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {fotos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Registro Fotográfico</h2>
              <div className="space-y-6">
                {fotos.map((foto) => (
                  <div key={foto.id} className="border rounded-lg overflow-hidden">
                    <img
                      src={foto.preview}
                      alt={foto.nome}
                      className="w-full h-96 object-contain bg-gray-100"
                    />
                    {foto.descricao && (
                      <div className="p-3 bg-gray-50 text-sm text-gray-700 italic">
                        {foto.descricao}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.observacoes && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Observações</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{formData.observacoes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setModoVisualizacao(false)}
              className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Voltar para Edição
            </button>
            <button
              onClick={downloadPDF}
              disabled={loading || !relatorioId}
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <Download size={20} />
              {loading ? 'Gerando...' : 'Baixar PDF'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modo Edição
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="text-blue-600" />
            Magnetic Report
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Relatórios Técnicos Interativos</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Informações do Relatório</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código do Pedido *
              </label>
              <input
                type="text"
                name="codigoPedido"
                value={formData.codigoPedido}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: PED-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título do Relatório
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Inspeção Técnica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Cliente *
              </label>
              <input
                type="text"
                name="clienteNome"
                value={formData.clienteNome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email do Cliente
              </label>
              <input
                type="email"
                name="clienteEmail"
                value={formData.clienteEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                name="produtoNome"
                value={formData.produtoNome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Válvula Industrial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código do Produto
              </label>
              <input
                type="text"
                name="produtoCodigo"
                value={formData.produtoCodigo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: PROD-123"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva o contexto do relatório..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
        </div>

        <UploadFotos fotos={fotos} onFotosChange={setFotos} />

        <div className="mt-6">
          <TabelaDinamica
            colunas={colunas}
            linhas={linhas}
            onColunasChange={setColunas}
            onLinhasChange={setLinhas}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => setModoVisualizacao(true)}
            className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 font-semibold"
          >
            <Eye size={20} />
            Visualizar Relatório
          </button>
          <button
            onClick={salvarRelatorio}
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold disabled:bg-gray-400"
          >
            <Save size={20} />
            {loading ? 'Salvando...' : 'Salvar Relatório'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
