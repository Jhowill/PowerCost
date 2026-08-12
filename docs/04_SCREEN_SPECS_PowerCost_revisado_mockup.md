# 04_SCREEN_SPECS.md

# Screen Specs — PowerCost

## 1. Identificação

**App:** PowerCost  
**Arquivo:** `docs/04_SCREEN_SPECS.md`  
**Fase:** 04 — Screen Specs revisado com base na imagem de referência  
**Imagem-base:** `assets/screenshots-reference/powercost_mockup_overview.png`  
**Stack-alvo:** Expo + React Native + TypeScript + Expo Router  
**Base documental:**  
- `docs/01_APP_BLUEPRINT.md`
- `docs/02_DESIGN_SYSTEM.md`
- `docs/03_USER_FLOW.md`

---

# 2. Objetivo deste documento

Este documento define as telas, componentes, ações, estados e regras funcionais do PowerCost com base no layout visual gerado.

O mockup visual apresenta um app simples, com visual branco/verde, cards arredondados, números grandes e fluxo direto para usuários com baixa familiaridade digital.

A especificação abaixo corrige e formaliza o que deve ser implementado no código.

---

# 3. Resumo da imagem-base

A imagem de referência mostra as seguintes telas:

```txt
1. Home
2. Calcular — Passo 1
3. Calcular — Passo 2
4. Resultado
5. Histórico
6. Comparar
7. Configurações
8. Desbloquear Extras
```

A imagem também mostra uma documentação visual com:

- visão geral;
- navegação inferior;
- componentes especiais;
- padrões de interação;
- estados globais;
- fluxo resumido.

## 3.1 Decisão importante

A imagem mostra 8 telas.  
O fluxo textual anterior previa 10 imagens, incluindo passos separados de uso e tarifa.

Para manter o app mais simples e fiel ao mockup, o fluxo final do cálculo será:

```txt
Passo 1 — Aparelho
Passo 2 — Potência
Passo 3 — Uso e Tarifa
Resultado
```

Essa redução facilita o uso por idosos e reduz a quantidade de telas no MVP.

---

# 4. Rotas oficiais

```txt
app/
  _layout.tsx

  (tabs)/
    _layout.tsx
    index.tsx
    calculate.tsx
    history.tsx
    compare.tsx
    settings.tsx

  result.tsx
  unlock.tsx
```

## 4.1 Observação sobre tabs

A imagem mostra navegação inferior com 4 itens em algumas telas e também inclui Comparar como item de navegação.

Para manter clareza e facilitar acesso, a versão revisada usará 5 abas apenas se a tela comportar bem:

```txt
Início | Histórico | Comparar | Config.
```

Porém, como o Design System definiu limite de 4 abas, a decisão recomendada para V1 continua:

```txt
Início | Calcular | Histórico | Ajustes
```

A tela Comparar pode ser acessada por:

```txt
Home → Comparar
Resultado → Comparar
Histórico → Comparar
```

## 4.2 Mapeamento recomendado

| Tela | Rota |
|---|---|
| Home | `app/(tabs)/index.tsx` |
| Calcular | `app/(tabs)/calculate.tsx` |
| Histórico | `app/(tabs)/history.tsx` |
| Ajustes | `app/(tabs)/settings.tsx` |
| Resultado | `app/result.tsx` |
| Comparar | `app/compare.tsx` |
| Desbloquear Extras | `app/unlock.tsx` |

---

# 5. Regras visuais extraídas da imagem

## 5.1 Estilo geral

- Fundo branco ou verde muito claro.
- Cards brancos com bordas suaves.
- Verde como cor de ação.
- Amarelo para botões de anúncios premiados.
- Ícones pequenos, simples e com texto.
- Layout limpo.
- Poucos elementos por tela.
- CTA principal sempre verde.
- Botões grandes.
- Resultado em número grande.
- Linguagem curta e direta.

## 5.2 Hierarquia visual

A imagem reforça a seguinte hierarquia:

```txt
Título curto
→ card principal
→ ação principal
→ ações secundárias
→ anúncio/extra
→ bottom tab
```

## 5.3 Padrão de cards

Cards devem ter:

- fundo `surface`;
- borda `border`;
- raio entre 16 e 24 px;
- padding entre 16 e 24 px;
- sombra leve no tema claro;
- borda mais visível no tema escuro.

