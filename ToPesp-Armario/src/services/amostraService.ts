import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { Amostra, AmostraInput, Categoria } from '../types';
import { COLECOES } from '../utils/constants';

const colecao = collection(db, COLECOES.AMOSTRAS);

/**
 * Aguarda o Firebase Auth terminar de inicializar e retorna o UID do usuário.
 * Evita race condition em que auth.currentUser ainda é null durante o boot do app,
 * pois o SDK do Firebase restaura a sessão de forma assíncrona via AsyncStorage.
 */
function aguardarUsuarioAtual(): Promise<string> {
  return new Promise((resolve, reject) => {
    // currentUser é null antes da inicialização E null quando não há sessão.
    // A diferença é que currentUser sai de "undefined" para null/User após init.
    // Na prática, o SDK sempre dispara onAuthStateChanged ao ser registrado,
    // então aguardar o primeiro evento é a forma segura de obter o estado real.
    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error('Tempo limite de autenticação atingido. Faça login novamente.'));
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, user => {
      clearTimeout(timeoutId);
      unsubscribe();
      if (user?.uid) {
        resolve(user.uid);
      } else {
        reject(new Error('Faça login para acessar o acervo.'));
      }
    });
  });
}

export async function listarAmostras(
  categoria?: Categoria,
  tipo?: string,
  termoBusca?: string
): Promise<Amostra[]> {
  const uid = await aguardarUsuarioAtual();

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
  const uid = await aguardarUsuarioAtual();
  const snapshot = await getDoc(doc(db, COLECOES.AMOSTRAS, id));
  if (!snapshot.exists()) {
    throw new Error('Amostra não encontrada.');
  }
  const data = snapshot.data();
  if (data.createdBy !== uid) {
    throw new Error('Amostra não encontrada no seu acervo.');
  }
  return { id: snapshot.id, ...data } as Amostra;
}

export async function criarAmostra(dados: AmostraInput): Promise<string> {
  const uid = await aguardarUsuarioAtual();

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
  await aguardarUsuarioAtual();

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
  await aguardarUsuarioAtual();
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
