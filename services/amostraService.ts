import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { Amostra, AmostraInput, Categoria } from '../types';
import { COLECOES } from '../utils/constants';

const colecao = collection(db, COLECOES.AMOSTRAS);

function usuarioAtual(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('Faça login para acessar o acervo.');
  }
  return uid;
}

export async function listarAmostras(
  categoria?: Categoria,
  tipo?: string,
  termoBusca?: string
): Promise<Amostra[]> {
  const uid = usuarioAtual();

  let amostras: Amostra[] = [];

  try {
    // Tenta consulta indexada
    let q = query(colecao, where('createdBy', '==', uid));
    if (categoria) {
      q = query(colecao, where('createdBy', '==', uid), where('categoria', '==', categoria));
    }
    const snapshot = await getDocs(q);
    amostras = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as object) } as Amostra));
  } catch {
    // Fallback simples sem múltiplos filtros no Firestore para evitar exigência de índice composto
    const snapshot = await getDocs(query(colecao, where('createdBy', '==', uid)));
    amostras = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as object) } as Amostra));
    if (categoria) {
      amostras = amostras.filter(item => item.categoria === categoria);
    }
  }

  // Filtro adicional por tipo geológico (RF-06 e RF-07)
  if (tipo && tipo.trim() !== '' && tipo !== 'Todos') {
    amostras = amostras.filter(
      item => item.tipo && item.tipo.toLowerCase() === tipo.toLowerCase()
    );
  }

  // Filtro textual por termo de busca
  if (termoBusca && termoBusca.trim() !== '') {
    const termo = termoBusca.trim().toLowerCase();
    amostras = amostras.filter(item =>
      (item.nome && item.nome.toLowerCase().includes(termo)) ||
      (item.tipo && item.tipo.toLowerCase().includes(termo)) ||
      (item.descricao && item.descricao.toLowerCase().includes(termo)) ||
      (item.localizacao && item.localizacao.toLowerCase().includes(termo))
    );
  }

  // Ordena alfabeticamente por nome
  amostras.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

  return amostras;
}

export async function buscarAmostra(id: string): Promise<Amostra> {
  usuarioAtual();
  const snapshot = await getDoc(doc(db, COLECOES.AMOSTRAS, id));
  if (!snapshot.exists()) {
    throw new Error('Amostra não encontrada.');
  }
  const data = snapshot.data();
  if (data.createdBy !== auth.currentUser?.uid) {
    throw new Error('Amostra não encontrada no seu acervo.');
  }
  return { id: snapshot.id, ...data } as Amostra;
}

export async function criarAmostra(dados: AmostraInput): Promise<string> {
  const uid = usuarioAtual();

  if (!dados.nome || !dados.nome.trim()) {
    throw new Error('O nome da amostra é obrigatório.');
  }
  if (!dados.tipo || !dados.tipo.trim()) {
    throw new Error('O tipo da amostra é obrigatório.');
  }

  const payload = {
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    tipo: dados.tipo.trim(),
    dureza: dados.dureza !== undefined && dados.dureza !== null ? Number(dados.dureza) : null,
    descricao: dados.descricao ? dados.descricao.trim() : '',
    localizacao: dados.localizacao ? dados.localizacao.trim() : '',
    dataAquisicao: dados.dataAquisicao ? dados.dataAquisicao.trim() : '',
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(colecao, payload);
  return ref.id;
}

export async function atualizarAmostra(id: string, dados: AmostraInput): Promise<void> {
  usuarioAtual();

  if (!dados.nome || !dados.nome.trim()) {
    throw new Error('O nome da amostra é obrigatório.');
  }
  if (!dados.tipo || !dados.tipo.trim()) {
    throw new Error('O tipo da amostra é obrigatório.');
  }

  const payload = {
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    tipo: dados.tipo.trim(),
    dureza: dados.dureza !== undefined && dados.dureza !== null ? Number(dados.dureza) : null,
    descricao: dados.descricao ? dados.descricao.trim() : '',
    localizacao: dados.localizacao ? dados.localizacao.trim() : '',
    dataAquisicao: dados.dataAquisicao ? dados.dataAquisicao.trim() : '',
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, COLECOES.AMOSTRAS, id), payload);
}

export async function removerAmostra(id: string): Promise<void> {
  usuarioAtual();
  await deleteDoc(doc(db, COLECOES.AMOSTRAS, id));
}

export async function obterEstatisticas(): Promise<{ total: number; rochas: number; minerais: number }> {
  const amostras = await listarAmostras();
  const rochas = amostras.filter(a => a.categoria === 'rocha').length;
  const minerais = amostras.filter(a => a.categoria === 'mineral').length;
  return {
    total: amostras.length,
    rochas,
    minerais,
  };
}