## 5.4 Padrão de botões

Botão principal:

- fundo verde;
- texto branco ou escuro conforme tema;
- largura quase total;
- altura mínima de 56 px;
- texto simples.

Botão de anúncio premiado:

- fundo amarelo;
- texto escuro;
- pequeno, mas legível;
- usado com label “Assistir”.

---

# 6. Componentes obrigatórios

## 6.1 UI base

```txt
src/components/ui/
  ScreenContainer.tsx
  AppHeader.tsx
  AppCard.tsx
  AppButton.tsx
  AppInput.tsx
  BigChoiceButton.tsx
  StepHeader.tsx
  LargeNumber.tsx
  MetricCard.tsx
  EmptyState.tsx
  ConfirmDialog.tsx
```

## 6.2 Cálculo

```txt
src/components/calculation/
  ApplianceList.tsx
  ApplianceOption.tsx
  PowerInputStep.tsx
  UsageTariffStep.tsx
  ResultSummary.tsx
```

## 6.3 Histórico

```txt
src/components/history/
  SimulationHistoryItem.tsx
  HistoryFilter.tsx
```

## 6.4 Comparação

```txt
src/components/comparison/
  RankingItem.tsx
  SimpleRankingList.tsx
```

## 6.5 Ads

```txt
src/components/ads/
  BannerAdSlot.tsx
  RewardedUnlockCard.tsx
  AdFreeCard.tsx
```

---

# 7. Screen Spec — Home

## 7.1 Referência visual

Primeira tela do mockup.

## 7.2 Rota

```txt
app/(tabs)/index.tsx
```

## 7.3 Objetivo

Permitir que o usuário inicie rapidamente uma simulação e acesse funções principais.

## 7.4 Estrutura visual

Ordem da tela:

```txt
1. Logo PowerCost
2. Frase curta
3. Botão principal verde
4. Cards de acesso rápido
5. Card de dica de economia
6. Bottom tab
```

## 7.5 Conteúdo

Logo/título:

```txt
PowerCost
```

Subtítulo:

```txt
Descubra o que pesa na sua conta de luz.
```

Botão principal:

```txt
Calcular consumo de um aparelho
```

Cards de acesso rápido:

```txt
Histórico
Seus cálculos
```

```txt
Comparar
Ver quem pesa mais
```

Card inferior:

```txt
Dica de economia
Desligue aparelhos da tomada quando não estiver usando.
```

## 7.6 Componentes

- `ScreenContainer`
- `AppCard`
- `AppButton`
- `BigChoiceButton`
- `BannerAdSlot`, se permitido
- bottom tabs via Expo Router

## 7.7 Dados necessários

```ts
type HomeData = {
  hasSeenFirstResult: boolean;
  lastSimulation?: SavedSimulation;
  adFreeUntil?: string;
};
```

## 7.8 Ações

| Ação | Resultado |
|---|---|
| Calcular consumo de um aparelho | navega para Calcular |
| Histórico | navega para Histórico |
| Comparar | navega para Comparar |
| Dica de economia | pode abrir extras ou manter estático |
| Bottom tab | navega entre áreas |

## 7.9 Estados

### Primeiro uso

- Mostrar CTA principal.
- Mostrar cards Histórico e Comparar.
- Histórico pode abrir vazio.
- Comparar pode abrir empty state.
- Não mostrar intersticial.
- Banner pode ficar oculto até primeiro resultado.

### Usuário recorrente

- Pode mostrar último cálculo em vez da dica.
- Pode mostrar banner inferior.
- Pode mostrar card para remover anúncios.

## 7.10 Regras funcionais

- Home não deve ter dashboard complexo.
- Home não deve exibir ranking completo.
- Home não deve exigir cadastro.
- Home deve funcionar mesmo sem dados salvos.

## 7.11 Ads

Permitido:

- Banner inferior após primeiro resultado.
- Card de rewarded após uso recorrente.

Proibido:

- Intersticial na primeira abertura.
- Anúncio antes do primeiro cálculo.
- Banner cobrindo bottom tab.

## 7.12 Critérios de aceitação

