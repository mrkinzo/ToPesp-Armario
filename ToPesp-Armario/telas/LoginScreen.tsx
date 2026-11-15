import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Cabecalho, Rodape, CampoTexto, Botao, Separador } from '../components/UI';
import { entrar } from '../services/authService';
import { CORES, FONTE_SERIF } from '../utils/constants';
import { exibirAlerta } from '../utils/alerta';

interface LoginScreenProps {
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
}

export default function LoginScreen({ navigation, onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function navegar(tela: string, params?: any) {
    if (navigation?.navigate) {
      navigation.navigate(tela, params);
    } else if (onNavigate) {
      onNavigate(tela, params);
    }
  }

  async function handleEntrar() {
    setErro(null);
    if (!email.trim() || !senha.trim()) {
      const msg = 'Por favor, informe seu email e senha.';
      setErro(msg);
      exibirAlerta('Campos Obrigatórios', msg);
      return;
    }

    try {
      setCarregando(true);
      await entrar(email.trim(), senha);
      navegar('Inicio');
    } catch (err: any) {
      let msg = 'Não foi possível entrar. Verifique seus dados e tente novamente.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        msg = 'Email ou senha incorretos.';
      } else if (err.code === 'auth/configuration-not-found') {
        msg = 'O provedor de Autenticação (Email/Senha) precisa ser ativado no Firebase Console do seu projeto.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Formato de email inválido.';
      }
      setErro(msg);
      exibirAlerta('Erro no Login', msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Cabecalho
        titulo="ToPesp - Armário"
        subtitulo="Acervo Pessoal de Rochas e Minerais"
        aoSobre={() => navegar('Sobre')}
      />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.formulario}>
          <Text style={estilos.tituloSessao}>Acesse seu Armário</Text>
          <Text style={estilos.descricaoSessao}>
            Entre com suas credenciais para consultar, catalogar e administrar suas amostras.
          </Text>

          {erro ? <Text style={estilos.mensagemErro}>[Aviso] {erro}</Text> : null}

          <CampoTexto
            rotulo="Email"
            valor={email}
            aoMudarTexto={setEmail}
            placeholder="exemplo@dominio.com"
            tipoTeclado="email-address"
            obrigatorio
          />

          <CampoTexto
            rotulo="Senha"
            valor={senha}
            aoMudarTexto={setSenha}
            placeholder="Digite sua senha"
            seguro
            obrigatorio
          />

          <Botao
            titulo="Entrar no Sistema"
            onPress={handleEntrar}
            carregando={carregando}
            estilo={{ marginTop: 12 }}
          />

          <Separador />

          <Text style={estilos.textoAuxiliar}>Ainda não possui cadastro?</Text>
          <Botao
            titulo="Criar Nova Conta"
            variante="secundario"
            onPress={() => navegar('Registro')}
          />

          <Botao
            titulo="Sobre o Sistema"
            variante="outline"
            onPress={() => navegar('Sobre')}
            estilo={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>

      <Rodape />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  formulario: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  tituloSessao: {
    fontFamily: FONTE_SERIF,
    fontSize: 20,
    fontWeight: 'bold',
    color: CORES.texto,
    textAlign: 'center',
    marginBottom: 6,
  },
  descricaoSessao: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: CORES.textoSecundario,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 18,
  },
  textoAuxiliar: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: CORES.textoSecundario,
    textAlign: 'center',
    marginBottom: 6,
  },
  mensagemErro: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: CORES.perigo,
    borderWidth: 1,
    borderColor: CORES.perigo,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff5f5',
  },
});
