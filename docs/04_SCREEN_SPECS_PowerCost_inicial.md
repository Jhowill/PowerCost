# 04_SCREEN_SPECS.md

# Screen Specs — PowerCost

## 1. Identificação

**App:** PowerCost  
**Arquivo:** `docs/04_SCREEN_SPECS.md`  
**Fase:** 04 — Screen Specs  
**Versão:** Inicial antes das imagens de referência  
**Base:**  
- `docs/01_APP_BLUEPRINT.md`
- `docs/02_DESIGN_SYSTEM.md`
- `docs/03_USER_FLOW.md`

## 2. Objetivo deste documento

Este arquivo transforma o produto PowerCost em especificações técnicas por tela para implementação futura no Codex.

Esta é a primeira versão do Screen Specs.  
Após a geração das imagens de referência, este arquivo deverá ser revisado para alinhar:

- composição visual;
- hierarquia dos cards;
- proporção dos elementos;
- posição dos anúncios;
- responsividade;
- estados visuais;
- detalhes finais de layout.

## 3. Regra principal

O app deve ser simples, claro e acessível para idosos.

```txt
Uma tela, uma ação principal.
```

O usuário deve conseguir entender cada tela em poucos segundos.

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
    settings.tsx

  result.tsx
  compare.tsx
  unlock.tsx
```

| Tela | Rota |
|---|---|
| Início | `app/(tabs)/index.tsx` |
| Calcular | `app/(tabs)/calculate.tsx` |
| Histórico | `app/(tabs)/history.tsx` |
| Ajustes | `app/(tabs)/settings.tsx` |
| Resultado | `app/result.tsx` |
| Comparar | `app/compare.tsx` |
| Desbloquear Extras | `app/unlock.tsx` |

---

# 5. Componentes globais obrigatórios

O Codex deve priorizar componentes reutilizáveis.

```txt
src/components/ui/
  ScreenContainer.tsx
  AppHeader.tsx
  AppCard.tsx
  AppButton.tsx
  BigChoiceButton.tsx
  AppInput.tsx
  StepHeader.tsx
  LargeNumber.tsx
  MetricCard.tsx
  EmptyState.tsx
  ConfirmDialog.tsx
```

Componentes de domínio:

```txt
src/components/calculation/
  AppliancePicker.tsx
  PowerStep.tsx
  UsageStep.tsx
  TariffStep.tsx
  ResultSummary.tsx

src/components/ads/
  BannerAdSlot.tsx
  RewardedUnlockCard.tsx
  AdFreeCard.tsx

src/components/history/
  SimulationHistoryItem.tsx

src/components/comparison/
  SimpleRankingList.tsx
  RankingBar.tsx