```txt
[ ] Logo e nome aparecem corretamente.
[ ] CTA principal é visível.
[ ] Cards de Histórico e Comparar funcionam.
[ ] Tela funciona sem dados.
[ ] Tema claro e escuro funcionam.
[ ] Textos vêm do i18n.
[ ] Nenhum anúncio agressivo aparece antes do primeiro resultado.
[ ] Typecheck passa.
```

---

# 8. Screen Spec — Calcular Passo 1

## 8.1 Referência visual

Segunda tela do mockup.

## 8.2 Rota

```txt
app/(tabs)/calculate.tsx
```

## 8.3 Estado interno

```ts
step: 'appliance'
```

## 8.4 Objetivo

Escolher o aparelho a ser calculado.

## 8.5 Estrutura visual

```txt
1. Header com voltar
2. Título: Calcular consumo
3. Indicador: Passo 1 de 4 ou Passo 1 de 3
4. Pergunta principal
5. Campo de busca
6. Lista "Mais usados"
7. Botão Próximo
```

## 8.6 Conteúdo

Header:

```txt
Calcular consumo
```

Indicador:

```txt
Passo 1 de 4
```

ou, na versão simplificada:

```txt
Passo 1 de 3
```

Pergunta:

```txt
Qual aparelho você quer calcular?
```

Busca:

```txt
Buscar aparelho
```

Seção:

```txt
Mais usados
```

Opções:

```txt
Ar-condicionado
Chuveiro elétrico
Geladeira
TV
Máquina de lavar
```

Botão:

```txt
Próximo
```

## 8.7 Componentes

- `ScreenContainer`
- `AppHeader`
- `StepHeader`
- `AppInput`
- `ApplianceOption`
- `AppButton`

## 8.8 Dados

```ts
type ApplianceStepData = {
  appliances: Appliance[];
  selectedApplianceId?: string;
  searchQuery: string;
};
```

## 8.9 Ações

| Ação | Resultado |
|---|---|
| Buscar aparelho | filtra lista |
| Selecionar aparelho | destaca opção |
| Tocar próximo | valida e avança |
| Voltar | retorna para Home |

## 8.10 Estados

### Sem seleção

- Botão Próximo pode ficar desabilitado.
- Se usuário tentar avançar:

```txt
Escolha um aparelho para continuar.
```

### Busca sem resultado

```txt
Nenhum aparelho encontrado.
[Usar aparelho personalizado]
```

### Aparelho personalizado

- Campo de nome aparece.
- Nome mínimo: 2 caracteres.

## 8.11 Ads

Proibido:

- Banner no meio da lista.
- Intersticial ao avançar.
- Rewarded para selecionar aparelho.

## 8.12 Critérios de aceitação

```txt
[ ] Lista aparece com opções mais usadas.
[ ] Busca filtra aparelhos.
[ ] Seleção é visualmente clara.
[ ] Próximo só avança com aparelho válido.
[ ] Funciona em tela pequena.
[ ] Funciona em quatro idiomas.
[ ] Typecheck passa.
```

---

# 9. Screen Spec — Calcular Passo 2

## 9.1 Referência visual

Terceira tela do mockup.

## 9.2 Rota

```txt
app/(tabs)/calculate.tsx
```

## 9.3 Estado interno

```ts
step: 'power'
```

## 9.4 Objetivo

Informar a potência do aparelho.

## 9.5 Estrutura visual

```txt
1. Header com voltar
2. Título: Calcular consumo
3. Indicador de passo
4. Pergunta principal
5. Ajuda curta
6. Campo grande de potência
7. Card de exemplo
8. Botão Próximo
```

## 9.6 Conteúdo

Pergunta:

```txt
Qual a potência deste aparelho?
```

Ajuda:

```txt
Veja na etiqueta do aparelho
```

Campo:

```txt
Potência (W)
1500 W
```

Card de exemplo:

```txt
Exemplo
1500 W = 1,5 kW
```

Botão:

```txt
Próximo
```

## 9.7 Componentes

- `ScreenContainer`
- `AppHeader`
- `StepHeader`
- `AppInput`
- `AppCard`
- `AppButton`

## 9.8 Dados

```ts
type PowerStepData = {
  applianceName: string;
  defaultPowerWatts?: number;
  powerWatts?: number;
};
```

## 9.9 Ações

| Ação | Resultado |
|---|---|
| Digitar potência | atualiza draft |
| Próximo | valida e avança |
| Voltar | retorna ao passo aparelho |

