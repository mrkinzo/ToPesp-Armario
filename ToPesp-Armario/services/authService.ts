import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Usuario } from '../types';
import { COLECOES } from '../utils/constants';

export async function registrar(nome: string, email: string, senha: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
  await updateProfile(credential.user, { displayName: nome.trim() });

  await setDoc(doc(db, COLECOES.USUARIOS, credential.user.uid), {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    criadoEm: serverTimestamp(),
  });

  return credential.user;
}

export async function entrar(email: string, senha: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), senha);
  return result.user;
}

export async function sair(): Promise<void> {
  await signOut(auth);
}

export function obterUsuarioAtual(): User | null {
  return auth.currentUser;
}

export async function buscarDadosUsuario(uid: string): Promise<Usuario | null> {
  const docSnap = await getDoc(doc(db, COLECOES.USUARIOS, uid));
  if (!docSnap.exists()) {
    return null;
  }
  const data = docSnap.data();
  return {
    id: docSnap.id,
    nome: data.nome || auth.currentUser?.displayName || 'Usuário',
    email: data.email || auth.currentUser?.email || '',
    criadoEm: data.criadoEm,
  };
}

export function escutarEstadoAutenticacao(callback: (usuario: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
