import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function registrar(nome: string, email: string, senha: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
  await updateProfile(credential.user, { displayName: nome.trim() });
  await setDoc(doc(db, 'usuarios', credential.user.uid), {
    nome: nome.trim(), email: email.trim().toLowerCase(), criadoEm: serverTimestamp(),
  });
  return credential.user;
}
export async function entrar(email: string, senha: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), senha);
  return result.user;
}
export async function sair(): Promise<void> { await signOut(auth); }