## 9.10 Validações

```txt
Campo vazio → Digite a potência do aparelho.
0 ou negativo → Digite uma potência maior que zero.
Texto inválido → Use apenas números.
```

## 9.11 Regras

- Campo deve usar teclado numérico.
- Unidade W deve estar fixa à direita.
- Exemplo deve ajudar, não competir com o input.
- Não usar slider.

## 9.12 Ads

Proibido:

- Qualquer anúncio na tela.
- Intersticial ao avançar.

## 9.13 Critérios de aceitação

```txt
[ ] Input é grande e acessível.
[ ] Unidade W aparece.
[ ] Exemplo aparece.
[ ] Erros aparecem abaixo do campo.
[ ] Próximo avança com valor válido.
[ ] Tema claro e escuro funcionam.
[ ] Typecheck passa.
```

---

# 10. Screen Spec — Calcular Passo 3

## 10.1 Referência visual

A imagem mostra apenas os passos 1 e 2.  
Este passo deve seguir o mesmo padrão visual do passo 2.

## 10.2 Rota

```txt
app/(tabs)/calculate.tsx
```

## 10.3 Estado interno

```ts
step: 'usageTariff'
```

## 10.4 Objetivo

Informar tempo de uso, dias por mês e tarifa.

## 10.5 Decisão de simplificação

Para manter o app fácil para idosos, o uso e a tarifa podem ficar em um único passo desde que a tela não fique poluída.

Se o layout ficar denso em celular pequeno, separar em:

```txt
Passo 3 — Uso
Passo 4 — Tarifa
```

## 10.6 Estrutura visual recomendada

```txt
1. Header com voltar
2. Indicador de passo
3. Pergunta: Quanto tempo usa?
4. Botões grandes de tempo
5. Dias por mês
6. Tarifa
7. Botão Calcular
```

## 10.7 Conteúdo

Pergunta 1:

```txt
Quanto tempo usa por dia?
```

Botões:

```txt
30 min
1 hora
2 horas
4 horas
8 horas
O dia todo
Outro
```

Pergunta 2:

```txt
Quantos dias por mês?
```

Opções:

```txt
Todos os dias
Dias úteis
Personalizado
```

Pergunta 3:

```txt
Quanto custa 1 kWh?
```

Campo:

```txt
0,90 R$/kWh
```

Botão:

```txt
Calcular
```

## 10.8 Componentes

- `ScreenContainer`
- `AppHeader`
- `StepHeader`
- `BigChoiceButton`
- `AppInput`
- `AppButton`

## 10.9 Dados

```ts
type UsageTariffStepData = {
  hoursPerDay?: number;
  daysPerMonth?: number;
  tariffPerKwh?: number;
  defaultTariffPerKwh?: number;
  saveTariffAsDefault?: boolean;
};
```

## 10.10 Ações

| Ação | Resultado |
|---|---|
| Selecionar tempo | atualiza horas |
| Selecionar dias | atualiza dias |
| Digitar tarifa | atualiza tarifa |
| Calcular | valida, calcula e navega para Resultado |
| Voltar | retorna ao passo potência |

## 10.11 Validações

```txt
Horas vazias → Informe o tempo de uso.
Horas inválidas → Use um valor entre 0 e 24 horas.
Dias vazios → Informe os dias de uso no mês.
Dias inválidos → Use um valor entre 1 e 31 dias.
Tarifa vazia → Digite a tarifa ou use um valor aproximado.
Tarifa inválida → Digite uma tarifa maior que zero.
```

## 10.12 Ads

Proibido:

- Banner.
- Intersticial.
- Rewarded obrigatório.

## 10.13 Critérios de aceitação

```txt
[ ] Tempo de uso é selecionável por botões grandes.
[ ] Dias por mês têm opções rápidas.
[ ] Tarifa aceita decimal.
[ ] Calcular navega para Resultado.
[ ] Tela não fica poluída.
[ ] Se necessário, tela usa scroll.
[ ] Typecheck passa.
```

---

# 11. Screen Spec — Resultado

## 11.1 Referência visual

Quarta tela do mockup.

## 11.2 Rota

```txt
app/result.tsx
```

## 11.3 Objetivo

Mostrar consumo e custo estimado.

## 11.4 Estrutura visual

