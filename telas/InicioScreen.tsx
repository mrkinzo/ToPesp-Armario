import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Cabecalho,
  Rodape,
  CardAmostra,
  Carregando,
  MensagemVazia,
  SeletorOpcoes,
  Botao,
} from '../components/UI';
import { listarAmostras } from '../services/amostraService';
import { sair } from '../services/authService';
import { Amostra, Categoria } from '../types';
import { CORES, FONTE_SERIF, TIPOS_ROCHA, TIPOS_MINERAL } from '../utils/constants';
import { confirmarAcao, exibirAlerta } from '../utils/alerta';

interface InicioScreenProps {
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
}

export default function InicioScreen({ navigation, onNavigate }: InicioScreenProps) {
  const [amostras, setAmostras] = useState<Amostra[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // Filtros
  const [categoriaAtiva, setCategoriaAtiva] = useState<'todas' | Categoria>('todas');
  const [tipoAtivo, setTipoAtivo] = useState<string>('Todos');
  const [busca, setBusca] = useState('');

  function navegar(tela: string, params?: any) {
    if (navigation?.navigate) {
      navigation.navigate(tela, params);
    } else if (onNavigate) {
      onNavigate(tela, params);
    }
  }

  const carregarDados = useCallback(async () => {
    try {
      const catFiltro = categoriaAtiva === 'todas' ? undefined : categoriaAtiva;
      const dados = await listarAmostras(catFiltro, tipoAtivo, busca);
      setAmostras(dados);
    } catch (err: any) {
      const isAuthError =
        err.message?.includes('login') || err.message?.includes('autenticação');
      if (isAuthError) {
        // Sessão expirada ou não autenticado — redireciona silenciosamente para Login
        navegar('Login');
      } else {
        Alert.alert('Erro ao carregar acervo', err.message || 'Falha ao buscar amostras.');
      }
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [categoriaAtiva, tipoAtivo, busca]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Listener para recarregar quando voltar para esta tela no React Navigation
  useEffect(() => {
    if (navigation?.addListener) {
      const unsubscribe = navigation.addListener('focus', () => {
        carregarDados();
      });
      return unsubscribe;
    }
  }, [navigation, carregarDados]);

  async function handleSair() {
    confirmarAcao(
      'Sair da Conta',
      'Deseja realmente encerrar sua sessão?',
      async () => {
        try {
          await sair();
          navegar('Login');
        } catch {
          exibirAlerta('Erro', 'Não foi possível desconectar.');
        }
      },
      undefined,
      'Sair'
    );
  }

  // Estatísticas calculadas sobre a listagem
  const totalRochas = amostras.filter(a => a.categoria === 'rocha').length;
  const totalMinerais = amostras.filter(a => a.categoria === 'mineral').length;

  // Lista de tipos dinâmica conforme categoria selecionada
  const tiposDisponiveis = [
    { rotulo: 'Todos os tipos', valor: 'Todos' },
    ...(categoriaAtiva === 'rocha'
      ? TIPOS_ROCHA.map(t => ({ rotulo: t, valor: t }))
      : categoriaAtiva === 'mineral'
      ? TIPOS_MINERAL.map(t => ({ rotulo: t, valor: t }))
      : []),
  ];

  return (
    <View style={estilos.tela}>
      <Cabecalho
        titulo="ToPesp - Armário"
        subtitulo="Acervo Pessoal de Rochas e Minerais"
        aoPerfil={() => navegar('Perfil')}
        aoSobre={() => navegar('Sobre')}
        aoSair={handleSair}
      />

      <View style={estilos.container}>
        {/* Painel de Estatísticas Resumidas */}
        <View style={estilos.painelEstatisticas}>
          <View style={estilos.colunaEstatistica}>
            <Text style={estilos.numeroEstatistica}>{amostras.length}</Text>
            <Text style={estilos.rotuloEstatistica}>Amostras listadas</Text>
          </View>
          <View style={estilos.divisorVertical} />
          <View style={estilos.colunaEstatistica}>
            <Text style={estilos.numeroEstatistica}>{totalRochas}</Text>
            <Text style={estilos.rotuloEstatistica}>Rochas</Text>
          </View>
          <View style={estilos.divisorVertical} />
          <View style={estilos.colunaEstatistica}>
            <Text style={estilos.numeroEstatistica}>{totalMinerais}</Text>
            <Text style={estilos.rotuloEstatistica}>Minerais</Text>
          </View>
        </View>

        {/* Botão de Adicionar Amostra */}
        <Botao
          titulo="+ Cadastrar Nova Amostra"
          onPress={() => navegar('Formulario')}
          estilo={{ marginHorizontal: 16, marginTop: 12, marginBottom: 8 }}
        />

        {/* Campo de Pesquisa Textual */}
        <View style={estilos.buscaContainer}>
          <TextInput
            style={estilos.buscaInput}
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por nome, tipo ou localização..."
            placeholderTextColor="#888888"
          />
          {busca !== '' && (
            <TouchableOpacity onPress={() => setBusca('')} style={estilos.limparBusca}>
              <Text style={estilos.limparBuscaTexto}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filtro por Categoria */}
        <View style={estilos.filtrosArea}>
          <SeletorOpcoes
            opcoes={[
              { rotulo: 'Todas', valor: 'todas' },
              { rotulo: 'Rochas', valor: 'rocha' },
              { rotulo: 'Minerais', valor: 'mineral' },
            ]}
            selecionado={categoriaAtiva}
            aoSelecionar={(val: any) => {
              setCategoriaAtiva(val);
              setTipoAtivo('Todos');
            }}
          />

          {/* Filtro por Tipo específico quando selecionado Rocha ou Mineral (RF-06 e RF-07) */}
          {categoriaAtiva !== 'todas' && tiposDisponiveis.length > 1 && (
            <SeletorOpcoes
              rotulo={`Filtrar tipo de ${categoriaAtiva}:`}
              opcoes={tiposDisponiveis}
              selecionado={tipoAtivo}
              aoSelecionar={setTipoAtivo}
            />
          )}
        </View>

        {/* Lista de Amostras */}
        {carregando ? (
          <Carregando mensagem="Consultando catálogo do armário..." />
        ) : (
          <FlatList
            data={amostras}
            keyExtractor={item => item.id}
            contentContainerStyle={estilos.listaConteudo}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={() => {
                  setAtualizando(true);
                  carregarDados();
                }}
                tintColor="#000000"
              />
            }
            renderItem={({ item }) => (
              <CardAmostra
                amostra={item}
                aoPressionar={() => navegar('Detalhes', { id: item.id })}
              />
            )}
            ListEmptyComponent={
              <MensagemVazia
                titulo="Nenhuma amostra no armário"
                subtitulo={
                  busca || tipoAtivo !== 'Todos' || categoriaAtiva !== 'todas'
                    ? 'Nenhum resultado corresponde aos filtros aplicados.'
                    : 'Toque no botão "+ Cadastrar Nova Amostra" para registrar sua primeira rocha ou mineral.'
                }
              />
            }
          />
        )}
      </View>

      <Rodape />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  container: {
    flex: 1,
  },
  painelEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  colunaEstatistica: {
    alignItems: 'center',
  },
  numeroEstatistica: {
    fontFamily: FONTE_SERIF,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  rotuloEstatistica: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    color: '#555555',
    marginTop: 2,
  },
  divisorVertical: {
    width: 1,
    height: 28,
    backgroundColor: '#cccccc',
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
  },
  buscaInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    color: '#000000',
  },
  limparBusca: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  limparBuscaTexto: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    color: '#666666',
  },
  filtrosArea: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  listaConteudo: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
