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
import { registrar } from '../services/authService';
import { CORES, FONTE_SERIF } from '../utils/constants';

interface RegistroScreenProps {
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
}

export default function RegistroScreen({ navigation, onNavigate }: RegistroScreenProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function navegar(tela: string, params?: any) {
    if (navigation?.navigate) {
      navigation.navigate(tela, params);
    } else if (onNavigate) {
      onNavigate(tela, params);
    }
  }

  async function handleCadastrar() {
    setErro(null);

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      const msg = 'Todos os campos são de preenchimento obrigatório.';
      setErro(msg);
      Alert.alert('Atenção', msg);
      return;
    }

    if (senha.length < 6) {
      const msg = 'A senha deve conter no mínimo 6 caracteres.';
      setErro(msg);
      Alert.alert('Senha Curta', msg);
      return;
    }

    if (senha !== confirmarSenha) {
      const msg = 'As senhas informadas não coincidem.';
      setErro(msg);
      Alert.alert('Incompatibilidade', msg);
      return;
    }

    try {
      setCarregando(true);
      await registrar(nome.trim(), email.trim(), senha);
      Alert.alert('Sucesso', 'Conta de colecionador criada com sucesso!');
      navegar('Inicio');
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Este email já está cadastrado em outra conta.'
          : err.message || 'Falha ao realizar cadastro. Tente novamente.';
      setErro(msg);
      Alert.alert('Erro de Cadastro', msg);
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
        titulo="Criar Conta"
        subtitulo="Novo Colecionador"
        aoVoltar={() => navegar('Login')}
      />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.formulario}>
          <Text style={estilos.tituloSessao}>Cadastro de Usuário</Text>
          <Text style={estilos.descricaoSessao}>
            Registre sua conta para iniciar a catalogação das suas amostras de rochas e minerais.
          </Text>

          {erro ? <Text style={estilos.mensagemErro}>[Aviso] {erro}</Text> : null}

          <CampoTexto
            rotulo="Nome Completo"
            valor={nome}
            aoMudarTexto={setNome}
            placeholder="Seu nome"
            obrigatorio
          />

          <CampoTexto
            rotulo="Email"
            valor={email}
            aoMudarTexto={setEmail}
            placeholder="seu.email@exemplo.com"
            tipoTeclado="email-address"
            obrigatorio
          />

          <CampoTexto
            rotulo="Senha"
            valor={senha}
            aoMudarTexto={setSenha}
            placeholder="Mínimo 6 caracteres"
            seguro
            obrigatorio
          />

          <CampoTexto
            rotulo="Confirmar Senha"
            valor={confirmarSenha}
            aoMudarTexto={setConfirmarSenha}
            placeholder="Repita sua senha"
            seguro
            obrigatorio
          />

          <Botao
            titulo="Concluir Cadastro"
            onPress={handleCadastrar}
            carregando={carregando}
            estilo={{ marginTop: 12 }}
          />

          <Separador />

          <Text style={estilos.textoAuxiliar}>Já possui uma conta registrada?</Text>
          <Botao
            titulo="Voltar para o Login"
            variante="secundario"
            onPress={() => navegar('Login')}
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