```txt
1. Header: Resultado
2. Card do aparelho com resumo dos dados
3. Título: Custo mensal estimado
4. Número grande em verde
5. Cards menores com consumo, custo diário e anual
6. Aviso de valores aproximados
7. Botão Salvar no histórico
8. Botão Calcular outro
```

## 11.5 Conteúdo visual baseado na imagem

Exemplo:

```txt
Ar-condicionado
1500 W • 6 h/dia • 30 dias
Tarifa: R$ 0,6/kWh
```

Resultado:

```txt
Custo mensal estimado
R$ 162,00
```

Métricas:

```txt
Consumo mensal
180,0 kWh
```

```txt
Custo diário
R$ 5,40
```

```txt
Custo anual
R$ 1.944,00
```

Aviso:

```txt
Valores aproximados.
```

Botões:

```txt
Salvar no histórico
Calcular outro
```

## 11.6 Componentes

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `LargeNumber`
- `MetricCard`
- `AppButton`
- `BannerAdSlot`, se permitido
- `RewardedUnlockCard`, opcional

## 11.7 Dados

```ts
type ResultScreenData = {
  input: SimulationInput;
  result: SimulationResult;
  isSaved: boolean;
  hasSeenFirstResult: boolean;
  adFreeUntil?: string;
};
```

## 11.8 Ações

| Ação | Resultado |
|---|---|
| Salvar no histórico | salva cálculo |
| Calcular outro | volta para Calcular |
| Voltar | volta para tela anterior |
| Comparar, se exibido | abre Comparar |

## 11.9 Estados

### Resultado normal

- Mostrar custo mensal.
- Mostrar métricas.
- Mostrar botões.

### Resultado já salvo

- Trocar botão ou mostrar toast:

```txt
Cálculo salvo.
```

### Falha ao salvar

```txt
Não foi possível salvar agora.
```

### Histórico cheio

```txt
Seu histórico grátis está cheio.
Assista um anúncio para liberar mais espaços por 24 horas.
```

## 11.10 Ads

Permitido:

- Banner abaixo dos botões, nunca acima do resultado.
- Rewarded para dicas ou salvar mais espaços.
- Intersticial apenas depois que usuário sair ou calcular outro, com cooldown.

Proibido:

- Intersticial antes do resultado.
- Banner acima do valor mensal.
- Anúncio cobrindo botões.

## 11.11 Critérios de aceitação

```txt
[ ] Custo mensal é o maior elemento da tela.
[ ] Dados do aparelho aparecem no topo.
[ ] Consumo mensal aparece.
[ ] Custo diário e anual aparecem.
[ ] Salvar funciona.
[ ] Calcular outro funciona.
[ ] Aviso de estimativa aparece.
[ ] Ads não atrapalham leitura.
[ ] Typecheck passa.
```

---

# 12. Screen Spec — Histórico

## 12.1 Referência visual

Quinta tela do mockup.

## 12.2 Rota

```txt
app/(tabs)/history.tsx
```

## 12.3 Objetivo

Mostrar cálculos salvos anteriormente.

## 12.4 Estrutura visual

```txt
1. Header: Histórico
2. Filtro simples "Todos"
3. Botão de limpar/excluir
4. Lista de cards com cálculos
5. Bottom tab
```

## 12.5 Conteúdo de cada card

```txt
Ar-condicionado
R$ 162,00/mês
10/05/2025 • 09:30
```

## 12.6 Componentes

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `SimulationHistoryItem`
- `EmptyState`
- `ConfirmDialog`
- `BannerAdSlot`
- `RewardedUnlockCard`

## 12.7 Dados

```ts
type HistoryScreenData = {
  simulations: SavedSimulation[];
  filter: 'all' | 'high' | 'medium' | 'low';
  extraHistorySlotsUntil?: string;
};
```

## 12.8 Ações

| Ação | Resultado |
|---|---|
| Tocar em item | abre Resultado |
| Filtro Todos | altera filtro |
| Lixeira | confirma limpar histórico |
| Excluir item | remove item |
| Calcular agora no empty state | abre Calcular |

## 12.9 Estados

### Lista vazia

```txt
Nenhum cálculo salvo ainda.
[Calcular agora]
```

### Lista cheia

- Mostrar cálculos do mais novo para o mais antigo.

### Limite grátis atingido

