# Casos de Uso - ToPesp-Armário

Este documento descreve os Casos de Uso do sistema de administração pessoal de amostras de rochas e minerais (**ToPesp-Armário**), com base nos requisitos funcionais e na visão do projeto.

---

## Sumário dos Casos de Uso

| ID | Nome do Caso de Uso | Requisito Relacionado | Ator Principal |
|---|---|---|---|
| **UC01** | Cadastrar Usuário | RF-08 | Visitante |
| **UC02** | Autenticar Usuário (Login) | RF-09 | Usuário Cadastrado |
| **UC03** | Encerrar Sessão (Logout) | RF-09 | Usuário Autenticado |
| **UC04** | Cadastrar Amostra (Rocha / Mineral) | RF-01, RF-02 | Usuário Autenticado |
| **UC05** | Listar Amostras do Acervo | RF-06, RF-07 | Usuário Autenticado |
| **UC06** | Filtrar Amostras por Categoria e Tipo | RF-06, RF-07 | Usuário Autenticado |
| **UC07** | Visualizar Detalhes da Amostra | RF-01, RF-02 | Usuário Autenticado |
| **UC08** | Editar Amostra | RF-03 | Usuário Autenticado |
| **UC09** | Excluir Amostra | RF-04, RF-05 | Usuário Autenticado |
| **UC10** | Visualizar Perfil e Estatísticas | RF-08, RF-09 | Usuário Autenticado |
| **UC11** | Consultar Informações do Sistema ("Sobre") | RNF | Usuário Autenticado |

---

## Especificação dos Casos de Uso

### UC01 - Cadastrar Usuário
- **Ator:** Visitante (não autenticado).
- **Objetivo:** Criar uma nova conta de usuário para gerenciar seu acervo pessoal.
- **Pré-condições:** O aplicativo deve estar aberto na tela de registro.
- **Fluxo Principal:**
  1. O visitante acessa a tela de Cadastro.
  2. O visitante informa Nome completo, Email e Senha (com confirmação).
  3. O sistema valida se todos os campos foram preenchidos e se a senha atende aos requisitos mínimos.
  4. O sistema registra o usuário no serviço de autenticação (Firebase Auth) e persiste os dados complementares no Firestore.
  5. O usuário é autenticado e redirecionado para a tela inicial do acervo.
- **Fluxo Alternativo (Dados Inválidos):**
  - 3a. Se algum campo estiver vazio ou o email for inválido, o sistema emite mensagem de aviso e solicita a correção.
  - 3b. Se o email já estiver em uso, o sistema informa a duplicidade.
- **Pós-condições:** Conta criada com sucesso e usuário autenticado.

---

### UC02 - Autenticar Usuário (Login)
- **Ator:** Usuário Cadastrado.
- **Objetivo:** Autenticar-se no sistema para acessar suas amostras cadastradas.
- **Pré-condições:** Usuário previamente registrado.
- **Fluxo Principal:**
  1. O usuário abre o aplicativo na tela de Login.
  2. O usuário informa seu Email e Senha.
  3. O usuário seleciona "Entrar".
  4. O sistema valida as credenciais no Firebase Auth.
  5. O sistema direciona o usuário para a tela inicial do seu acervo pessoal.
- **Fluxo Alternativo (Credenciais Inválidas):**
  - 4a. Credenciais incorretas geram mensagem de erro sem expor dados sensíveis.
- **Pós-condições:** Sessão iniciada para o usuário autenticado.

---

### UC03 - Encerrar Sessão (Logout)
- **Ator:** Usuário Autenticado.
- **Objetivo:** Desconectar a conta do dispositivo atual.
- **Pré-condições:** Usuário autenticado.
- **Fluxo Principal:**
  1. O usuário seleciona o botão de "Sair" (no cabeçalho ou tela de perfil).
  2. O sistema encerra a sessão ativa no Firebase Auth.
  3. O sistema redireciona a interface para a tela de Login.
- **Pós-condições:** Sessão do usuário finalizada com segurança.

---

### UC04 - Cadastrar Amostra (Rocha / Mineral)
- **Ator:** Usuário Autenticado.
- **Objetivo:** Inserir uma nova rocha ou mineral no armário pessoal.
- **Pré-condições:** Usuário devidamente autenticado.
- **Fluxo Principal:**
  1. O usuário clica na opção "Nova Amostra" na tela inicial.
  2. O usuário escolhe a categoria: **Rocha** ou **Mineral**.
  3. O usuário preenche o **Nome** da amostra (obrigatório).
  4. O usuário seleciona ou informa o **Tipo** (obrigatório - ex.: Ígnea, Sedimentar, Metamórfica para rochas; Silicato, Óxido, Carbonato para minerais).
  5. Opcionalmente, o usuário informa:
     - Dureza na Escala de Mohs (1 a 10);
     - Localização no Armário (ex.: Prateleira 2, Gaveta B);
     - Data de Aquisição;
     - Descrição textual livre.
  6. O usuário seleciona "Salvar".
  7. O sistema valida os campos obrigatórios e grava a amostra associada ao UID do usuário no Firestore.
  8. O sistema exibe confirmação e retorna à listagem atualizada.
