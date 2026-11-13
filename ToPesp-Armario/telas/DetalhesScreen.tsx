import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Cabecalho, Rodape, Botao, Carregando, Separador } from '../components/UI';
import { buscarAmostra, removerAmostra } from '../services/amostraService';
import { Amostra } from '../types';
import { CORES, FONTE_SERIF, ESCALA_MOHS } from '../utils/constants';

interface DetalhesScreenProps {
  route?: { params?: { id: string } };
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
  params?: { id: string };
}

export default function DetalhesScreen({
  route,
  navigation,
  onNavigate,
  params: directParams,
}: DetalhesScreenProps) {
  const idAmostra = route?.params?.id || directParams?.id;

  const [amostra, setAmostra] = useState<Amostra | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);

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

  async function carregar() {
    if (!idAmostra) {
      Alert.alert('Erro', 'Identificador de amostra não fornecido.');
      voltar();
      return;
    }

    try {
      setCarregando(true);
      const dados = await buscarAmostra(idAmostra);
      setAmostra(dados);
    } catch (err: any) {
      const isAuthError =
        err.message?.includes('login') || err.message?.includes('autenticação');
      if (isAuthError) {
        navegar('Login');
      } else {
        Alert.alert('Erro ao consultar', err.message || 'Amostra não encontrada.');
        voltar();
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [idAmostra]);

  async function handleExcluir() {
    if (!amostra) return;

    const tipoAmostra = amostra.categoria === 'rocha' ? 'esta rocha' : 'este mineral';

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente remover ${tipoAmostra} ("${amostra.nome}") do seu armário? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir Definitivamente',
          style: 'destructive',
          onPress: async () => {
            try {
              setExcluindo(true);
              await removerAmostra(amostra.id);
              Alert.alert('Sucesso', 'Amostra removida do armário.');
              navegar('Inicio');
            } catch (err: any) {
              Alert.alert('Erro ao excluir', err.message || 'Falha ao remover amostra.');
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
  }

  const mohsInfo =
    amostra?.dureza !== undefined && amostra?.dureza !== null
      ? ESCALA_MOHS.find(m => m.valor === Math.round(amostra.dureza!))
      : null;

  return (
    <View style={estilos.tela}>
      <Cabecalho
        titulo="Detalhes da Amostra"
        subtitulo={amostra ? `Ficha Textual • ${amostra.nome}` : undefined}
        aoVoltar={voltar}
      />

      {carregando || !amostra ? (
        <Carregando mensagem="Buscando detalhes no armário..." />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.ficha}>
            {/* Cabeçalho da Ficha */}
            <View style={estilos.fichaHeader}>
              <Text style={estilos.fichaCategoria}>
                {amostra.categoria === 'rocha' ? '[ CATEGORIA: ROCHA ]' : '[ CATEGORIA: MINERAL ]'}
              </Text>
              <Text style={estilos.fichaNome}>{amostra.nome}</Text>
            </View>

            <Separador />

            {/* Atributos Geológicos Principais */}
            <View style={estilos.secaoAtributos}>
              <View style={estilos.linhaAtributo}>
                <Text style={estilos.rotuloAtributo}>Tipo Geológico:</Text>
                <Text style={estilos.valorAtributo}>{amostra.tipo}</Text>
              </View>

              <View style={estilos.linhaAtributo}>
                <Text style={estilos.rotuloAtributo}>Dureza (Mohs):</Text>
                <Text style={estilos.valorAtributo}>
                  {amostra.dureza !== undefined && amostra.dureza !== null
                    ? `${amostra.dureza} Mohs ${mohsInfo ? `(Equivalente: ${mohsInfo.mineral})` : ''}`
                    : 'Não informada'}
                </Text>
              </View>

              <View style={estilos.linhaAtributo}>
                <Text style={estilos.rotuloAtributo}>Localização no Armário:</Text>
                <Text style={estilos.valorAtributo}>
                  {amostra.localizacao || 'Não especificada'}
                </Text>
              </View>

              <View style={estilos.linhaAtributo}>
                <Text style={estilos.rotuloAtributo}>Data de Aquisição:</Text>
                <Text style={estilos.valorAtributo}>
                  {amostra.dataAquisicao || 'Não informada'}
                </Text>
              </View>

              <View style={estilos.linhaAtributo}>
                <Text style={estilos.rotuloAtributo}>Identificador (ID):</Text>
                <Text style={estilos.valorAtributoId}>{amostra.id}</Text>
              </View>
            </View>

            <Separador />

            {/* Descrição Textual Detalhada */}
            <Text style={estilos.rotuloSecao}>Descrição e Anotações Textuais:</Text>
            <View style={estilos.blocoDescricao}>
              {amostra.descricao && amostra.descricao.trim() !== '' ? (
                <Text style={estilos.textoDescricao}>{amostra.descricao}</Text>
              ) : (
                <Text style={estilos.textoSemDescricao}>
                  Nenhuma descrição textual foi fornecida para esta amostra. Toque em "Editar
                  Amostra" para registrar observações sobre a procedência, textura, hábito cristalino
                  ou outras características.
                </Text>
              )}
            </View>

            <Separador />

            {/* Ações */}
            <Botao
              titulo="Editar Amostra"
              onPress={() => navegar('Formulario', { id: amostra.id, amostra })}
            />

            <Botao
              titulo="Excluir do Armário"
              variante="perigo"
              onPress={handleExcluir}
              carregando={excluindo}
              estilo={{ marginTop: 8 }}
            />

            <Botao
              titulo="Voltar à Listagem"
              variante="secundario"
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
  ficha: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 18,
  },
  fichaHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  fichaCategoria: {
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    color: '#000000',
    marginBottom: 6,
  },
  fichaNome: {
    fontFamily: FONTE_SERIF,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  secaoAtributos: {
    marginVertical: 6,
  },
  linhaAtributo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rotuloAtributo: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  valorAtributo: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    color: '#000000',
    flex: 1.3,
    textAlign: 'right',
  },
  valorAtributoId: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    color: '#666666',
    flex: 1.3,
    textAlign: 'right',
  },
  rotuloSecao: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  blocoDescricao: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    minHeight: 80,
  },
  textoDescricao: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    color: '#111111',
    lineHeight: 22,
  },
  textoSemDescricao: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#777777',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