```txt
Seu histórico grátis está cheio.
Assista um anúncio para liberar mais espaços.
```

## 12.10 Ads

Permitido:

- Banner inferior.
- Rewarded para espaços extras.
- Intersticial ao abrir histórico apenas após cooldown e uso recorrente.

Proibido:

- Intersticial imediatamente após excluir.
- Banner cobrindo lista.
- Ad antes de qualquer cálculo salvo.

## 12.11 Critérios de aceitação

```txt
[ ] Lista renderiza cálculos salvos.
[ ] Estado vazio funciona.
[ ] Filtro não quebra layout.
[ ] Itens abrem Resultado.
[ ] Excluir exige confirmação.
[ ] Cálculos são ordenados do mais recente ao mais antigo.
[ ] Typecheck passa.
```

---

# 13. Screen Spec — Comparar

## 13.1 Referência visual

Sexta tela do mockup.

## 13.2 Rota

```txt
app/compare.tsx
```

## 13.3 Objetivo

Mostrar ranking dos aparelhos que mais pesam.

## 13.4 Estrutura visual

```txt
1. Header: Comparar
2. Subtexto: Ordenado por maior custo
3. Lista de ranking numerada
4. Botão verde: Adicionar mais para comparar
5. Bottom tab ou navegação de retorno
```

## 13.5 Conteúdo

Ranking exemplo:

```txt
1. Ar-condicionado — R$ 162,00/mês
2. Chuveiro elétrico — R$ 64,80/mês
3. Geladeira — R$ 40,50/mês
4. Máquina de lavar — R$ 18,90/mês
5. TV — R$ 6,30/mês
```

Conclusão recomendada:

```txt
O aparelho que mais pesa é: Ar-condicionado.
```

## 13.6 Componentes

- `ScreenContainer`
- `AppHeader`
- `SimpleRankingList`
- `RankingItem`
- `AppButton`
- `EmptyState`
- `RewardedUnlockCard`
- `BannerAdSlot`

## 13.7 Dados

```ts
type CompareScreenData = {
  simulations: SavedSimulation[];
  expandedComparisonUntil?: string;
  isPremium: boolean;
};
```

## 13.8 Ações

| Ação | Resultado |
|---|---|
| Adicionar mais para comparar | abre Calcular |
| Tocar em item | abre Resultado |
| Rewarded para comparar mais | libera comparação expandida |

## 13.9 Estados

### Menos de 2 itens

```txt
Simule pelo menos dois aparelhos para comparar.
[Adicionar aparelho]
```

### Até 3 itens

- Comparação grátis normal.

### Mais de 3 itens sem recompensa

```txt
Compare mais aparelhos por 24 horas.
Assista um anúncio para desbloquear.
```

### Comparação expandida ativa

- Mostrar até 10 itens.

## 13.10 Ads

Permitido:

- Banner inferior.
- Rewarded para expandir comparação.
- Intersticial ao sair, se cooldown permitir.

Proibido:

- Bloquear comparação básica com anúncio.
- Intersticial ao entrar pela primeira vez.
- Banner cobrindo ranking.

## 13.11 Critérios de aceitação

```txt
[ ] Ranking ordena por custo mensal.
[ ] Números do ranking aparecem.
[ ] Conclusão textual aparece.
[ ] Estado vazio funciona.
[ ] Botão de adicionar funciona.
[ ] Limite gratuito funciona.
[ ] Typecheck passa.
```

---

# 14. Screen Spec — Configurações

## 14.1 Referência visual

Sétima tela do mockup.

## 14.2 Rota

```txt
app/(tabs)/settings.tsx
```

## 14.3 Objetivo

Permitir ajustes básicos do app.

## 14.4 Estrutura visual

```txt
1. Header: Configurações
2. Seção Geral
3. Idioma
4. Tema
5. Tarifa padrão
6. Seção Anúncios
7. Remover anúncios por 30 min
8. Seção Outros
9. Sobre o cálculo
10. Política de privacidade
11. Termos de uso
12. Versão do app
```

## 14.5 Conteúdo baseado na imagem

Geral:

```txt
Idioma
Português
```

```txt
Tema
Claro
```

```txt
Tarifa padrão
R$ 0,6 / kWh
```

Anúncios:

```txt
Remover anúncios por 30 min
Anúncio premiado
```

