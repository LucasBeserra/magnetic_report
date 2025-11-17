export interface Cliente {
  id?: number;
  nome: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  endereco?: string;
}

export interface Produto {
  id?: number;
  nome: string;
  codigo: string;
  descricao?: string;
  categoria?: string;
  template_tabela?: any;
}

export interface Foto {
  id?: number;
  file?: File;
  preview: string;
  nome: string;
  descricao?: string;
  relatorio_id?: number;
  nome_original?: string;
  nome_arquivo?: string;
  caminho?: string;
  tamanho?: number;
  mime_type?: string;
  ordem?: number;
}

export interface DadosTabela {
  estrutura: {
    colunas: string[];
  };
  dados: string[][];
}

export interface Relatorio {
  id?: number;
  codigo_pedido: string;
  titulo?: string;
  descricao?: string;
  observacoes?: string;
  cliente_id: number;
  produto_id: number;
  dados_tabela?: DadosTabela;
  status?: string;
  cliente?: Cliente;
  produto?: Produto;
  fotos?: Foto[];
  created_at?: string;
  updated_at?: string;
}

export interface FormData {
  codigoPedido: string;
  titulo: string;
  clienteNome: string;
  clienteEmail: string;
  produtoNome: string;
  produtoCodigo: string;
  descricao: string;
  observacoes: string;
}