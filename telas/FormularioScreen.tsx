import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Cabecalho,
  Rodape,
  CampoTexto,
  Botao,
  SeletorOpcoes,
  Carregando,
  Separador,
} from '../components/UI';
import { criarAmostra, atualizarAmostra, buscarAmostra } from '../services/amostraService';
import { Amostra, Categoria } from '../types';
import {
  CORES,
  FONTE_SERIF,
  CATEGORIAS,
  TIPOS_ROCHA,
  TIPOS_MINERAL,
  ESCALA_MOHS,
} from '../utils/constants';

interface FormularioScreenProps {
  route?: { params?: { id?: string; amostra?: Amostra; categoriaInicial?: Categoria } };
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
  params?: { id?: string; amostra?: Amostra; categoriaInicial?: Categoria };
}

export default function FormularioScreen({
  route,
  navigation,
  onNavigate,
  params: directParams,
}: FormularioScreenProps) {
  const parametros = route?.params || directParams || {};
  const idEdicao = parametros.id;

  const [categoria, setCategoria] = useState<Categoria>(
    parametros.categoriaInicial || 'rocha'
  );
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [dureza, setDureza] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [dataAquisicao, setDataAquisicao] = useState('');
  const [descricao, setDescricao] = useState('');

  const [carregandoInicial, setCarregandoInicial] = useState(Boolean(idEdicao));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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
    async function carregarAmostraParaEdicao() {
      if (!idEdicao) return;
      try {
        setCarregandoInicial(true);
        const amostra = parametros.amostra || (await buscarAmostra(idEdicao));
        setNome(amostra.nome || '');
        setCategoria(amostra.categoria || 'rocha');
        setTipo(amostra.tipo || '');
        setDureza(
          amostra.dureza !== undefined && amostra.dureza !== null ? String(amostra.dureza) : ''
        );
        setLocalizacao(amostra.localizacao || '');
        setDataAquisicao(amostra.dataAquisicao || '');
        setDescricao(amostra.descricao || '');
      } catch (err: any) {
        Alert.alert('Erro ao carregar', err.message || 'Não foi possível carregar a amostra.');
        voltar();
      } finally {
        setCarregandoInicial(false);
      }
    }

    carregarAmostraParaEdicao();
  }, [idEdicao]);

  async function handleSalvar() {
    setErro(null);

    if (!nome.trim()) {
      const msg = 'O nome da amostra é obrigatório.';
      setErro(msg);
      Alert.alert('Validação', msg);
      return;
    }

    if (!tipo.trim()) {
      const msg = 'O tipo da amostra é obrigatório.';
      setErro(msg);
      Alert.alert('Validação', msg);
      return;
    }

    let durezaNum: number | null = null;
    if (dureza.trim() !== '') {
      const valorConvertido = parseFloat(dureza.replace(',', '.'));
      if (isNaN(valorConvertido) || valorConvertido < 1 || valorConvertido > 10) {
        const msg = 'A dureza na escala de Mohs deve ser um número entre 1 e 10.';
        setErro(msg);
        Alert.alert('Dureza Inválida', msg);
        return;
      }
      durezaNum = valorConvertido;
    }

    const payload = {
      nome: nome.trim(),
      categoria,
      tipo: tipo.trim(),
      dureza: durezaNum,
      localizacao: localizacao.trim(),
      dataAquisicao: dataAquisicao.trim(),
      descricao: descricao.trim(),
    };

    try {
      setSalvando(true);
      if (idEdicao) {
        await atualizarAmostra(idEdicao, payload);
        Alert.alert('Atualizado', 'Amostra atualizada com sucesso!');
        navegar('Detalhes', { id: idEdicao });
      } else {
        const novoId = await criarAmostra(payload);
        Alert.alert('Cadastrado', 'Amostra inserida no armário com sucesso!');
        navegar('Detalhes', { id: novoId });
      }
    } catch (err: any) {
      setErro(err.message || 'Falha ao salvar amostra.');
      Alert.alert('Erro', err.message || 'Falha ao salvar amostra.');
    } finally {
      setSalvando(false);
    }
  }

  const tiposSugeridos = categoria === 'rocha' ? TIPOS_ROCHA : TIPOS_MINERAL;

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Cabecalho
        titulo={idEdicao ? 'Editar Amostra' : 'Nova Amostra'}
        subtitulo={idEdicao ? 'Atualize as informações' : 'Cadastro no armário'}
        aoVoltar={voltar}
      />

      {carregandoInicial ? (
        <Carregando mensagem="Carregando dados da amostra..." />
      ) : (
        <ScrollView contentContainerStyle={estilos.conteudo}>
          <View style={estilos.formulario}>
            {erro ? <Text style={estilos.mensagemErro}>[Aviso] {erro}</Text> : null}

            {/* Seleção de Categoria: Rocha ou Mineral */}
            <Text style={estilos.campoRotulo}>Categoria da Amostra *</Text>
            <SeletorOpcoes
              opcoes={CATEGORIAS.map(c => ({ rotulo: c.label, valor: c.value }))}
              selecionado={categoria}
              aoSelecionar={(val: any) => {
                setCategoria(val);
                setTipo('');
              }}
            />

            <CampoTexto
              rotulo="Nome da Amostra"
              valor={nome}
              aoMudarTexto={setNome}
              placeholder={categoria === 'rocha' ? 'Ex.: Granito, Basalto, Mármore' : 'Ex.: Quartzo, Pirita, Ametista'}
              obrigatorio
            />

            {/* Sugestões de Tipos Geológicos */}
            <Text style={estilos.campoRotulo}>Tipo Geológico *</Text>
            <View style={estilos.chipsContainer}>
              {tiposSugeridos.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[estilos.chip, tipo === item && estilos.chipAtivo]}
                  onPress={() => setTipo(item)}
                >
                  <Text style={[estilos.chipTexto, tipo === item && estilos.chipTextoAtivo]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <CampoTexto
              rotulo="Tipo Específico ou Personalizado"
              valor={tipo}
              aoMudarTexto={setTipo}
              placeholder="Digite ou selecione acima"
              dica={
                categoria === 'rocha'
                  ? 'Exemplos: Ígnea Extrusiva, Metamórfica Foliada, etc.'
                  : 'Exemplos: Silicato, Sulfeto, Óxido, Carbonato, etc.'
              }
              obrigatorio
            />

            <CampoTexto
              rotulo="Dureza (Escala de Mohs: 1 a 10)"
              valor={dureza}
              aoMudarTexto={setDureza}
              placeholder="Ex.: 7 ou 2.5"
              tipoTeclado="numeric"
              dica="Referência: 1 (Talco) a 10 (Diamante)"
            />

            {/* Guia Rápido de Dureza */}
            <View style={estilos.tabelaMohs}>
              <Text style={estilos.tabelaMohsTitulo}>Referência da Escala de Mohs:</Text>
              <Text style={estilos.tabelaMohsItem}>
                {ESCALA_MOHS.map(m => `${m.valor}=${m.mineral}`).join(' • ')}
              </Text>
            </View>

            <CampoTexto
              rotulo="Localização Física no Armário"
              valor={localizacao}
              aoMudarTexto={setLocalizacao}
              placeholder="Ex.: Prateleira 1, Gaveta B, Caixa 3"
              dica="Facilita encontrar a peça física no seu acervo"
            />

            <CampoTexto
              rotulo="Data de Coleta / Aquisição"
              valor={dataAquisicao}
              aoMudarTexto={setDataAquisicao}
              placeholder="Ex.: 15/03/2024 ou Março de 2024"
            />

            <CampoTexto
              rotulo="Descrição Textual e Observações"
              valor={descricao}
              aoMudarTexto={setDescricao}
              placeholder="Descreva detalhes como textura, cor, clivagem, procedência, história ou características da amostra..."
              multiline
              dica="Este sistema não utiliza fotos; capriche na descrição textual."
            />

            <Separador />

            <Botao
              titulo={idEdicao ? 'Salvar Alterações' : 'Salvar no Armário'}
              onPress={handleSalvar}
              carregando={salvando}
            />

            <Botao
              titulo="Cancelar"
              variante="secundario"
              onPress={voltar}
            />
          </View>
        </ScrollView>
      )}

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
    padding: 16,
    paddingBottom: 32,
  },
  formulario: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 16,
  },
  campoRotulo: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  chipAtivo: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  chipTexto: {
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    color: '#000000',
  },
  chipTextoAtivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabelaMohs: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 8,
    marginBottom: 12,
  },
  tabelaMohsTitulo: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  tabelaMohsItem: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
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