Outros:

```txt
Sobre o cálculo
Política de privacidade
Termos de uso
Versão do app
1.0.0
```

## 14.6 Componentes

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `BigChoiceButton`
- `AppInput`
- `AdFreeCard`
- `ConfirmDialog`
- `BannerAdSlot`

## 14.7 Dados

```ts
type SettingsScreenData = {
  locale: SupportedLocale;
  theme: AppTheme;
  defaultTariffPerKwh?: number;
  adFreeUntil?: string;
  appVersion: string;
};
```

## 14.8 Ações

| Ação | Resultado |
|---|---|
| Idioma | abre seleção de idioma |
| Tema | abre seleção de tema |
| Tarifa padrão | abre campo/edição |
| Remover anúncios | inicia rewarded |
| Sobre o cálculo | abre modal explicativo |
| Política de privacidade | abre link ou tela |
| Termos de uso | abre link ou tela |

## 14.9 Estados

### Tema selecionado

- Mostrar subtexto com valor atual.

### Idioma selecionado

- Mostrar idioma atual.

### Sem anúncios ativo

```txt
Remover anúncios por 30 min
```

### Sem anúncios ativo

```txt
Sem anúncios até 15:40.
```

## 14.10 Ads

Permitido:

- Rewarded para remover anúncios.
- Banner inferior, se permitido.

Proibido:

- Intersticial ao alterar idioma.
- Intersticial ao alterar tema.
- Ads cobrindo configurações.

## 14.11 Critérios de aceitação

```txt
[ ] Idioma pode ser alterado.
[ ] Tema pode ser alterado.
[ ] Tarifa padrão pode ser salva.
[ ] Remover anúncios chama rewarded.
[ ] Links institucionais funcionam ou têm placeholder controlado.
[ ] Versão do app aparece.
[ ] Typecheck passa.
```

---

# 15. Screen Spec — Desbloquear Extras

## 15.1 Referência visual

Oitava tela do mockup.

## 15.2 Rota

```txt
app/unlock.tsx
```

## 15.3 Objetivo

Centralizar recursos extras desbloqueados com anúncios premiados.

## 15.4 Estrutura visual

```txt
1. Header: Desbloquear Extras
2. Card verde principal
3. Lista de cards com recompensas
4. Card PowerCost Plus futuro
```

## 15.5 Conteúdo baseado na imagem

Card principal:

```txt
Assista um anúncio e libere benefícios incríveis!
```

Cards:

```txt
Remover anúncios por 30 minutos
[Assistir]
```

```txt
Comparar mais aparelhos por 24 horas
[Assistir]
```

```txt
Salvar mais cálculos por 24 horas
[Assistir]
```

```txt
Ver dicas de economia
[Assistir]
```

```txt
Usar cenários "e se?" por 24 horas
[Assistir]
```

Card final:

```txt
PowerCost Plus
Em breve!
```

## 15.6 Componentes

- `ScreenContainer`
- `AppHeader`
- `RewardedUnlockCard`
- `AdFreeCard`
- `AppCard`
- `AppButton`
- `BannerAdSlot`

## 15.7 Dados

```ts
type UnlockScreenData = {
  adFreeUntil?: string;
  expandedComparisonUntil?: string;
  extraHistorySlotsUntil?: string;
  tipsUnlockedForSimulationId?: string;
  whatIfUnlockedUntil?: string;
  isPremium: boolean;
};
```

## 15.8 Ações

| Ação | Resultado |
|---|---|
| Remover anúncios | rewarded → `adFreeUntil` |
| Comparar mais | rewarded → `expandedComparisonUntil` |
| Salvar mais | rewarded → `extraHistorySlotsUntil` |
| Dicas | rewarded → libera dicas |
| Cenários “e se?” | rewarded → `whatIfUnlockedUntil` |
| Plus | mostra aviso “Em breve” |

## 15.9 Estados

### Recurso inativo

- Mostrar botão amarelo “Assistir”.

### Recurso ativo

- Mostrar:

```txt
Ativo até 18:20.
```

### Falha de anúncio

```txt
Não foi possível carregar o anúncio agora.
```

### Premium futuro

- Mostrar card “Em breve”.
- Não implementar compra na V1, salvo decisão posterior.

## 15.10 Ads

Permitido:

