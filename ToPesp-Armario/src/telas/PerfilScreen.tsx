import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Cabecalho, Rodape, Botao, Carregando, Separador } from '../components/UI';
import { obterUsuarioAtual, buscarDadosUsuario, sair } from '../services/authService';
import { obterEstatisticas } from '../services/amostraService';
import { Usuario } from '../types';
import { CORES, FONTE_SERIF } from '../utils/constants';

interface PerfilScreenProps {
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
}

export default function PerfilScreen({ navigation, onNavigate }: PerfilScreenProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [estatisticas, setEstatisticas] = useState<{
    total: number;
    rochas: number;
    minerais: number;
  }>({ total: 0, rochas: 0, minerais: 0 });
  const [carregando, setCarregando] = useState(true);

  function navegar(tela: string, params?: any) {
    if (navigation?.navigate) {
      navigation.navigate(tela, params);
    } else if (onNavigate) {
      onNavigate(tela, params);
    }
  }

  function voltar() {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (onNavigate) {
      onNavigate('Inicio');
    }
  }

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setCarregando(true);
        const atual = obterUsuarioAtual();
        if (atual) {
          const dadosDoc = await buscarDadosUsuario(atual.uid);
          setUsuario(
            dadosDoc || {
              id: atual.uid,
              nome: atual.displayName || 'Colecionador',
              email: atual.email || '',
            }
          );
        }
        const stats = await obterEstatisticas();
        setEstatisticas(stats);
      } catch (err: any) {
        Alert.alert('Erro ao carregar perfil', err.message || 'Falha ao buscar dados.');
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, []);

  async function handleSair() {
    Alert.alert('Confirmar Saída', 'Deseja realmente desconectar de sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desconectar',
        style: 'destructive',
        onPress: async () => {
          try {
            await sair();
            navegar('Login');
          } catch {
            Alert.alert('Erro', 'Não foi possível desconectar.');
          }
        },
      },
    ]);
  }

  return (
    <View style={estilos.tela}>
      <Cabecalho
        titulo="Perfil do Usuário"
        subtitulo="Identificação e Métricas do Acervo"
        aoVoltar={voltar}
        aoSobre={() => navegar('Sobre')}
        aoSair={handleSair}
      />

      {carregando ? (
        <Carregando mensagem="Carregando informações do colecionador..." />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.bloco}>
            <Text style={estilos.tituloSecao}>Dados Pessoais</Text>

            <View style={estilos.linhaInfo}>
              <Text style={estilos.rotuloInfo}>Nome do Colecionador:</Text>
              <Text style={estilos.valorInfo}>{usuario?.nome || 'Não informado'}</Text>
            </View>

            <View style={estilos.linhaInfo}>
              <Text style={estilos.rotuloInfo}>Email Cadastrado:</Text>
              <Text style={estilos.valorInfo}>{usuario?.email || 'Não informado'}</Text>
            </View>

            <View style={estilos.linhaInfo}>
              <Text style={estilos.rotuloInfo}>ID da Conta (UID):</Text>
              <Text style={estilos.valorInfoId}>{usuario?.id || '—'}</Text>
            </View>

            <Separador />

            <Text style={estilos.tituloSecao}>Resumo do seu Armário</Text>

            <View style={estilos.gradeEstatisticas}>
              <View style={estilos.cartaoMetrica}>
                <Text style={estilos.numeroMetrica}>{estatisticas.total}</Text>
                <Text style={estilos.rotuloMetrica}>Total de Peças</Text>
              </View>

              <View style={estilos.cartaoMetrica}>
                <Text style={estilos.numeroMetrica}>{estatisticas.rochas}</Text>
                <Text style={estilos.rotuloMetrica}>Rochas Catalogadas</Text>
              </View>

              <View style={estilos.cartaoMetrica}>
                <Text style={estilos.numeroMetrica}>{estatisticas.minerais}</Text>
                <Text style={estilos.rotuloMetrica}>Minerais Catalogados</Text>
              </View>
            </View>

            <Separador />

            <Botao
              titulo="Conhecer Mais Sobre o Sistema"
              variante="secundario"
              onPress={() => navegar('Sobre')}
            />

            <Botao
              titulo="Encerrar Sessão (Sair)"
              variante="perigo"
              onPress={handleSair}
              estilo={{ marginTop: 8 }}
            />

            <Botao
              titulo="Voltar ao Armário"
              variante="outline"
              onPress={voltar}
              estilo={{ marginTop: 8 }}
            />
          </View>
        </ScrollView>
      )}

      <Rodape />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 32,
  },
  bloco: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 18,
  },
  tituloSecao: {
    fontFamily: FONTE_SERIF,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  linhaInfo: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  rotuloInfo: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555555',
  },
  valorInfo: {
    fontFamily: FONTE_SERIF,
    fontSize: 15,
    color: '#000000',
    marginTop: 2,
  },
  valorInfoId: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  gradeEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 10,
  },
  cartaoMetrica: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#fafafa',
    padding: 12,
    alignItems: 'center',
  },
  numeroMetrica: {
    fontFamily: FONTE_SERIF,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  rotuloMetrica: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    color: '#555555',
    textAlign: 'center',
    marginTop: 4,
  },
});
