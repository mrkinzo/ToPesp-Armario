import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Cabecalho, Rodape, Botao, Separador } from '../components/UI';
import { CORES, FONTE_SERIF } from '../utils/constants';

interface SobreScreenProps {
  navigation?: any;
  onNavigate?: (tela: string, params?: any) => void;
}

export default function SobreScreen({ navigation, onNavigate }: SobreScreenProps) {
  function voltar() {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (onNavigate) {
      onNavigate('Inicio');
    }
  }

  return (
    <View style={estilos.tela}>
      <Cabecalho
        titulo="Sobre o Sistema"
        subtitulo="Visão e Particularidades do ToPesp-Armário"
        aoVoltar={voltar}
      />

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.artigo}>
          <Text style={estilos.tituloPrincipal}>
            ToPesp - Armário de Rochas e Minerais
          </Text>
          <Text style={estilos.subtituloArtigo}>
            Sistema de administração pessoal de acervos geológicos
          </Text>

          <Separador />

          <Text style={estilos.secaoTitulo}>1. Propósito do Sistema</Text>
          <Text style={estilos.paragrafo}>
            Este aplicativo foi concebido para o gerenciamento de um armário físico onde se
            armazenam amostras de rochas e minerais em âmbito pessoal. O objetivo central é
            permitir que o colecionador tenha acesso pleno e organizado às suas peças, suas
            localizações e descrições detalhadas.
          </Text>

          <Text style={estilos.secaoTitulo}>2. A Proposta Textual (Sem Imagens)</Text>
          <Text style={estilos.paragrafo}>
            Diferentemente de catálogos visuais convencionais, o <Text style={estilos.negrito}>ToPesp-Armário não utiliza fotos ou imagens</Text>. O sistema é fundamentado inteiramente na riqueza da descrição textual e nos critérios organizacionais definidos pelo próprio usuário.
          </Text>
          <Text style={estilos.paragrafo}>
            Essa abordagem confere agilidade, foco no rigor mineralógico/petrológico e máxima
            liberdade para que acervos extensos e previamente classificados possam implementar
            sua própria gestão e nomeação sem sobrecarga visual.
          </Text>

          <Text style={estilos.secaoTitulo}>3. Identidade Visual e Interface</Text>
          <Text style={estilos.paragrafo}>
            Em conformidade com a especificação de interface do projeto:
          </Text>
          <View style={estilos.listaTopicos}>
            <Text style={estilos.topico}>
              • <Text style={estilos.negrito}>Cabeçalho e Rodapé:</Text> Fundo preto sólido com tipografia branca para delimitar as áreas de controle e status.
            </Text>
            <Text style={estilos.topico}>
              • <Text style={estilos.negrito}>Tipografia Clássica:</Text> Utilização estrita de fonte serifada (Times New Roman) em preto para todo o corpo de texto e fichas cadastrais.
            </Text>
            <Text style={estilos.topico}>
              • <Text style={estilos.negrito}>Soberania e Rigor:</Text> Cartões, formulários e listas com alto contraste e sem poluição gráfica.
            </Text>
          </View>

          <Text style={estilos.secaoTitulo}>4. Pilha Tecnológica</Text>
          <View style={estilos.listaTopicos}>
            <Text style={estilos.topico}>
              • <Text style={estilos.negrito}>Framework:</Text> React Native com TypeScript
            </Text>
            <Text style={estilos.topico}>
              • <Text style={estilos.negrito}>Autenticação:</Text> Firebase Authentication
            </Text>
            <Text style={estilos.topico}>
              • <Text style={estilos.negrito}>Banco de Dados:</Text> Cloud Firestore (Firebase)
            </Text>
          </View>

          <Separador />

          <Botao
            titulo="Voltar"
            variante="secundario"
            onPress={voltar}
          />
        </View>
      </ScrollView>

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
  artigo: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
    padding: 20,
  },
  tituloPrincipal: {
    fontFamily: FONTE_SERIF,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtituloArtigo: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#555555',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  secaoTitulo: {
    fontFamily: FONTE_SERIF,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 14,
    marginBottom: 6,
  },
  paragrafo: {
    fontFamily: FONTE_SERIF,
    fontSize: 14,
    color: '#222222',
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'justify',
  },
  negrito: {
    fontWeight: 'bold',
  },
  listaTopicos: {
    marginVertical: 6,
    paddingLeft: 6,
  },
  topico: {
    fontFamily: FONTE_SERIF,
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 4,
  },
});