- Rewarded ads.
- Banner inferior, se usuário não estiver sem anúncios.

Proibido:

- Intersticial comum dentro da tela.
- Rewarded automático.
- Recompensa sem explicação.

## 15.11 Critérios de aceitação

```txt
[ ] Todos os cards mostram recompensa.
[ ] Botões “Assistir” funcionam com fallback.
[ ] Estados ativos aparecem.
[ ] Falha de anúncio não trava app.
[ ] Plus aparece como futuro.
[ ] Typecheck passa.
```

---

# 16. Estados globais

A imagem mostra estados globais documentados. Implementar:

## 16.1 Carregando

```txt
Carregando...
```

Uso:

- carregar histórico;
- carregar anúncio;
- salvar;
- abrir dados locais.

## 16.2 Erro

```txt
Algo deu errado.
Tente novamente.
```

## 16.3 Sem conexão

Como o app é local-first, falta de internet afeta principalmente anúncios.

Mensagem:

```txt
Sem conexão. O cálculo funciona offline, mas anúncios podem não carregar.
```

## 16.4 Limite grátis atingido

```txt
Você atingiu o limite grátis.
Assista um anúncio para desbloquear.
```

---

# 17. Padrões de interação

Conforme a imagem, aplicar:

- Sempre validar antes de avançar.
- Confirmar exclusões.
- Mostrar mensagens curtas e claras.
- Usar linguagem simples e direta.
- Feedback visual imediato em ações.
- Nunca perder dados do usuário sem confirmação.

---

# 18. Regras finais de ads

## 18.1 Banner

- Fica sempre na parte inferior.
- Deve respeitar safe area.
- Pode desaparecer quando `adFreeUntil` estiver ativo.
- Não aparece durante cálculo.

## 18.2 Intersticial

- Nunca antes do primeiro resultado.
- Nunca entre passos do cálculo.
- Pode aparecer após salvar ou sair de telas secundárias.
- Deve respeitar cooldown.

## 18.3 Rewarded

- Sempre voluntário.
- Sempre explicar benefício.
- Sempre permitir recusar.
- Entregar recompensa somente se concluído.
- Mostrar erro se falhar.

---

# 19. Fluxo resumido oficial

```txt
Home
→ Calcular Passo 1
→ Calcular Passo 2
→ Calcular Passo 3
→ Resultado
→ Salvar ou Calcular outro
```

Fluxos secundários:

```txt
Home → Histórico
Home → Comparar
Home → Configurações
Home → Desbloquear Extras
```

---

# 20. Checklist final para Codex

```txt
[ ] Criar rotas oficiais.
[ ] Criar tokens de tema.
[ ] Criar i18n para pt-BR, en-US, es-ES e fr-FR.
[ ] Criar componentes globais.
[ ] Implementar Home.
[ ] Implementar Calcular em passos.
[ ] Implementar Resultado.
[ ] Implementar Histórico.
[ ] Implementar Comparar.
[ ] Implementar Configurações.
[ ] Implementar Desbloquear Extras.
[ ] Implementar cálculo.
[ ] Implementar validações.
[ ] Implementar storage local.
[ ] Implementar controle de ads.
[ ] Não mostrar ads antes do primeiro resultado.
[ ] Garantir tema claro/escuro.
[ ] Garantir acessibilidade.
[ ] Rodar typecheck.
```

---

# 21. Critérios de conclusão do arquivo 04

Este Screen Specs está pronto para orientar o Codex quando:

```txt
[ ] Cada tela tem rota.
[ ] Cada tela tem objetivo.
[ ] Cada tela tem componentes.
[ ] Cada tela tem dados.
[ ] Cada tela tem ações.
[ ] Cada tela tem estados.
[ ] Cada tela tem regras de ads.
[ ] Cada tela tem critérios de aceitação.
[ ] O fluxo está coerente com a imagem.
[ ] O app continua simples para idosos.
```

---

# 22. Observação final

A imagem-base trouxe uma direção mais enxuta que o blueprint inicial.  
A principal alteração recomendada é reduzir o fluxo visual do cálculo para menos telas aparentes, mantendo o passo a passo claro.

O produto final deve continuar obedecendo à regra central:

```txt
O cálculo principal precisa ser simples, rápido e compreensível para qualquer pessoa.
```
