import { Alert, Platform } from 'react-native';

export function confirmarAcao(
  titulo: string,
  mensagem: string,
  aoConfirmar: () => void | Promise<void>,
  aoCancelar?: () => void,
  textoBotaoConfirmar = 'Confirmar'
) {
  if (Platform.OS === 'web') {
    const texto = titulo ? `${titulo}\n\n${mensagem}` : mensagem;
    const confirmou = typeof window !== 'undefined' ? window.confirm(texto) : true;
    if (confirmou) {
      aoConfirmar();
    } else if (aoCancelar) {
      aoCancelar();
    }
  } else {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: aoCancelar },
      { text: textoBotaoConfirmar, style: 'destructive', onPress: aoConfirmar },
    ]);
  }
}

export function exibirAlerta(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(titulo ? `${titulo}\n\n${mensagem}` : mensagem);
    }
  } else {
    Alert.alert(titulo, mensagem);
  }
}