- **Fluxos Alternativos:**
  - 7a. Nome ou Tipo ausentes: o sistema emite alerta exigindo preenchimento.
- **Pós-condições:** Amostra persistida no banco e disponível para consulta.

---

### UC05 - Listar Amostras do Acervo
- **Ator:** Usuário Autenticado.
- **Objetivo:** Visualizar todas as amostras cadastradas no acervo pessoal.
- **Pré-condições:** Usuário autenticado.
- **Fluxo Principal:**
  1. O usuário acessa a tela Inicial (`InicioScreen`).
  2. O sistema carrega as amostras associadas ao identificador do usuário logado.
  3. O sistema exibe cards textuais com: Nome, Categoria, Tipo, Dureza e trecho da descrição.
  4. São exibidos também os totais gerais (total de amostras, total de rochas, total de minerais).
- **Pós-condições:** Lista textual exibida ordenadamente.

---

### UC06 - Filtrar Amostras por Categoria e Tipo
- **Ator:** Usuário Autenticado.
- **Objetivo:** Localizar rapidamente itens por Rocha, Mineral ou por tipo específico geológico.
- **Pré-condições:** Usuário na tela Inicial.
- **Fluxo Principal:**
  1. O usuário seleciona uma aba de categoria: `Todas`, `Rochas` ou `Minerais`.
  2. O usuário pode filtrar adicionalmente por tipo (ex.: `Ígnea`, `Sedimentar`, `Metamórfica` para rochas; `Silicato`, `Óxido`, etc. para minerais).
  3. Opcionalmente, o usuário digita um termo de busca no campo textual.
  4. O sistema atualiza dinamicamente a listagem exibida.
- **Pós-condições:** Apenas os itens que atendem aos filtros são apresentados na tela.

---

### UC07 - Visualizar Detalhes da Amostra
- **Ator:** Usuário Autenticado.
- **Objetivo:** Ler a ficha textual completa de uma rocha ou mineral.
- **Pré-condições:** Amostra selecionada a partir da listagem.
- **Fluxo Principal:**
  1. O usuário clica sobre uma amostra da lista.
  2. O sistema abre a tela `DetalhesScreen`.
  3. São apresentados todos os atributos: Nome, Categoria, Tipo geológico, Dureza Mohs, Localização física no armário, Data de aquisição, Descrição detalhada e data de registro.
- **Pós-condições:** Dados completos exibidos textualmente.

---

### UC08 - Editar Amostra
- **Ator:** Usuário Autenticado.
- **Objetivo:** Alterar informações de uma rocha ou mineral existente.
- **Pré-condições:** Amostra carregada na tela de Detalhes.
- **Fluxo Principal:**
  1. O usuário seleciona "Editar Amostra".
  2. O sistema abre o `FormularioScreen` pré-preenchido com os valores atuais.
  3. O usuário modifica os campos desejados (nome, tipo, dureza, descrição, etc.).
  4. O usuário seleciona "Salvar Alterações".
  5. O sistema valida e atualiza o documento correspondente no Firestore.
  6. O sistema exibe confirmação e retorna à tela com os dados atualizados.
- **Pós-condições:** Documento modificado e sincronizado no banco.

---

### UC09 - Excluir Amostra
- **Ator:** Usuário Autenticado.
- **Objetivo:** Remover permanentemente uma rocha ou mineral do acervo.
- **Pré-condições:** Amostra carregada na tela de Detalhes.
- **Fluxo Principal:**
  1. O usuário aciona a opção "Excluir Amostra".
  2. O sistema apresenta diálogo de confirmação para evitar exclusões acidentais.
  3. O usuário confirma a exclusão.
  4. O sistema remove o documento correspondente no Firestore.
  5. O sistema exibe confirmação e redireciona para a tela inicial.
- **Pós-condições:** Amostra desvinculada do acervo do usuário.

---

### UC10 - Visualizar Perfil e Estatísticas
- **Ator:** Usuário Autenticado.
- **Objetivo:** Consultar os dados da sua conta e o resumo quantitativo da sua coleção.
- **Pré-condições:** Usuário autenticado.
- **Fluxo Principal:**
  1. O usuário seleciona a opção "Perfil".
  2. O sistema apresenta o nome do colecionador, email cadastrado e ID da conta.
  3. O sistema calcula e exibe métricas do acervo: total de peças, quantidade de rochas e quantidade de minerais catalogados.
- **Pós-condições:** Informações do perfil e métricas exibidas.

---

### UC11 - Consultar Informações do Sistema ("Sobre")
- **Ator:** Usuário Autenticado.
- **Objetivo:** Entender a proposta do sistema, particularidades de ser 100% em texto e tecnologias utilizadas.
- **Pré-condições:** Aplicativo aberto.
- **Fluxo Principal:**
  1. O usuário seleciona "Sobre" no cabeçalho ou perfil.
  2. O sistema exibe as diretrizes do projeto conforme `visao.md` e `interface.md`:
     - Conceito de armário pessoal de rochas e minerais;
     - Particularidade da interface textual sem imagens;
     - Tipografia serifada clássica (Times New Roman) e cores sóbrias (preto e branco);
     - Arquitetura técnica (React Native, TypeScript, Firebase).
- **Pós-condições:** Informações institucionais e conceituais exibidas.