```

---

# 6. Regras globais de UI

## 6.1 Acessibilidade

- Texto comum mínimo: 16 px.
- Texto principal recomendado: 18 px.
- Resultado principal: 44 a 56 px.
- Botões principais com altura mínima de 56 px.
- Opções tocáveis com altura mínima de 52 px.
- Ícones sempre acompanhados de texto.
- Não depender de swipe.
- Sempre oferecer botão de voltar em fluxos fora das abas.

## 6.2 Layout

- Mobile-first.
- Conteúdo com `ScrollView` quando necessário.
- Padding horizontal padrão: 20 px.
- Espaço inferior quando houver banner: pelo menos 80 px.
- Em tablets, limitar conteúdo a aproximadamente 620 px e centralizar.
- Cards com bordas arredondadas e espaçamento confortável.

## 6.3 Idiomas

O app deve funcionar em:

```txt
pt-BR
en-US
es-ES
fr-FR
```

Regras:

- Nenhum texto fixo direto na tela.
- Usar chaves i18n.
- Botões devem suportar textos maiores em francês e espanhol.
- Cards devem crescer verticalmente.
- Não fixar altura em textos traduzidos.

## 6.4 Tema

O app deve suportar:

```txt
system
light
dark
```

Regras:

- Todas as telas devem usar tokens do tema.
- Não usar cor solta dentro da tela.
- Tema escuro deve usar borda para separar cards.
- Tema claro pode usar sombra suave.

## 6.5 Ads

Regras globais:

- Não mostrar intersticial antes do primeiro resultado.
- Não mostrar banner no meio do formulário.
- Não colocar banner acima do resultado principal.
- Rewarded ads devem ser voluntários.
- Sempre explicar recompensa antes do anúncio.
- Sempre tratar falha de anúncio.

---

# 7. Screen Spec — Início

## 7.1 Imagem de referência

```txt
assets/screenshots-reference/01_home.png
```

## 7.2 Rota

```txt
app/(tabs)/index.tsx
```

## 7.3 Objetivo

Receber o usuário e iniciar um cálculo rapidamente.

## 7.4 Função da tela

A tela deve responder:

```txt
Como começo a calcular o gasto de um aparelho?
```

## 7.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `AppButton`
- `LargeNumber`, se houver último cálculo
- `MetricCard`, se houver resumo
- `BannerAdSlot`, apenas após primeiro resultado
- `RewardedUnlockCard`, apenas após uso recorrente

## 7.6 Dados necessários

```ts
type HomeScreenData = {
  hasSeenFirstResult: boolean;
  lastSimulation?: SavedSimulation;
  defaultTariffPerKwh?: number;
  adFreeUntil?: string;
};
```

## 7.7 Layout esperado

Ordem visual:

```txt
1. Nome PowerCost
2. Frase simples
3. Card principal com CTA "Calcular agora"
4. Último cálculo, se existir
5. Tarifa salva, se existir
6. Card de remover anúncios, se permitido
7. Banner, se permitido
```

## 7.8 Conteúdo principal

Título:

```txt
PowerCost
```

Subtítulo:

```txt
Veja quanto um aparelho custa por mês.
```

CTA principal:

```txt
Calcular agora
```

Estado vazio:

```txt
Você ainda não calculou nenhum aparelho.
Toque em "Calcular agora" para começar.
```

## 7.9 Ações do usuário

| Ação | Resultado |
|---|---|
| Tocar em Calcular agora | navega para `app/(tabs)/calculate.tsx` |
| Tocar no último cálculo | navega para `app/result.tsx` com id do cálculo |
| Tocar em remover anúncios | navega para `app/unlock.tsx` ou dispara fluxo rewarded |
| Tocar em Histórico na tab | abre histórico |
| Tocar em Ajustes na tab | abre ajustes |

## 7.10 Estados

### Novo usuário

- Mostrar apenas frase principal, CTA e explicação curta.
- Não mostrar banner.
- Não mostrar intersticial.
- Não mostrar card agressivo de ads.

### Usuário recorrente

- Mostrar último cálculo.
- Mostrar tarifa salva.
- Banner pode aparecer.
- Card de remoção de anúncios pode aparecer.

### Sem anúncios ativo

- Não mostrar banner.
- Mostrar status discreto:

```txt
Sem anúncios até 15:40.
```

## 7.11 Anúncios permitidos

- Banner inferior após primeiro resultado.
- Card de rewarded para remover anúncios após uso recorrente.

## 7.12 Anúncios proibidos

- Intersticial na primeira abertura.
- Banner antes do primeiro resultado.
- Anúncio cobrindo o botão principal.

## 7.13 Critérios de aceitação

- A tela abre sem dados.
- O CTA principal é evidente.
- Usuário novo não vê anúncio agressivo.
- Usuário recorrente vê atalhos úteis.
- Funciona em tema claro e escuro.
- Funciona nos quatro idiomas.
- Botões têm tamanho acessível.
- Typecheck passa.

---

# 8. Screen Spec — Calcular

## 8.1 Imagem de referência

```txt
assets/screenshots-reference/02_calculate_appliance.png
assets/screenshots-reference/03_calculate_power.png
assets/screenshots-reference/04_calculate_usage.png
assets/screenshots-reference/05_calculate_tariff.png
```

## 8.2 Rota

```txt
app/(tabs)/calculate.tsx
```

## 8.3 Objetivo

Guiar o usuário em quatro passos para calcular o custo mensal de um aparelho.

## 8.4 Função da tela

A tela deve responder:

```txt
Quais dados preciso informar para calcular?
```

## 8.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `StepHeader`
- `AppCard`
- `BigChoiceButton`
- `AppInput`
- `AppButton`
- `AppliancePicker`
- `PowerStep`
- `UsageStep`
- `TariffStep`
- `ConfirmDialog`

## 8.6 Estado local do cálculo

```ts
type CalculationDraft = {
  step: 'appliance' | 'power' | 'usage' | 'tariff';
  applianceId?: string;
  applianceName?: string;
  customApplianceName?: string;
  powerWatts?: number;
  hoursPerDay?: number;
  daysPerMonth?: number;
  tariffPerKwh?: number;
  saveTariffAsDefault?: boolean;
};
```

## 8.7 Regra principal

Nunca mostrar todos os campos de uma vez.

O usuário deve ver apenas uma pergunta principal por etapa.

---

## 8.8 Passo 1 — Aparelho

### Objetivo

Selecionar aparelho.

### Título

```txt
Qual aparelho?
```

### Elementos

- Barra de progresso: passo 1 de 4.
- Botões grandes de aparelhos.
- Botão “Outro aparelho”.
- Botão “Continuar”.

### Aparelhos destacados

- Chuveiro
- Geladeira
- Ar-condicionado
- Ventilador
- Televisão
- Máquina de lavar
- Computador
- Lâmpada
- Outro aparelho

### Ações

| Ação | Resultado |
|---|---|
| Selecionar aparelho | marca item como selecionado |
| Selecionar outro aparelho | exibe campo de nome |
| Continuar | valida e avança para potência |
| Voltar | volta para início ou tela anterior |

### Erros

```txt
Escolha um aparelho para continuar.
```

### Critérios

- Opções grandes.
- Ícone + texto.
- Sem lista excessiva na primeira dobra.
- “Ver mais” pode abrir categorias futuras, mas não obrigatório na V1.

---

## 8.9 Passo 2 — Potência

### Objetivo

Informar potência em watts.

### Título

```txt
Qual a potência?
```

### Elementos

- Campo grande de watts.
- Unidade fixa: `W`.
- Ajuda curta.
- Botão “Não sei”.
- Botões “Voltar” e “Continuar”.

### Ajuda

```txt
A potência costuma estar na etiqueta do aparelho.
```

### Fluxo “Não sei”

Se o aparelho tiver potência aproximada:

```txt
Vamos usar uma potência aproximada. Você pode alterar depois.
```

Se não houver potência aproximada:

```txt
Digite uma potência aproximada para continuar.
```

### Erros

```txt
Digite a potência do aparelho.
Digite uma potência maior que zero.
Use apenas números.
```

### Critérios

- Input numérico com fonte grande.
- Unidade visível.
- Não usar placeholder como única instrução.
- Não usar slider.

---

## 8.10 Passo 3 — Uso

### Objetivo

Informar horas por dia e dias por mês.

### Título

```txt
Quanto tempo usa por dia?
```

### Elementos

Botões grandes de tempo:

- 30 min
- 1 hora
- 2 horas
- 4 horas
- 8 horas
- O dia todo
- Outro tempo

Dias por mês:

- Todos os dias
- Só dias úteis
- Personalizado

### Valores

```txt
30 min = 0.5 h
1 hora = 1 h
2 horas = 2 h
4 horas = 4 h
8 horas = 8 h
O dia todo = 24 h
Todos os dias = 30 dias
Só dias úteis = 22 dias
```

### Erros

```txt
Informe o tempo de uso.
Use um valor entre 0 e 24 horas.
Informe os dias de uso no mês.
Use um valor entre 1 e 31 dias.
```

### Critérios

- Não usar slider.
- Botões de tempo devem ser fáceis de tocar.
- Campo personalizado deve aparecer apenas quando necessário.

---

## 8.11 Passo 4 — Tarifa

### Objetivo

Informar tarifa por kWh.

### Título

```txt
Quanto custa 1 kWh?
```

### Elementos

- Campo grande de tarifa.
- Unidade: `R$/kWh`, `$/kWh` ou `€/kWh` conforme locale/moeda.
- Botão “Usar valor aproximado”.
- Botão “Onde encontro?”
- Checkbox “Salvar esta tarifa”.
- Botão “Ver resultado”.

### Ajuda

```txt
A tarifa aparece na sua conta de luz.
```

### Ação “Onde encontro?”

Exibir modal simples:

```txt
Procure na conta de luz por valor do kWh, tarifa de energia ou preço do kWh.
```

### Erros

```txt
Digite a tarifa ou use um valor aproximado.
Digite uma tarifa maior que zero.
Use apenas números.
```

### Critérios

- Campo deve aceitar decimal.
- Formatação respeita idioma.
- Se houver tarifa salva, campo abre preenchido.
- Botão “Ver resultado” calcula e navega para resultado.

---

## 8.12 Saída do fluxo

Ao concluir passo 4:

```txt
calculateSimulation()
→ criar SimulationResult
→ navegar para app/result.tsx
```

## 8.13 Sair com dados preenchidos

Se usuário tentar sair:

```txt
Sair do cálculo?
Os dados preenchidos serão perdidos.
[Continuar calculando]
[Sair]
```

## 8.14 Anúncios permitidos

- Nenhum anúncio intersticial durante os passos.
- Nenhum banner no meio do formulário.

## 8.15 Anúncios proibidos

- Banner entre campos.
- Intersticial entre passos.
- Rewarded obrigatório para calcular.
- Qualquer anúncio antes do primeiro resultado.

## 8.16 Critérios de aceitação

- Fluxo tem 4 passos.
- Cada passo tem apenas uma pergunta principal.
- É possível voltar.
- É possível calcular com dados válidos.
- Erros são claros.
- Inputs são acessíveis.
- Não há anúncios durante preenchimento.
- Funciona em quatro idiomas.
- Funciona em tema claro/escuro.
- Typecheck passa.

---

# 9. Screen Spec — Resultado

## 9.1 Imagem de referência

```txt
assets/screenshots-reference/06_result.png
```

## 9.2 Rota

```txt
app/result.tsx
```

## 9.3 Objetivo

Mostrar o custo mensal estimado de forma clara.

## 9.4 Função da tela

A tela deve responder:

```txt
Quanto este aparelho custa por mês?
```

## 9.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `LargeNumber`
- `MetricCard`
- `AppButton`
- `RewardedUnlockCard`
- `BannerAdSlot`
- `ResultSummary`

## 9.6 Dados necessários

```ts
type ResultScreenData = {
  simulation: SavedSimulation | {
    input: SimulationInput;
    result: SimulationResult;
  };
  isSaved: boolean;
  hasSeenFirstResult: boolean;
  adFreeUntil?: string;
  canShowRewardedTips: boolean;
};
```

## 9.7 Layout esperado

Ordem visual:

```txt
1. Header com voltar
2. Nome do aparelho
3. Card principal com custo mensal gigante
4. Badge de impacto
5. Métricas secundárias
6. Texto explicativo
7. Ações principais
8. Aviso de estimativa
9. Card rewarded, se permitido
10. Banner, se permitido
```

## 9.8 Conteúdo principal

Exemplo:

```txt
Chuveiro
R$ 42,30
por mês
```

Métricas:

```txt
36,8 kWh/mês
R$ 1,41 por dia
R$ 507,60 por ano
```

Texto:

```txt
Este aparelho custa aproximadamente R$ 42,30 por mês.
```

Aviso:

```txt
Valor aproximado. Sua conta real pode variar.
```

## 9.9 Ações

| Ação | Resultado |
|---|---|
| Salvar | salva no histórico |
| Calcular outro | volta para Calcular |
| Comparar | abre Comparar |
| Editar dados | volta ao passo selecionado |
| Ver dicas | abre rewarded para dicas |

## 9.10 Estados

### Resultado recém-calculado

- Mostrar botão “Salvar”.
- Mostrar botão “Calcular outro”.
- Mostrar botão “Comparar”.

### Resultado já salvo

- Mostrar status “Cálculo salvo”.
- Botão “Salvar” pode virar “Salvo”.

### Histórico cheio

- Mostrar bloqueio leve:

```txt
Seu histórico grátis está cheio.
Assista um anúncio para liberar mais espaços por 24 horas.
```

### Dicas bloqueadas

- Mostrar `RewardedUnlockCard`:

```txt
Ver dicas de economia
Assista um anúncio para desbloquear dicas para este aparelho.
```

## 9.11 Anúncios permitidos

- Banner abaixo das ações.
- Rewarded para dicas.
- Intersticial apenas ao sair da tela, se permitido pelo cooldown.

## 9.12 Anúncios proibidos

- Qualquer anúncio antes do resultado principal.
- Banner acima do custo mensal.
- Intersticial antes do usuário ver o resultado.
- Ad cobrindo botões.

## 9.13 Critérios de aceitação

- Custo mensal é o maior elemento.
- Resultado aparece imediatamente.
- Salvar funciona.
- Comparar funciona.
- Aviso de estimativa aparece.
- Ads não atrapalham o resultado.
- Tema claro/escuro OK.
- Idiomas OK.
- Typecheck passa.

---

# 10. Screen Spec — Comparar

## 10.1 Imagem de referência

```txt
assets/screenshots-reference/07_compare.png
```

## 10.2 Rota

```txt
app/compare.tsx
```

## 10.3 Objetivo

Mostrar quais aparelhos têm maior custo mensal.

## 10.4 Função da tela

A tela deve responder:

```txt
Qual aparelho pesa mais na conta?
```

## 10.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `LargeNumber`
- `SimpleRankingList`
- `RankingBar`
- `AppButton`
- `RewardedUnlockCard`
- `BannerAdSlot`
- `EmptyState`
- `ConfirmDialog`

## 10.6 Dados necessários

```ts
type CompareScreenData = {
  simulations: SavedSimulation[];
  selectedSimulationIds: string[];
  expandedComparisonUntil?: string;
  isPremium: boolean;
};
```

## 10.7 Layout esperado

Ordem visual:

```txt
1. Header
2. Total mensal estimado
3. Conclusão textual
4. Ranking simples
5. Botão adicionar aparelho
6. Card rewarded se limite for atingido
7. Banner se permitido
```

## 10.8 Conteúdo

Exemplo:

```txt
Maiores gastos
Total: R$ 247,30/mês
O aparelho que mais pesa é: Ar-condicionado.
```

Ranking:

```txt
1. Ar-condicionado — R$ 162,00/mês
2. Chuveiro — R$ 64,80/mês
3. Geladeira — R$ 40,50/mês
```

## 10.9 Estados

### Sem dados suficientes

```txt
Simule pelo menos dois aparelhos para comparar.
[Adicionar aparelho]
```

### Comparação grátis

- Até 3 aparelhos.

### Limite atingido

```txt
Compare mais aparelhos por 24 horas.
Assista um anúncio para desbloquear.
```

### Comparação expandida ativa

- Até 10 aparelhos.
- Mostrar status discreto:

```txt
Comparação extra ativa até 18:20.
```

## 10.10 Ações

| Ação | Resultado |
|---|---|
| Adicionar aparelho | navega para Calcular |
| Tocar em item | abre Resultado |
| Remover item | remove da comparação |
| Limpar comparação | pede confirmação |
| Assistir anúncio | rewarded para expandir |

## 10.11 Anúncios permitidos

- Banner inferior.
- Rewarded para comparação expandida.
- Intersticial ao sair da comparação, se cooldown permitir.

## 10.12 Anúncios proibidos

- Intersticial ao entrar pela primeira vez.
- Banner cobrindo ranking.
- Rewarded obrigatório para comparar 2 ou 3 aparelhos.

## 10.13 Critérios de aceitação

- Mostra ranking ordenado por custo.
- Mostra conclusão textual.
- Funciona com 0, 1, 2 ou vários itens.
- Limite grátis funciona.
- Rewarded expande comparação.
- Tema claro/escuro OK.
- Idiomas OK.
- Typecheck passa.

---

# 11. Screen Spec — Histórico

## 11.1 Imagem de referência

```txt
assets/screenshots-reference/08_history.png
```

## 11.2 Rota

```txt
app/(tabs)/history.tsx
```

## 11.3 Objetivo

Exibir cálculos salvos.

## 11.4 Função da tela

A tela deve responder:

```txt
Quais cálculos eu já salvei?
```

## 11.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `SimulationHistoryItem`
- `EmptyState`
- `AppButton`
- `ConfirmDialog`
- `RewardedUnlockCard`
- `BannerAdSlot`

## 11.6 Dados necessários

```ts
type HistoryScreenData = {
  simulations: SavedSimulation[];
  freeLimit: number;
  extraHistorySlotsUntil?: string;
  isPremium: boolean;
};
```

## 11.7 Layout esperado

Ordem visual:

```txt
1. Header
2. Resumo curto
3. Lista de cálculos
4. Card de limite/extra, se necessário
5. Banner
```

## 11.8 Estado vazio

```txt
Nenhum cálculo salvo ainda.
Seus cálculos aparecerão aqui.
[Calcular agora]
```

## 11.9 Item de histórico

Cada item deve exibir:

```txt
Nome do aparelho
R$ X,XX/mês
Y kWh/mês
Data
```

Ações:

- Ver
- Recalcular
- Excluir

## 11.10 Limite gratuito

Grátis:

```txt
Até 5 cálculos salvos.
```

Rewarded:

```txt
Liberar +5 espaços por 24 horas.
```

## 11.11 Ações

| Ação | Resultado |
|---|---|
| Calcular agora | navega para Calcular |
| Ver | abre Resultado |
| Recalcular | abre Calcular com dados preenchidos |
| Excluir | abre confirmação |
| Assistir anúncio | libera mais espaços |

## 11.12 Anúncios permitidos

- Banner inferior.
- Rewarded para espaços extras.
- Intersticial ao abrir histórico após uso recorrente e cooldown.

## 11.13 Anúncios proibidos

- Intersticial após excluir.
- Banner cobrindo lista.
- Anúncio antes do primeiro cálculo salvo.

## 11.14 Critérios de aceitação

- Estado vazio funciona.
- Lista funciona com muitos itens.
- Excluir pede confirmação.
- Recalcular preserva dados.
- Limite grátis funciona.
- Rewarded libera espaços.
- Tema claro/escuro OK.
- Idiomas OK.
- Typecheck passa.

---

# 12. Screen Spec — Ajustes

## 12.1 Imagem de referência

```txt
assets/screenshots-reference/09_settings.png
```

## 12.2 Rota

```txt
app/(tabs)/settings.tsx
```

## 12.3 Objetivo

Permitir personalização básica e controle de dados.

## 12.4 Função da tela

A tela deve responder:

```txt
Como ajusto idioma, tema, tarifa e anúncios?
```

## 12.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `BigChoiceButton`
- `AppInput`
- `AppButton`
- `ConfirmDialog`
- `AdFreeCard`

## 12.6 Dados necessários

```ts
type SettingsScreenData = {
  locale: SupportedLocale;
  theme: AppTheme;
  defaultTariffPerKwh?: number;
  adFreeUntil?: string;
  appVersion: string;
};
```

## 12.7 Layout esperado

Ordem visual:

```txt
1. Header
2. Aparência
3. Idioma
4. Tarifa padrão
5. Anúncios
6. Dados
7. Sobre
```

## 12.8 Seção Aparência

Opções:

```txt
Automático
Claro
Escuro
```

Ação:

- Alterar tema imediatamente.
- Salvar preferência.

## 12.9 Seção Idioma

Opções:

```txt
Português
English
Español
Français
```

Ação:

- Alterar idioma imediatamente.
- Salvar preferência.

## 12.10 Seção Tarifa padrão

Campo:

```txt
Tarifa padrão
[0,90] R$/kWh
```

Ações:

- Salvar tarifa.
- Limpar tarifa.

## 12.11 Seção Anúncios

Estados:

### Sem remoção ativa

```txt
Remover anúncios por 30 min
Assista um anúncio e fique um tempo sem anúncios comuns.
```

### Remoção ativa

```txt
Sem anúncios até 15:40.
```

## 12.12 Seção Dados

Ações:

- Limpar histórico.

Confirmação:

```txt
Apagar histórico?
Essa ação não pode ser desfeita.
[Cancelar]
[Apagar]
```

## 12.13 Sobre

Exibir:

- Sobre o cálculo.
- Política de privacidade.
- Termos de uso.
- Versão do app.

## 12.14 Anúncios permitidos

- Banner inferior, se `adFreeUntil` expirado.
- Rewarded para remover anúncios.

## 12.15 Anúncios proibidos

- Intersticial ao abrir ajustes pela primeira vez.
- Anúncio cobrindo opções de idioma/tema.
- Rewarded sem explicação.

## 12.16 Critérios de aceitação

- Tema altera corretamente.
- Idioma altera corretamente.
- Tarifa salva.
- Limpar histórico exige confirmação.
- AdFreeCard funciona.
- Tela não fica poluída.
- Funciona em quatro idiomas.
- Funciona em tema claro/escuro.
- Typecheck passa.

---

# 13. Screen Spec — Desbloquear Extras

## 13.1 Imagem de referência

```txt
assets/screenshots-reference/10_unlock_extras.png
```

## 13.2 Rota

```txt
app/unlock.tsx
```

## 13.3 Objetivo

Centralizar recompensas por anúncios premiados e preparar premium futuro.

## 13.4 Função da tela

A tela deve responder:

```txt
Quais recursos posso desbloquear assistindo anúncio?
```

## 13.5 Componentes necessários

- `ScreenContainer`
- `AppHeader`
- `AppCard`
- `RewardedUnlockCard`
- `AdFreeCard`
- `AppButton`
- `BannerAdSlot`

## 13.6 Dados necessários

```ts
type UnlockScreenData = {
  adFreeUntil?: string;
  expandedComparisonUntil?: string;
  extraHistorySlotsUntil?: string;
  whatIfUnlockedUntil?: string;
  isPremium: boolean;
};
```

## 13.7 Layout esperado

Ordem visual:

```txt
1. Header
2. Explicação curta
3. Card remover anúncios
4. Card comparar mais aparelhos
5. Card salvar mais cálculos
6. Card dicas de economia
7. Card cenários "e se?"
8. Card PowerCost Plus futuro
```

## 13.8 Cards de recompensa

### Remover anúncios

```txt
Remover anúncios por 30 min
Assista um anúncio e fique sem banners e intersticiais comuns por um breve período.
```

### Comparar mais aparelhos

```txt
Comparar mais aparelhos
Libere comparação com até 10 aparelhos por 24 horas.
```

### Salvar mais cálculos

```txt
Salvar mais cálculos
Libere +5 espaços no histórico por 24 horas.
```

### Dicas de economia

```txt
Ver dicas de economia
Libere sugestões simples para reduzir o custo estimado.
```

### Cenário “e se?”

```txt
Cenários "e se?"
Teste mudanças de uso por 30 minutos.
```

## 13.9 Ações

| Ação | Resultado |
|---|---|
| Assistir anúncio para remover ads | define `adFreeUntil` |
| Assistir para comparação | define `expandedComparisonUntil` |
| Assistir para histórico | define `extraHistorySlotsUntil` |
| Assistir para dicas | libera dica no contexto atual, se aplicável |
| Assistir para cenário | define `whatIfUnlockedUntil` |
| Ver Plus | abre tela futura ou aviso |

## 13.10 Estados

### Recurso ativo

Mostrar até quando está ativo:

```txt
Ativo até 18:20.
```

### Anúncio falhou

```txt
Não foi possível carregar o anúncio agora.
```

### Premium ativo

- Ocultar cards desnecessários ou mostrar como já liberados.

## 13.11 Anúncios permitidos

- Rewarded em todos os cards.
- Banner inferior se não estiver em período sem anúncios.

## 13.12 Anúncios proibidos

- Intersticial comum dentro da tela de extras.
- Rewarded automático.
- Botão sem explicação de recompensa.

## 13.13 Critérios de aceitação

- Recompensas são claras.
- Usuário pode recusar.
- Falha de anúncio não trava a tela.
- Períodos temporários são salvos.
- Tema claro/escuro OK.
- Idiomas OK.
- Typecheck passa.

---

# 14. Estados globais obrigatórios

## 14.1 Loading

Usar quando:

- histórico carrega;
- cálculo salva;
- anúncio premiado carrega;
- configuração salva.

Texto:

```txt
Carregando...
```

## 14.2 Erro genérico

```txt
Algo deu errado.
[Tentar novamente]
```

## 14.3 Erro de armazenamento

```txt
Não foi possível salvar agora.
[Tentar novamente]
```

## 14.4 Erro de anúncio

```txt
Não foi possível carregar o anúncio agora.
[Tentar novamente]
[Agora não]
```

## 14.5 Empty state

Sempre incluir:

- ícone;
- título curto;
- texto curto;
- CTA claro, se aplicável.

---

# 15. Regras funcionais globais

## 15.1 Cálculo

```ts
consumptionKwhMonth = powerWatts * hoursPerDay * daysPerMonth / 1000;
costPerMonth = consumptionKwhMonth * tariffPerKwh;
costPerDay = costPerMonth / daysPerMonth;
costPerYear = costPerMonth * 12;
consumptionKwhYear = consumptionKwhMonth * 12;
```

## 15.2 Validação

- `powerWatts > 0`
- `hoursPerDay >= 0 && hoursPerDay <= 24`
- `daysPerMonth >= 1 && daysPerMonth <= 31`
- `tariffPerKwh > 0`

## 15.3 Formatação

- Moeda por locale.
- kWh com até 2 casas.
- Tarifa com decimal.
- Datas por locale.
- Textos por i18n.

---

# 16. Regras de monetização

## 16.1 Limites grátis

```txt
Histórico: 5 cálculos salvos
Comparação: 3 aparelhos
```

## 16.2 Rewarded

```txt
Remover anúncios comuns: 30 minutos
Comparação expandida: 24 horas
Espaços extras no histórico: 24 horas
Cenários "e se?": 30 minutos
Dicas de economia: contexto atual
```

## 16.3 Intersticial

Verificar antes:

```txt
hasSeenFirstResult === true
adFreeUntil expirado
cooldown respeitado
não está em formulário
não acabou de mostrar outro intersticial
```

---

# 17. Critérios gerais de aceite

O Codex só deve considerar a fase concluída se:

```txt
[ ] Todas as rotas abrem sem crash.
[ ] Cálculo principal funciona.
[ ] Resultado mensal é claro.
[ ] Histórico salva localmente.
[ ] Comparação funciona com limite grátis.
[ ] Rewarded ads desbloqueiam extras.
[ ] Remoção temporária de anúncios funciona.
[ ] Banner respeita áreas seguras.
[ ] Intersticial não aparece antes do primeiro resultado.
[ ] Tema claro funciona.
[ ] Tema escuro funciona.
[ ] Quatro idiomas funcionam.
[ ] Textos não estão hardcoded fora do i18n.
[ ] Layout funciona em celular pequeno.
[ ] Layout funciona em tablet.
[ ] Typecheck passa.
```

---

# 18. O que deve ser revisado após as imagens

Após gerar as imagens de referência, revisar este arquivo para:

- ajustar ordem dos cards;
- ajustar nomes dos arquivos de imagem;
- detalhar composição exata de cada tela;
- eliminar elementos que as imagens mostrarem como poluídos;
- alinhar CTAs aos layouts finais;
- definir posição final de banners;
- refinar estados visuais;
- refinar comportamento em tablet;
- preparar prompts seguros para Codex.

---

# 19. Próxima etapa

Após este arquivo, gerar imagens de referência em 9:16 para:

```txt
01_home.png
02_calculate_appliance.png
03_calculate_power.png
04_calculate_usage.png
05_calculate_tariff.png
06_result.png
07_compare.png
08_history.png
09_settings.png
10_unlock_extras.png
```

Depois, refazer este arquivo como:

```txt
docs/04_SCREEN_SPECS.md
```

com base nas imagens finais.
