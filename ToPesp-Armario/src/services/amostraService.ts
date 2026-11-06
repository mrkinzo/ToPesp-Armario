import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Amostra, AmostraInput, Categoria } from '../types';

const colecao = collection(db, 'amostras');
function usuarioAtual(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para acessar o acervo.');
  return uid;
}
export async function listarAmostras(categoria?: Categoria): Promise<Amostra[]> {
  usuarioAtual();
  const uid = usuarioAtual();
  const q = categoria
    ? query(colecao, where('createdBy', '==', uid), where('categoria', '==', categoria), orderBy('nome'))
    : query(colecao, where('createdBy', '==', uid), orderBy('nome'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Amostra));
}
export async function buscarAmostra(id: string): Promise<Amostra> {
  usuarioAtual();
  const snapshot = await getDoc(doc(db, 'amostras', id));
  if (!snapshot.exists()) throw new Error('Amostra não encontrada.');
  const data = snapshot.data();
  if (data.createdBy !== auth.currentUser?.uid) throw new Error('Amostra não encontrada no seu acervo.');
  return { id: snapshot.id, ...data } as Amostra;
}
export async function criarAmostra(dados: AmostraInput): Promise<string> {
  const uid = usuarioAtual();
  const ref = await addDoc(colecao, { ...dados, createdBy: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return ref.id;
}
export async function atualizarAmostra(id: string, dados: AmostraInput): Promise<void> {
  usuarioAtual();
  await updateDoc(doc(db, 'amostras', id), { ...dados, updatedAt: serverTimestamp() });
}
export async function removerAmostra(id: string): Promise<void> {
  usuarioAtual();
  await deleteDoc(doc(db, 'amostras', id));
}
