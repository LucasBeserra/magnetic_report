import type { Cliente, Produto, Relatorio } from '../types/types';

const API_BASE_URL = 'http://localhost:8000';

// Função auxiliar para tratar erros
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(error.detail || 'Erro na requisição');
  }
  return response.json();
};

// ========== CLIENTES ==========

export const criarCliente = async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
  const response = await fetch(`${API_BASE_URL}/clientes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });
  return handleResponse(response);
};

export const listarClientes = async (): Promise<Cliente[]> => {
  const response = await fetch(`${API_BASE_URL}/clientes/`);
  return handleResponse(response);
};

export const buscarCliente = async (id: number): Promise<Cliente> => {
  const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
  return handleResponse(response);
};

// ========== PRODUTOS ==========

export const criarProduto = async (produto: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await fetch(`${API_BASE_URL}/produtos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  return handleResponse(response);
};

export const listarProdutos = async (): Promise<Produto[]> => {
  const response = await fetch(`${API_BASE_URL}/produtos/`);
  return handleResponse(response);
};

export const buscarProduto = async (id: number): Promise<Produto> => {
  const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
  return handleResponse(response);
};

// ========== RELATÓRIOS ==========

export const criarRelatorio = async (relatorio: Omit<Relatorio, 'id'>): Promise<Relatorio> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(relatorio),
  });
  return handleResponse(response);
};

export const listarRelatorios = async (): Promise<Relatorio[]> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/`);
  return handleResponse(response);
};

export const buscarRelatorio = async (id: number): Promise<Relatorio> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/${id}`);
  return handleResponse(response);
};

export const atualizarRelatorio = async (
  id: number,
  relatorio: Partial<Relatorio>
): Promise<Relatorio> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(relatorio),
  });
  return handleResponse(response);
};

export const deletarRelatorio = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar relatório');
  }
};

// ========== FOTOS ==========

export const adicionarFoto = async (
  relatorioId: number,
  file: File,
  descricao?: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  if (descricao) {
    formData.append('descricao', descricao);
  }

  const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}/fotos`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
};

export const listarFotos = async (relatorioId: number): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}/fotos`);
  return handleResponse(response);
};

export const deletarFoto = async (relatorioId: number, fotoId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}/fotos/${fotoId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar foto');
  }
};

// ========== PDF ==========

export const gerarPDF = async (relatorioId: number): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/relatorios/${relatorioId}/pdf`);
  if (!response.ok) {
    throw new Error('Erro ao gerar PDF');
  }
  return response.blob();
};

export const downloadPDF = async (relatorioId: number, codigoPedido: string): Promise<void> => {
  const blob = await gerarPDF(relatorioId);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `relatorio_${codigoPedido}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};