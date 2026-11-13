import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { CORES, FONTE_SERIF } from '../utils/constants';
import { Amostra } from '../types';

/* ==========================================================================
   CABEÇALHO (Header) - Fundo preto, texto branco e tipografia serifada
   ========================================================================== */
interface CabecalhoProps {
  titulo: string;
  subtitulo?: string;
  aoVoltar?: () => void;
  aoPerfil?: () => void;
  aoSobre?: () => void;
  aoSair?: () => void;
}

export function Cabecalho({
  titulo,
  subtitulo,
  aoVoltar,
  aoPerfil,
  aoSobre,
  aoSair,
}: CabecalhoProps) {
  return (
    <View style={estilos.cabecalhoContainer}>
      <View style={estilos.cabecalhoLinhaSuperior}>
        {aoVoltar ? (
          <TouchableOpacity
            style={estilos.cabecalhoBotaoTexto}
            onPress={aoVoltar}
            accessibilityRole="button"
          >
            <Text style={estilos.cabecalhoBotaoRotulo}>← Voltar</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}

        <View style={estilos.cabecalhoAcoesDireita}>
          {aoSobre && (
            <TouchableOpacity style={estilos.cabecalhoBotaoAcao} onPress={aoSobre}>
              <Text style={estilos.cabecalhoBotaoRotulo}>[Sobre]</Text>
            </TouchableOpacity>
          )}
          {aoPerfil && (
            <TouchableOpacity style={estilos.cabecalhoBotaoAcao} onPress={aoPerfil}>
              <Text style={estilos.cabecalhoBotaoRotulo}>[Perfil]</Text>
            </TouchableOpacity>
          )}
          {aoSair && (
            <TouchableOpacity style={estilos.cabecalhoBotaoAcao} onPress={aoSair}>
              <Text style={estilos.cabecalhoBotaoRotulo}>[Sair]</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={estilos.cabecalhoTitulo}>{titulo}</Text>
      {subtitulo ? <Text style={estilos.cabecalhoSubtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

/* ==========================================================================
   RODAPÉ (Footer) - Fundo preto e texto branco
   ========================================================================== */
interface RodapeProps {
  texto?: string;
}

export function Rodape({
  texto = 'ToPesp - Armário de Rochas & Minerais • Sistema Textual',
}: RodapeProps) {
  return (
    <View style={estilos.rodapeContainer}>
      <Text style={estilos.rodapeTexto}>{texto}</Text>
    </View>
  );
}

/* ==========================================================================
   BOTÃO - Estilizações em preto, branco e serif
   ========================================================================== */
interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo' | 'outline';
  desabilitado?: boolean;
  carregando?: boolean;
  estilo?: ViewStyle;
  estiloTexto?: TextStyle;
}

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  desabilitado = false,
  carregando = false,
  estilo,
  estiloTexto,
}: BotaoProps) {
  let estiloBotao = estilos.botaoPrimario;
  let estiloDoTexto = estilos.botaoTextoPrimario;

  if (variante === 'secundario') {
    estiloBotao = estilos.botaoSecundario;
    estiloDoTexto = estilos.botaoTextoSecundario;
  } else if (variante === 'perigo') {
    estiloBotao = estilos.botaoPerigo;
    estiloDoTexto = estilos.botaoTextoPerigo;
  } else if (variante === 'outline') {
    estiloBotao = estilos.botaoOutline;
    estiloDoTexto = estilos.botaoTextoOutline;
  }

  return (
    <TouchableOpacity
      style={[estilos.botaoBase, estiloBotao, desabilitado && estilos.botaoDesabilitado, estilo]}
      onPress={onPress}
      disabled={desabilitado || carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator
          size="small"
          color={variante === 'primario' || variante === 'perigo' ? '#ffffff' : '#000000'}
        />
      ) : (
        <Text style={[estiloDoTexto, estiloTexto]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

/* ==========================================================================
   CAMPO DE TEXTO (Input) - Borda sóbria, fonte Times New Roman
   ========================================================================== */
interface CampoTextoProps {
  rotulo: string;
  valor: string;
  aoMudarTexto: (texto: string) => void;
  placeholder?: string;
  seguro?: boolean;
  multiline?: boolean;
  tipoTeclado?: KeyboardTypeOptions;
  obrigatorio?: boolean;
  dica?: string;
  estilo?: ViewStyle;
}

export function CampoTexto({
  rotulo,
  valor,
  aoMudarTexto,
  placeholder,
  seguro = false,
  multiline = false,
  tipoTeclado = 'default',
  obrigatorio = false,
  dica,
  estilo,
}: CampoTextoProps) {
  return (
    <View style={[estilos.campoContainer, estilo]}>
      <Text style={estilos.campoRotulo}>
        {rotulo} {obrigatorio && <Text style={estilos.campoObrigatorio}>*</Text>}
      </Text>
      <TextInput
        style={[estilos.campoEntrada, multiline && estilos.campoMultiline]}
        value={valor}
        onChangeText={aoMudarTexto}
        placeholder={placeholder}
        placeholderTextColor="#888888"
        secureTextEntry={seguro}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={tipoTeclado}
        autoCapitalize={seguro ? 'none' : 'sentences'}
      />
      {dica ? <Text style={estilos.campoDica}>{dica}</Text> : null}
    </View>
  );
}

/* ==========================================================================
   SELETOR DE OPÇÕES (Pills / Abas em formato texto puro)
   ========================================================================== */
interface SeletorOpcoesProps {
  rotulo?: string;
  opcoes: { rotulo: string; valor: string }[];
  selecionado: string;
  aoSelecionar: (valor: string) => void;
  estilo?: ViewStyle;
}

export function SeletorOpcoes({
  rotulo,
  opcoes,
  selecionado,
  aoSelecionar,
  estilo,
}: SeletorOpcoesProps) {
  return (
    <View style={[estilos.seletorContainer, estilo]}>
      {rotulo ? <Text style={estilos.campoRotulo}>{rotulo}</Text> : null}
      <View style={estilos.seletorLinha}>
        {opcoes.map(opcao => {
          const ativo = selecionado === opcao.valor;
          return (
            <TouchableOpacity
              key={opcao.valor}
              style={[estilos.seletorItem, ativo && estilos.seletorItemAtivo]}
              onPress={() => aoSelecionar(opcao.valor)}
            >
              <Text style={[estilos.seletorItemTexto, ativo && estilos.seletorItemTextoAtivo]}>
                {opcao.rotulo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ==========================================================================
   CARD DE AMOSTRA - Visualização 100% textual da rocha ou mineral
   ========================================================================== */
interface CardAmostraProps {
  amostra: Amostra;
  aoPressionar: () => void;
}

export function CardAmostra({ amostra, aoPressionar }: CardAmostraProps) {
  const isRocha = amostra.categoria === 'rocha';

  return (
    <TouchableOpacity
      style={estilos.cardContainer}
      onPress={aoPressionar}
      activeOpacity={0.7}
    >
      <View style={estilos.cardLinhaSuperior}>
        <Text style={estilos.cardTag}>
          {isRocha ? '[ ROCHA ]' : '[ MINERAL ]'}
        </Text>
        {amostra.dureza !== undefined && amostra.dureza !== null && (
          <Text style={estilos.cardDureza}>
            Dureza: {amostra.dureza} Mohs
          </Text>
        )}
      </View>

      <Text style={estilos.cardNome}>{amostra.nome}</Text>

      <Text style={estilos.cardTipo}>
        Tipo: <Text style={estilos.cardTextoNegrito}>{amostra.tipo}</Text>
      </Text>

      {amostra.localizacao ? (
        <Text style={estilos.cardMeta}>
          Localização: {amostra.localizacao}
        </Text>
      ) : null}

      {amostra.descricao ? (
        <Text style={estilos.cardDescricao} numberOfLines={2}>
          {amostra.descricao}
        </Text>
      ) : null}

      <View style={estilos.cardRodapeAcao}>
        <Text style={estilos.cardLinkVer}>Ver detalhes completos →</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================================================
   COMPONENTES AUXILIARES: Carregando, Mensagem Vazia e Divisor
   ========================================================================== */
export function Carregando({ mensagem = 'Carregando acervo...' }: { mensagem?: string }) {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator size="large" color="#000000" />
      <Text style={estilos.carregandoTexto}>{mensagem}</Text>
    </View>
  );
}

export function MensagemVazia({
  titulo = 'Nenhuma amostra encontrada',
  subtitulo = 'Adicione novas rochas ou minerais ao seu armário.',
}: {
  titulo?: string;
  subtitulo?: string;
}) {
  return (
    <View style={estilos.vazioContainer}>
      <Text style={estilos.vazioTitulo}>{titulo}</Text>
      <Text style={estilos.vazioSubtitulo}>{subtitulo}</Text>
    </View>
  );
}

export function Separador() {
  return <View style={estilos.separador} />;
}

/* ==========================================================================
   ESTILOS
   ========================================================================== */
const estilos = StyleSheet.create({
  // Cabeçalho
  cabecalhoContainer: {
    backgroundColor: CORES.headerFundo,
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: CORES.headerFundo,
  },
  cabecalhoLinhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cabecalhoBotaoTexto: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cabecalhoBotaoRotulo: {
    color: CORES.headerTexto,
    fontFamily: FONTE_SERIF,
    fontSize: 14,
  },
  cabecalhoAcoesDireita: {
    flexDirection: 'row',
    gap: 8,
  },
  cabecalhoBotaoAcao: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cabecalhoTitulo: {
    color: CORES.headerTexto,
    fontFamily: FONTE_SERIF,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cabecalhoSubtitulo: {
    color: '#cccccc',
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Rodapé
  rodapeContainer: {
    backgroundColor: CORES.footerFundo,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  rodapeTexto: {
    color: CORES.footerTexto,
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    textAlign: 'center',
  },

  // Botões
  botaoBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  botaoPrimario: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
  },
  botaoTextoPrimario: {
    color: '#ffffff',
    fontFamily: FONTE_SERIF,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  botaoSecundario: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  botaoTextoSecundario: {
    color: '#000000',
    fontFamily: FONTE_SERIF,
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoPerigo: {
    backgroundColor: CORES.perigo,
    borderWidth: 1,
    borderColor: CORES.perigo,
  },
  botaoTextoPerigo: {
    color: '#ffffff',
    fontFamily: FONTE_SERIF,
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555555',
  },
  botaoTextoOutline: {
    color: '#333333',
    fontFamily: FONTE_SERIF,
    fontSize: 14,
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },

  // Campo de Texto
  campoContainer: {
    marginVertical: 8,
    width: '100%',
  },
  campoRotulo: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    fontWeight: 'bold',
    color: CORES.texto,
    marginBottom: 4,
  },
  campoObrigatorio: {
    color: CORES.perigo,
  },
  campoEntrada: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: FONTE_SERIF,
    fontSize: 15,
    color: CORES.texto,
    borderRadius: 2,
  },
  campoMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  campoDica: {
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    color: CORES.textoMutado,
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Seletor
  seletorContainer: {
    marginVertical: 8,
  },
  seletorLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  seletorItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  seletorItemAtivo: {
    backgroundColor: '#000000',
  },
  seletorItemTexto: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#000000',
  },
  seletorItemTextoAtivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Card Amostra
  cardContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardLinhaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTag: {
    fontFamily: FONTE_SERIF,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#000000',
  },
  cardDureza: {
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#444444',
  },
  cardNome: {
    fontFamily: FONTE_SERIF,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  cardTipo: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#333333',
    marginBottom: 2,
  },
  cardTextoNegrito: {
    fontWeight: 'bold',
  },
  cardMeta: {
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  cardDescricao: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#444444',
    marginTop: 6,
    lineHeight: 18,
  },
  cardRodapeAcao: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    alignItems: 'flex-end',
  },
  cardLinkVer: {
    fontFamily: FONTE_SERIF,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },

  // Utilitários
  centro: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carregandoTexto: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    color: '#333333',
    marginTop: 10,
  },
  vazioContainer: {
    padding: 32,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'dashed',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  vazioTitulo: {
    fontFamily: FONTE_SERIF,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  vazioSubtitulo: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  separador: {
    height: 1,
    backgroundColor: '#000000',
    marginVertical: 14,
  },
});
