import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { escutarEstadoAutenticacao } from './services/authService';

import LoginScreen from './telas/LoginScreen';
import RegistroScreen from './telas/RegistroScreen';
import InicioScreen from './telas/InicioScreen';
import FormularioScreen from './telas/FormularioScreen';
import DetalhesScreen from './telas/DetalhesScreen';
import PerfilScreen from './telas/PerfilScreen';
import SobreScreen from './telas/SobreScreen';
import { Carregando } from './components/UI';
import { CORES } from './utils/constants';

type TelaNome =
  | 'Login'
  | 'Registro'
  | 'Inicio'
  | 'Formulario'
  | 'Detalhes'
  | 'Perfil'
  | 'Sobre';

interface RotaHistorico {
  tela: TelaNome;
  params?: any;
}

export default function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<boolean | null>(null);
  const [historicoRotas, setHistoricoRotas] = useState<RotaHistorico[]>([
    { tela: 'Login' },
  ]);

  const rotaAtual = historicoRotas[historicoRotas.length - 1] || { tela: 'Login' };

  useEffect(() => {
    const cancelarInscricao = escutarEstadoAutenticacao(usuario => {
      const estaLogado = Boolean(usuario);
      setUsuarioAutenticado(estaLogado);

      setHistoricoRotas(atual => {
        if (estaLogado) {
          // Se acabou de logar e estava em Login ou Registro, vai para Inicio
          const telaAtual = atual[atual.length - 1]?.tela;
          if (telaAtual === 'Login' || telaAtual === 'Registro') {
            return [{ tela: 'Inicio' }];
          }
          return atual;
        } else {
          // Se deslogou, vai para tela de Login
          return [{ tela: 'Login' }];
        }
      });
    });

    return () => cancelarInscricao();
  }, []);

  function navegar(nomeTela: string, params?: any) {
    const telaDestino = nomeTela as TelaNome;
    setHistoricoRotas(prev => [...prev, { tela: telaDestino, params }]);
  }

  function voltar() {
    setHistoricoRotas(prev => {
      if (prev.length > 1) {
        return prev.slice(0, prev.length - 1);
      }
      return prev;
    });
  }

  const navigationProp = {
    navigate: (tela: string, params?: any) => navegar(tela, params),
    goBack: () => voltar(),
    replace: (tela: string, params?: any) => {
      setHistoricoRotas([{ tela: tela as TelaNome, params }]);
    },
  };

  if (usuarioAutenticado === null) {
    return (
      <SafeAreaView style={estilos.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={estilos.carregandoContainer}>
          <Carregando mensagem="Iniciando armário de rochas e minerais..." />
        </View>
      </SafeAreaView>
    );
  }

  const TELAS_PRIVADAS: TelaNome[] = ['Inicio', 'Formulario', 'Detalhes', 'Perfil', 'Sobre'];

  function renderizarTela() {
    const { tela, params } = rotaAtual;

    // Guard: se a tela é privada e o usuário não está autenticado, redireciona para Login
    if (!usuarioAutenticado && TELAS_PRIVADAS.includes(tela)) {
      return <LoginScreen navigation={navigationProp} onNavigate={navegar} route={{ params: undefined }} params={undefined} />;
    }

    const props = {
      navigation: navigationProp,
      onNavigate: navegar,
      route: { params },
      params,
    };

    switch (tela) {
      case 'Login':
        return <LoginScreen {...props} />;
      case 'Registro':
        return <RegistroScreen {...props} />;
      case 'Inicio':
        return <InicioScreen {...props} />;
      case 'Formulario':
        return <FormularioScreen {...props} />;
      case 'Detalhes':
        return <DetalhesScreen {...props} />;
      case 'Perfil':
        return <PerfilScreen {...props} />;
      case 'Sobre':
        return <SobreScreen {...props} />;
      default:
        return <InicioScreen {...props} />;
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      {renderizarTela()}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  carregandoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
