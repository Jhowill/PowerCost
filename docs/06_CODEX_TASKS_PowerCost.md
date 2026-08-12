# 06_CODEX_TASKS.md

# Codex Tasks — PowerCost

## 1. Identificação

**App:** PowerCost  
**Arquivo:** `docs/06_CODEX_TASKS.md`  
**Fase:** 06 — Codex Tasks  
**Stack-alvo:** Expo + React Native + TypeScript + Expo Router  
**Persistência V1:** AsyncStorage  
**Monetização:** AdMob comum + AdMob rewarded + premium futuro preparado  
**Temas:** claro, escuro e sistema  
**Idiomas:** português, inglês, espanhol e francês  
**Foco de produto:** app simples, acessível para idosos, com botões grandes, fluxo guiado e poucos campos por tela.

---

# 2. Objetivo deste arquivo

Este documento define as missões que o Codex deve executar para implementar o PowerCost de forma controlada.

A regra é:

```txt
Uma tarefa por vez.
Uma mudança por vez.
Typecheck ao final de cada tarefa.
```

O Codex não deve tentar construir o app inteiro de uma vez.

---

# 3. Documentos obrigatórios de referência

Antes de qualquer implementação, o Codex deve ler:

```txt
PROJECT_GUIDE.md
docs/01_APP_BLUEPRINT.md
docs/02_DESIGN_SYSTEM.md
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
docs/05_DATA_MODEL.md
docs/06_CODEX_TASKS.md
```

Se os arquivos tiverem nomes com sufixo, copiar ou renomear para a estrutura oficial:

```txt
docs/01_APP_BLUEPRINT.md
docs/02_DESIGN_SYSTEM.md
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
docs/05_DATA_MODEL.md
docs/06_CODEX_TASKS.md
```

---

# 4. Imagens obrigatórias de referência

O pacote de imagens deve estar em:

```txt
assets/screenshots-reference/
```

Arquivos esperados:

```txt
01_home.png
02_calculate_appliance.png
03_calculate_power.png
04_calculate_usage_tariff.png
05_result.png
06_history.png
07_compare.png
08_settings.png
09_unlock_extras.png
```

Também podem existir imagens auxiliares:

```txt
00_contact_sheet_light.png
00_contact_sheet_dark.png
10_navigation_flow.png
11_ui_components.png
12_states_and_ads.png
```

---

# 5. Regras globais para o Codex

## 5.1 Obrigatório

- Usar TypeScript.
- Evitar `any`.
- Preservar Expo Router.
- Usar componentes globais.
- Usar tokens do design system.
- Usar i18n para todos os textos.
- Suportar tema claro, escuro e sistema.
- Manter app funcional offline para cálculo e histórico.
- Não bloquear cálculo básico com anúncio.
- Não mostrar anúncio comum antes do primeiro resultado.
- Não mostrar anúncio entre os passos do cálculo.
- Rodar typecheck ao final.
- Corrigir imports quebrados.
- Remover imports não usados.
- Não criar funções fora do blueprint.

## 5.2 Proibido

- Criar login.
- Criar dashboard complexo.
- Criar OCR da conta de luz.
- Criar integração com concessionária.
- Criar IA conversacional.
- Criar PDF na V1.
- Criar gráficos avançados.
- Criar tela premium funcional antes do app básico.
- Implementar compra real antes da base estar pronta.
- Inserir anúncios sobre campos, botões ou resultado principal.
- Criar mais telas sem atualizar os docs.
- Escrever textos fixos diretamente nas telas.
- Misturar storage dentro da UI.
- Misturar cálculo dentro de componente visual.

---

# 6. Comandos padrão

## 6.1 Typecheck

Sempre tentar:

```bash
npm run typecheck
```

Se não existir:

```bash
npx tsc --noEmit
```

Se não houver script, criar ou sugerir:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

## 6.2 Lint

Se existir:

```bash
npm run lint
```

## 6.3 Expo

Se necessário:

```bash
npx expo start --clear
```

## 6.4 Build futura

Não rodar build pesada nas primeiras tarefas.  
Só usar na fase final:

```bash
npx eas-cli build --platform android --profile production
```

---

# 7. Ordem oficial de implementação

```txt
00. Auditoria inicial
01. Normalizar docs e assets
02. Base TypeScript e estrutura
03. Design tokens e tema
04. i18n
05. Data model, constantes e cálculos
06. Storage local
07. Componentes globais
08. Rotas e navegação
09. Tela Home
10. Fluxo Calcular
11. Tela Resultado
12. Histórico
13. Comparação
14. Configurações
15. Ads state e placeholders seguros
16. AdMob comum e rewarded
17. Desbloquear Extras
18. Polimento de acessibilidade
19. Auditoria final
20. Preparação de build
```

---

# TASK 00 — Auditoria inicial sem alterar arquivos

## Objetivo

Analisar o projeto existente sem alterar nada.

## Arquivos permitidos

Nenhum arquivo deve ser alterado.

## Arquivos proibidos

Todos.

## Referências

```txt
PROJECT_GUIDE.md
docs/01_APP_BLUEPRINT.md
docs/02_DESIGN_SYSTEM.md
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Você é um dev sênior em Expo, React Native, TypeScript e Expo Router.

Faça uma auditoria inicial do projeto sem alterar arquivos.

Leia:
- PROJECT_GUIDE.md
- docs/01_APP_BLUEPRINT.md
- docs/02_DESIGN_SYSTEM.md
- docs/03_USER_FLOW.md
- docs/04_SCREEN_SPECS.md
- docs/05_DATA_MODEL.md

Entregue:
1. estrutura atual do projeto;
2. stack encontrada;
3. arquivos ausentes;
4. riscos de arquitetura;
5. conflitos com os documentos;
6. dependências relevantes já instaladas;
7. scripts disponíveis no package.json;
8. primeira tarefa segura de implementação.

Regras:
- não altere arquivos;
- não instale dependências;
- não refatore;
- não crie código;
- apenas analise e entregue relatório objetivo.
```

## Critérios de aceitação

```txt
[ ] Nenhum arquivo foi alterado.
[ ] Estrutura do projeto foi mapeada.
[ ] Scripts disponíveis foram identificados.
[ ] Riscos foram listados.
[ ] Próxima tarefa segura foi indicada.
```

---

# TASK 01 — Normalizar docs e assets

## Objetivo

Garantir que os documentos e imagens estejam nos caminhos oficiais.

## Arquivos permitidos

```txt
docs/
assets/screenshots-reference/
PROJECT_GUIDE.md
```

## Arquivos proibidos

```txt
app/
src/
package.json
```

## Referências

```txt
PROJECT_GUIDE.md
docs/06_CODEX_TASKS.md
```

## Prompt para Codex

```md
Organize apenas os documentos e assets de referência do projeto PowerCost.

Faça:
1. garantir que exista a pasta docs/;
2. garantir que os documentos estejam com nomes oficiais:
   - docs/01_APP_BLUEPRINT.md
   - docs/02_DESIGN_SYSTEM.md
   - docs/03_USER_FLOW.md
   - docs/04_SCREEN_SPECS.md
   - docs/05_DATA_MODEL.md
   - docs/06_CODEX_TASKS.md
3. garantir que exista assets/screenshots-reference/;
4. mover ou copiar as imagens de referência para:
   - assets/screenshots-reference/01_home.png
   - assets/screenshots-reference/02_calculate_appliance.png
   - assets/screenshots-reference/03_calculate_power.png
   - assets/screenshots-reference/04_calculate_usage_tariff.png
   - assets/screenshots-reference/05_result.png
   - assets/screenshots-reference/06_history.png
   - assets/screenshots-reference/07_compare.png
   - assets/screenshots-reference/08_settings.png
   - assets/screenshots-reference/09_unlock_extras.png

Regras:
- não altere app/;
- não altere src/;
- não altere package.json;
- não implemente código;
- não renomeie imagens se já estiverem corretas;
- se algum arquivo não existir, apenas relate.
```

## Critérios de aceitação

```txt
[ ] docs/ existe.
[ ] assets/screenshots-reference/ existe.
[ ] Documentos principais estão com nomes oficiais ou ausência relatada.
[ ] Imagens estão organizadas ou ausência relatada.
[ ] Nenhum código foi alterado.
```

---

# TASK 02 — Estrutura base TypeScript

## Objetivo

Criar a estrutura de pastas e arquivos base sem implementar telas.

## Arquivos permitidos

```txt
src/
  types/
  constants/
  utils/
  services/
  hooks/
  components/
```

## Arquivos proibidos

```txt
app/
assets/
docs/
```

## Prompt para Codex

```md
Crie apenas a estrutura base de código do PowerCost.

Leia:
- PROJECT_GUIDE.md
- docs/01_APP_BLUEPRINT.md
- docs/05_DATA_MODEL.md

Crie as pastas:
- src/types
- src/constants
- src/utils
- src/services
- src/hooks
- src/components/ui
- src/components/calculation
- src/components/history
- src/components/comparison
- src/components/ads
- src/i18n

Regras:
- não implemente telas;
- não altere rotas;
- não adicione dependências;
- não mexa em app/;
- se já existir estrutura parecida, reaproveite;
- não duplique arquivos;
- mantenha TypeScript.
```

## Critérios de aceitação

```txt
[ ] Estrutura de pastas existe.
[ ] Não houve alteração em app/.
[ ] Não foram criadas telas.
[ ] Não houve dependência nova.
[ ] Typecheck não piorou.
```

---

# TASK 03 — Types e constantes do Data Model

## Objetivo

Implementar os tipos e constantes principais do arquivo 05.

## Arquivos permitidos

```txt
src/types/
src/constants/
```

## Arquivos proibidos

```txt
app/
src/components/
src/services/
src/hooks/
```

## Referências

```txt
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Implemente apenas os types e constants do PowerCost com base no Data Model.

Leia:
- docs/05_DATA_MODEL.md

Crie ou atualize:
- src/types/appliance.ts
- src/types/simulation.ts
- src/types/settings.ts
- src/types/ads.ts
- src/types/premium.ts
- src/types/i18n.ts
- src/types/storage.ts
- src/constants/applianceCatalog.ts
- src/constants/appLimits.ts
- src/constants/adRules.ts
- src/constants/storageKeys.ts
- src/constants/locales.ts

Regras:
- não implemente UI;
- não implemente hooks;
- não implemente storage ainda;
- evitar any;
- usar exports consistentes;
- não criar dependências novas;
- limpar imports;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Tipos principais existem.
[ ] Catálogo inicial de aparelhos existe.
[ ] Limites grátis existem.
[ ] Regras de ads existem.
[ ] Chaves de storage existem.
[ ] Locales existem.
[ ] Typecheck passa ou erros existentes foram relatados.
```

---

# TASK 04 — Cálculos, validações e formatadores

## Objetivo

Implementar lógica pura e testável para cálculo, validação e formatação.

## Arquivos permitidos

```txt
src/utils/energyCalculations.ts
src/utils/validators.ts
src/utils/formatters.ts
src/utils/dates.ts
src/types/
src/constants/
```

## Arquivos proibidos

```txt
app/
src/components/
src/hooks/
src/services/
```

## Referências

```txt
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Implemente apenas as funções utilitárias puras do PowerCost.

Leia:
- docs/05_DATA_MODEL.md

Crie ou atualize:
- src/utils/energyCalculations.ts
- src/utils/validators.ts
- src/utils/formatters.ts
- src/utils/dates.ts

Faça:
1. calculateEnergyCost;
2. getImpactLevel;
3. validações de potência, horas, dias e tarifa;
4. formatCurrency;
5. formatKwh;
6. formatTariff;
7. formatDateShort.

Regras:
- funções puras;
- não acessar storage;
- não acessar UI;
- não acessar SDK de ads;
- não arredondar internamente o cálculo;
- arredondamento apenas na formatação;
- evitar any;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Cálculo kWh funciona.
[ ] Custo mensal funciona.
[ ] Custo diário e anual funcionam.
[ ] Impact level funciona.
[ ] Validações retornam erros por chave i18n.
[ ] Formatadores respeitam locale.
[ ] Typecheck passa.
```

---

# TASK 05 — i18n básico em quatro idiomas

## Objetivo

Criar sistema de traduções para português, inglês, espanhol e francês.

## Arquivos permitidos

```txt
src/i18n/
src/types/i18n.ts
src/constants/locales.ts
src/hooks/useAppLocale.ts
src/services/settingsStorage.ts
```

## Arquivos proibidos

```txt
app/
src/components/
```

## Referências

```txt
docs/02_DESIGN_SYSTEM.md
docs/03_USER_FLOW.md
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Implemente a base de i18n do PowerCost.

Leia:
- docs/02_DESIGN_SYSTEM.md
- docs/03_USER_FLOW.md
- docs/05_DATA_MODEL.md

Crie:
- src/i18n/index.ts
- src/i18n/pt-BR.ts
- src/i18n/en-US.ts
- src/i18n/es-ES.ts
- src/i18n/fr-FR.ts
- src/hooks/useAppLocale.ts

Inclua traduções iniciais para:
- Home
- Calcular
- Resultado
- Histórico
- Comparar
- Configurações
- Desbloquear Extras
- Erros
- Ads
- Categorias
- Aparelhos

Regras:
- nenhuma tela ainda;
- não hardcodar textos futuros;
- suportar params simples;
- fallback para pt-BR;
- evitar dependência nova se possível;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Quatro arquivos de idioma existem.
[ ] Hook de locale existe.
[ ] Fallback funciona.
[ ] Chaves principais existem.
[ ] Typecheck passa.
```

---

# TASK 06 — Tema claro/escuro e tokens visuais

## Objetivo

Implementar tokens visuais e hook de tema.

## Arquivos permitidos

```txt
src/constants/colors.ts
src/constants/spacing.ts
src/constants/typography.ts
src/hooks/useAppTheme.ts
src/types/settings.ts
src/services/settingsStorage.ts
```

## Arquivos proibidos

```txt
app/
src/components/
```

## Referências

```txt
docs/02_DESIGN_SYSTEM.md
```

## Prompt para Codex

```md
Implemente a base visual global do PowerCost sem criar telas.

Leia:
- docs/02_DESIGN_SYSTEM.md

Crie ou atualize:
- src/constants/colors.ts
- src/constants/spacing.ts
- src/constants/typography.ts
- src/hooks/useAppTheme.ts

Faça:
1. tokens de tema claro;
2. tokens de tema escuro;
3. spacing;
4. radius;
5. typography;
6. hook useAppTheme com system/light/dark.

Regras:
- não criar componentes ainda;
- não alterar telas;
- não usar cores fora dos tokens;
- manter tipografia acessível para idosos;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Tokens claros existem.
[ ] Tokens escuros existem.
[ ] Spacing e radius existem.
[ ] Typography existe.
[ ] useAppTheme existe.
[ ] Typecheck passa.
```

---

# TASK 07 — Storage local

## Objetivo

Implementar camada de persistência local com AsyncStorage.

## Arquivos permitidos

```txt
src/services/settingsStorage.ts
src/services/historyStorage.ts
src/services/adsStateStorage.ts
src/services/migrationService.ts
src/services/premiumService.ts
src/types/
src/constants/storageKeys.ts
```

## Arquivos proibidos

```txt
app/
src/components/
```

## Referências

```txt
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Implemente a camada de storage local do PowerCost.

Leia:
- docs/05_DATA_MODEL.md

Crie ou atualize:
- src/services/settingsStorage.ts
- src/services/historyStorage.ts
- src/services/adsStateStorage.ts
- src/services/migrationService.ts
- src/services/premiumService.ts

Faça:
1. leitura e escrita de AppSettings;
2. leitura e escrita de HistoryState;
3. leitura e escrita de AdsState;
4. premium local mock;
5. envelopes com schemaVersion;
6. fallback seguro se storage estiver vazio ou corrompido.

Regras:
- telas não acessam AsyncStorage diretamente;
- não implementar UI;
- não implementar AdMob real;
- tratar erros sem quebrar app;
- evitar any;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Settings storage funciona.
[ ] History storage funciona.
[ ] Ads state storage funciona.
[ ] Premium mock existe.
[ ] Storage usa versionamento.
[ ] Falhas têm fallback.
[ ] Typecheck passa.
```

---

# TASK 08 — Hooks de domínio

## Objetivo

Implementar hooks que conectam lógica, storage e estado.

## Arquivos permitidos

```txt
src/hooks/
src/services/
src/utils/
src/types/
src/constants/
```

## Arquivos proibidos

```txt
app/
src/components/
```

## Referências

```txt
docs/05_DATA_MODEL.md
docs/03_USER_FLOW.md
```

## Prompt para Codex

```md
Implemente os hooks de domínio do PowerCost.

Leia:
- docs/03_USER_FLOW.md
- docs/05_DATA_MODEL.md

Crie ou atualize:
- src/hooks/useCalculation.ts
- src/hooks/useHistory.ts
- src/hooks/useTariff.ts
- src/hooks/useAdsAccess.ts
- src/hooks/usePremium.ts

Regras:
- hooks devem usar services e utils;
- telas futuras devem consumir hooks;
- não implementar UI;
- não implementar SDK real de anúncios ainda;
- useAdsAccess deve usar estado local e regras de cooldown;
- usePremium pode ser mock local;
- evitar any;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] useCalculation calcula e valida.
[ ] useHistory salva/lista/exclui.
[ ] useTariff carrega/salva tarifa.
[ ] useAdsAccess controla recompensas temporárias.
[ ] usePremium retorna estado mock.
[ ] Typecheck passa.
```

---

# TASK 09 — Componentes globais de UI

## Objetivo

Criar componentes reutilizáveis com base no Design System.

## Arquivos permitidos

```txt
src/components/ui/
src/constants/
src/hooks/useAppTheme.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/
src/components/calculation/
src/components/history/
src/components/comparison/
src/components/ads/
```

## Referências

```txt
docs/02_DESIGN_SYSTEM.md
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/11_ui_components.png
```

## Prompt para Codex

```md
Implemente apenas os componentes globais de UI do PowerCost.

Leia:
- docs/02_DESIGN_SYSTEM.md
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/11_ui_components.png

Crie:
- src/components/ui/ScreenContainer.tsx
- src/components/ui/AppHeader.tsx
- src/components/ui/AppCard.tsx
- src/components/ui/AppButton.tsx
- src/components/ui/AppInput.tsx
- src/components/ui/BigChoiceButton.tsx
- src/components/ui/StepHeader.tsx
- src/components/ui/LargeNumber.tsx
- src/components/ui/MetricCard.tsx
- src/components/ui/EmptyState.tsx
- src/components/ui/ConfirmDialog.tsx

Regras:
- não implementar telas;
- usar tokens de tema;
- suportar claro/escuro;
- usar tamanhos acessíveis;
- não hardcodar cores;
- não criar dependência nova sem necessidade;
- manter props tipadas;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Componentes existem.
[ ] Componentes usam tokens.
[ ] Componentes suportam tema.
[ ] Botões têm altura acessível.
[ ] Inputs têm unidade visível.
[ ] Typecheck passa.
```

---

# TASK 10 — Rotas e navegação base

## Objetivo

Configurar rotas do Expo Router sem implementar telas completas.

## Arquivos permitidos

```txt
app/
src/constants/routes.ts
```

## Arquivos proibidos

```txt
src/services/
src/utils/
src/types/
```

## Referências

```txt
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/10_navigation_flow.png
```

## Prompt para Codex

```md
Configure a navegação base do PowerCost com Expo Router.

Leia:
- docs/03_USER_FLOW.md
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/10_navigation_flow.png

Crie ou ajuste:
- app/_layout.tsx
- app/(tabs)/_layout.tsx
- app/(tabs)/index.tsx
- app/(tabs)/calculate.tsx
- app/(tabs)/history.tsx
- app/(tabs)/settings.tsx
- app/result.tsx
- app/compare.tsx
- app/unlock.tsx
- src/constants/routes.ts

Regras:
- criar telas placeholder simples;
- não implementar lógica completa ainda;
- tabs oficiais: Início, Calcular, Histórico, Ajustes;
- Comparar e Unlock ficam fora das tabs;
- garantir que rotas abram sem crash;
- usar textos via i18n se possível;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Rotas oficiais existem.
[ ] Bottom tabs funcionam.
[ ] Result, Compare e Unlock abrem.
[ ] Não há rota quebrada.
[ ] Typecheck passa.
```

---

# TASK 11 — Tela Home

## Objetivo

Implementar a Home fiel à imagem e aos specs.

## Arquivos permitidos

```txt
app/(tabs)/index.tsx
src/components/ui/
src/components/ads/
src/hooks/
src/i18n/
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/historyStorage.ts
src/services/settingsStorage.ts
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/01_home.png
```

## Prompt para Codex

```md
Implemente somente a tela Home do PowerCost.

Leia:
- docs/02_DESIGN_SYSTEM.md
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/01_home.png

Rota:
- app/(tabs)/index.tsx

Faça:
- título PowerCost;
- subtítulo simples;
- card principal com CTA "Calcular agora";
- cards de Histórico e Comparar;
- card de dica;
- navegação para Calcular, Histórico e Comparar;
- respeitar tema claro/escuro;
- usar i18n.

Regras:
- não implementar cálculo;
- não alterar outras telas;
- não mostrar anúncio antes do primeiro resultado;
- não criar dashboard;
- manter layout acessível para idosos;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Home visualmente segue imagem.
[ ] CTA principal navega para Calcular.
[ ] Cards secundários navegam corretamente.
[ ] Sem anúncio agressivo no primeiro uso.
[ ] Tema claro/escuro OK.
[ ] i18n OK.
[ ] Typecheck passa.
```

---

# TASK 12 — Fluxo Calcular

## Objetivo

Implementar os três passos de cálculo.

## Arquivos permitidos

```txt
app/(tabs)/calculate.tsx
src/components/calculation/
src/components/ui/
src/hooks/useCalculation.ts
src/hooks/useTariff.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/result.tsx
app/compare.tsx
app/unlock.tsx
src/services/adsService.ts
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/02_calculate_appliance.png
assets/screenshots-reference/03_calculate_power.png
assets/screenshots-reference/04_calculate_usage_tariff.png
```

## Prompt para Codex

```md
Implemente somente o fluxo Calcular do PowerCost.

Leia:
- docs/03_USER_FLOW.md
- docs/04_SCREEN_SPECS.md
- imagens:
  - assets/screenshots-reference/02_calculate_appliance.png
  - assets/screenshots-reference/03_calculate_power.png
  - assets/screenshots-reference/04_calculate_usage_tariff.png

Rota:
- app/(tabs)/calculate.tsx

Faça:
1. Passo 1 — escolher aparelho;
2. Passo 2 — informar potência;
3. Passo 3 — informar uso e tarifa;
4. validações por passo;
5. navegação para Resultado com dados calculáveis;
6. botão voltar entre passos.

Regras:
- não mostrar anúncios durante o cálculo;
- não usar slider;
- botões grandes;
- campos numéricos acessíveis;
- usar i18n;
- usar componentes globais;
- não alterar Resultado ainda;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Passo 1 seleciona aparelho.
[ ] Passo 2 valida potência.
[ ] Passo 3 valida uso e tarifa.
[ ] Erros são claros.
[ ] Botões são grandes.
[ ] Não há anúncio entre passos.
[ ] Ao concluir, navega para Resultado.
[ ] Typecheck passa.
```

---

# TASK 13 — Tela Resultado

## Objetivo

Implementar resultado claro com custo mensal grande.

## Arquivos permitidos

```txt
app/result.tsx
src/components/calculation/ResultSummary.tsx
src/components/ui/
src/hooks/useHistory.ts
src/hooks/useAdsAccess.ts
src/utils/formatters.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
app/(tabs)/history.tsx
app/compare.tsx
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/05_result.png
```

## Prompt para Codex

```md
Implemente somente a tela Resultado do PowerCost.

Leia:
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/05_result.png

Rota:
- app/result.tsx

Faça:
- mostrar aparelho;
- mostrar dados usados;
- mostrar custo mensal em número grande;
- mostrar consumo mensal;
- mostrar custo diário;
- mostrar custo anual;
- aviso de valor aproximado;
- botão Salvar no histórico;
- botão Calcular outro;
- marcação de primeiro resultado visto;
- salvar cálculo usando useHistory.

Regras:
- não mostrar anúncio antes do resultado;
- banner só abaixo das ações, se permitido;
- não alterar fluxo Calcular;
- usar formatadores;
- usar i18n;
- manter visual simples;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Custo mensal é o maior elemento.
[ ] Métricas secundárias aparecem.
[ ] Aviso de estimativa aparece.
[ ] Salvar funciona.
[ ] Calcular outro funciona.
[ ] hasSeenFirstResult é atualizado.
[ ] Ads não cobrem resultado.
[ ] Typecheck passa.
```

---

# TASK 14 — Histórico

## Objetivo

Implementar histórico local de cálculos salvos.

## Arquivos permitidos

```txt
app/(tabs)/history.tsx
src/components/history/
src/components/ui/
src/hooks/useHistory.ts
src/hooks/useAdsAccess.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
app/result.tsx
app/compare.tsx
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/06_history.png
```

## Prompt para Codex

```md
Implemente somente a tela Histórico do PowerCost.

Leia:
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/06_history.png

Rota:
- app/(tabs)/history.tsx

Faça:
- listar cálculos salvos;
- ordenar do mais recente para o mais antigo;
- estado vazio;
- abrir Resultado ao tocar em item;
- excluir cálculo com confirmação;
- botão Calcular agora no estado vazio;
- respeitar limite grátis de histórico;
- mostrar opção rewarded para mais espaços quando limite for atingido.

Regras:
- não alterar cálculo;
- não alterar Resultado;
- não mostrar intersticial logo após excluir;
- banner apenas se permitido;
- usar i18n;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Histórico lista cálculos.
[ ] Estado vazio funciona.
[ ] Itens abrem Resultado.
[ ] Excluir pede confirmação.
[ ] Limite grátis é respeitado.
[ ] Rewarded para mais espaços aparece quando necessário.
[ ] Typecheck passa.
```

---

# TASK 15 — Comparação

## Objetivo

Implementar ranking simples de aparelhos por custo mensal.

## Arquivos permitidos

```txt
app/compare.tsx
src/components/comparison/
src/components/ui/
src/hooks/useHistory.ts
src/hooks/useAdsAccess.ts
src/utils/formatters.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
app/result.tsx
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/07_compare.png
```

## Prompt para Codex

```md
Implemente somente a tela Comparar do PowerCost.

Leia:
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/07_compare.png

Rota:
- app/compare.tsx

Faça:
- ranking ordenado por custo mensal;
- total mensal estimado;
- conclusão textual com maior gasto;
- estado vazio se houver menos de dois cálculos;
- botão Adicionar mais para comparar;
- limite grátis de 3 aparelhos;
- rewarded para liberar até 10 aparelhos por 24 horas.

Regras:
- não criar gráfico complexo;
- usar barras simples;
- não bloquear comparação básica;
- usar i18n;
- respeitar tema;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Ranking ordena corretamente.
[ ] Total mensal aparece.
[ ] Maior gasto aparece em texto.
[ ] Estado vazio funciona.
[ ] Limite grátis funciona.
[ ] Rewarded expande comparação.
[ ] Typecheck passa.
```

---

# TASK 16 — Configurações

## Objetivo

Implementar ajustes de idioma, tema, tarifa padrão e anúncios.

## Arquivos permitidos

```txt
app/(tabs)/settings.tsx
src/components/ui/
src/components/ads/
src/hooks/useAppLocale.ts
src/hooks/useAppTheme.ts
src/hooks/useTariff.ts
src/hooks/useAdsAccess.ts
src/services/settingsStorage.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
app/result.tsx
app/compare.tsx
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/08_settings.png
```

## Prompt para Codex

```md
Implemente somente a tela Configurações do PowerCost.

Leia:
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/08_settings.png

Rota:
- app/(tabs)/settings.tsx

Faça:
- seção Geral;
- idioma atual e troca de idioma;
- tema atual e troca de tema;
- tarifa padrão editável;
- seção Anúncios com remover anúncios por 30 min;
- seção Outros;
- Sobre o cálculo;
- Política de privacidade;
- Termos de uso;
- Versão do app.

Regras:
- não implementar compra premium;
- rewarded para remover anúncios pode usar placeholder se AdMob ainda não existir;
- não mostrar intersticial ao trocar idioma/tema;
- usar i18n;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Idioma troca.
[ ] Tema troca.
[ ] Tarifa padrão salva.
[ ] Remover anúncios por 30 min chama fluxo adequado.
[ ] Links institucionais não quebram app.
[ ] Typecheck passa.
```

---

# TASK 17 — Ads placeholders seguros

## Objetivo

Criar camada segura de anúncios sem integrar SDK real ainda.

## Arquivos permitidos

```txt
src/components/ads/
src/services/adsService.ts
src/hooks/useAdsAccess.ts
src/constants/adRules.ts
src/types/ads.ts
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
app/result.tsx
app/(tabs)/history.tsx
app/compare.tsx
app/unlock.tsx
```

## Referências

```txt
docs/01_APP_BLUEPRINT.md
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Implemente uma camada de anúncios segura em modo placeholder.

Leia:
- docs/03_USER_FLOW.md
- docs/04_SCREEN_SPECS.md
- docs/05_DATA_MODEL.md

Crie ou ajuste:
- src/services/adsService.ts
- src/components/ads/BannerAdSlot.tsx
- src/components/ads/RewardedUnlockCard.tsx
- src/components/ads/AdFreeCard.tsx
- src/hooks/useAdsAccess.ts

Faça:
- BannerAdSlot visual placeholder;
- rewarded mock que simula sucesso;
- controle de adFreeUntil;
- controle de expandedComparisonUntil;
- controle de extraHistorySlotsUntil;
- controle de whatIfUnlockedUntil;
- controle de tipsUnlockedSimulationIds;
- função de canShowBanner;
- função de canShowInterstitial.

Regras:
- não integrar AdMob real ainda;
- não mostrar anúncio durante cálculo;
- não mostrar anúncio antes do primeiro resultado;
- rewarded deve ser voluntário;
- fallback de erro precisa existir;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Banner placeholder existe.
[ ] Rewarded mock existe.
[ ] Recompensas temporárias funcionam.
[ ] adFreeUntil remove banners/intersticiais comuns.
[ ] Regras impedem ads antes do primeiro resultado.
[ ] Typecheck passa.
```

---

# TASK 18 — Tela Desbloquear Extras

## Objetivo

Implementar tela central de benefícios por anúncios premiados.

## Arquivos permitidos

```txt
app/unlock.tsx
src/components/ads/
src/components/ui/
src/hooks/useAdsAccess.ts
src/i18n/
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
app/result.tsx
src/services/historyStorage.ts
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/09_unlock_extras.png
```

## Prompt para Codex

```md
Implemente somente a tela Desbloquear Extras do PowerCost.

Leia:
- docs/04_SCREEN_SPECS.md
- imagem: assets/screenshots-reference/09_unlock_extras.png

Rota:
- app/unlock.tsx

Faça cards para:
- remover anúncios por 30 minutos;
- comparar mais aparelhos por 24 horas;
- salvar mais cálculos por 24 horas;
- ver dicas de economia;
- usar cenários "e se?";
- PowerCost Plus em breve.

Regras:
- rewarded sempre voluntário;
- explicar recompensa antes;
- mostrar estado ativo até horário;
- tratar falha de anúncio;
- não usar intersticial comum nesta tela;
- usar i18n;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Todos os cards aparecem.
[ ] Rewarded mock libera benefícios.
[ ] Estados ativos aparecem.
[ ] Falha não trava tela.
[ ] Plus aparece como futuro.
[ ] Typecheck passa.
```

---

# TASK 19 — Integrar banners nas telas permitidas

## Objetivo

Exibir BannerAdSlot apenas onde permitido.

## Arquivos permitidos

```txt
app/(tabs)/index.tsx
app/result.tsx
app/(tabs)/history.tsx
app/compare.tsx
app/(tabs)/settings.tsx
app/unlock.tsx
src/components/ads/
src/hooks/useAdsAccess.ts
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
src/utils/
src/services/historyStorage.ts
```

## Referências

```txt
docs/04_SCREEN_SPECS.md
```

## Prompt para Codex

```md
Integre BannerAdSlot nas telas permitidas do PowerCost.

Leia:
- docs/04_SCREEN_SPECS.md

Permitido:
- Home após primeiro resultado;
- Resultado abaixo das ações;
- Histórico;
- Comparar;
- Configurações;
- Desbloquear Extras.

Proibido:
- qualquer passo do Calcular;
- antes do primeiro resultado;
- acima do custo mensal;
- cobrindo bottom tab;
- colado ao botão principal.

Regras:
- respeitar adFreeUntil;
- respeitar safe area;
- recolher espaço se banner não puder aparecer;
- não integrar AdMob real ainda, salvo se já existir;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Banner não aparece em Calcular.
[ ] Banner não aparece antes do primeiro resultado.
[ ] Banner respeita adFreeUntil.
[ ] Banner não cobre ações.
[ ] Typecheck passa.
```

---

# TASK 20 — Intersticial com controle de frequência

## Objetivo

Implementar gatilhos de intersticial comum de forma segura.

## Arquivos permitidos

```txt
src/hooks/useAdsAccess.ts
src/services/adsService.ts
src/constants/adRules.ts
app/result.tsx
app/(tabs)/history.tsx
app/compare.tsx
```

## Arquivos proibidos

```txt
app/(tabs)/calculate.tsx
```

## Referências

```txt
docs/03_USER_FLOW.md
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Implemente controle de intersticial comum em modo seguro.

Leia:
- docs/03_USER_FLOW.md
- docs/05_DATA_MODEL.md

Faça:
- canShowInterstitial;
- markInterstitialShown;
- cooldown de 3 minutos;
- mínimo de 2 cálculos entre intersticiais;
- bloqueio antes do primeiro resultado;
- bloqueio durante adFreeUntil;
- mock de showInterstitial.

Gatilhos permitidos:
- após salvar cálculo;
- ao voltar do resultado para início;
- ao abrir histórico após uso recorrente;
- ao sair de comparação.

Regras:
- nunca em Calcular;
- nunca antes do primeiro resultado;
- nunca dois seguidos;
- se falhar, seguir fluxo normal sem erro visível;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Intersticial respeita cooldown.
[ ] Não aparece antes do primeiro resultado.
[ ] Não aparece durante adFreeUntil.
[ ] Não aparece em Calcular.
[ ] Falha não bloqueia usuário.
[ ] Typecheck passa.
```

---

# TASK 21 — Integração real AdMob

## Objetivo

Substituir placeholders por SDK real de anúncios, se o projeto estiver pronto.

## Arquivos permitidos

```txt
src/services/adsService.ts
src/components/ads/
app.json
app.config.ts
package.json
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/historyStorage.ts
app/(tabs)/calculate.tsx
```

## Dependência possível

A biblioteca depende da stack definida no projeto.  
Usar apenas se compatível.

Exemplos possíveis:

```txt
react-native-google-mobile-ads
expo-compatible ads setup
```

## Prompt para Codex

```md
Integre AdMob real apenas se o projeto já estiver pronto para isso.

Antes:
1. verifique a stack;
2. verifique se o pacote de ads já existe;
3. verifique se há IDs de teste;
4. não use IDs reais nesta etapa.

Faça:
- Banner real usando ID de teste;
- Interstitial real usando ID de teste;
- Rewarded real usando ID de teste;
- fallback se anúncio não carregar;
- manter regras de bloqueio antes do primeiro resultado;
- manter adFreeUntil;
- manter rewarded voluntário.

Regras:
- se a dependência não existir, explique o que precisa instalar e pare;
- não inventar IDs reais;
- não bloquear cálculo básico;
- não alterar cálculo;
- não exibir ads em Calcular;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] IDs de teste são usados.
[ ] Banner real funciona ou fallback existe.
[ ] Rewarded entrega recompensa após conclusão.
[ ] Interstitial respeita cooldown.
[ ] Ads não aparecem em Calcular.
[ ] Typecheck passa.
```

---

# TASK 22 — Acessibilidade e responsividade

## Objetivo

Auditar e ajustar layout para idosos, celular pequeno e tablet.

## Arquivos permitidos

```txt
app/
src/components/
src/constants/typography.ts
src/constants/spacing.ts
src/constants/colors.ts
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/
```

## Referências

```txt
docs/02_DESIGN_SYSTEM.md
docs/04_SCREEN_SPECS.md
assets/screenshots-reference/00_contact_sheet_light.png
assets/screenshots-reference/00_contact_sheet_dark.png
```

## Prompt para Codex

```md
Faça auditoria e ajustes de acessibilidade e responsividade.

Leia:
- docs/02_DESIGN_SYSTEM.md
- docs/04_SCREEN_SPECS.md
- imagens:
  - assets/screenshots-reference/00_contact_sheet_light.png
  - assets/screenshots-reference/00_contact_sheet_dark.png

Verifique:
1. tamanho mínimo de fonte;
2. botões com altura mínima de 56px;
3. área de toque adequada;
4. contraste em tema claro;
5. contraste em tema escuro;
6. tela pequena com scroll;
7. tablet com largura máxima adequada;
8. textos longos em inglês/espanhol/francês;
9. anúncios não cobrindo CTA.

Regras:
- corrigir apenas problemas reais;
- não mudar escopo;
- não criar nova tela;
- não alterar cálculo;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Botões são acessíveis.
[ ] Textos são legíveis.
[ ] Tema claro e escuro funcionam.
[ ] Layout não quebra em celular pequeno.
[ ] Layout não fica exagerado em tablet.
[ ] Ads não cobrem ações.
[ ] Typecheck passa.
```

---

# TASK 23 — Auditoria de i18n

## Objetivo

Garantir que não existam textos fixos fora das traduções.

## Arquivos permitidos

```txt
app/
src/components/
src/i18n/
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/
```

## Prompt para Codex

```md
Faça auditoria de i18n no PowerCost.

Verifique:
- textos hardcoded em telas;
- textos hardcoded em componentes;
- chaves ausentes nos quatro idiomas;
- botões com texto longo quebrando layout;
- mensagens de erro traduzidas;
- textos de anúncios traduzidos.

Corrija:
- mover textos para i18n;
- adicionar chaves faltantes;
- manter frases curtas.

Regras:
- não alterar lógica de cálculo;
- não alterar storage;
- não criar dependência nova;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Textos principais usam i18n.
[ ] Quatro idiomas têm chaves.
[ ] Erros são traduzidos.
[ ] Ads são traduzidos.
[ ] Typecheck passa.
```

---

# TASK 24 — Auditoria de ads

## Objetivo

Garantir que a monetização agressiva não quebre regras do produto.

## Arquivos permitidos

```txt
app/
src/components/ads/
src/hooks/useAdsAccess.ts
src/services/adsService.ts
src/constants/adRules.ts
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/historyStorage.ts
```

## Referências

```txt
docs/01_APP_BLUEPRINT.md
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
docs/05_DATA_MODEL.md
```

## Prompt para Codex

```md
Faça auditoria completa dos anúncios do PowerCost.

Verifique:
1. nenhum anúncio comum antes do primeiro resultado;
2. nenhum anúncio no fluxo Calcular;
3. banner não cobre CTA;
4. banner não aparece acima do resultado;
5. intersticial respeita cooldown;
6. intersticial não aparece em sequência;
7. rewarded é sempre voluntário;
8. rewarded explica recompensa antes;
9. falha de anúncio não trava usuário;
10. adFreeUntil remove banners e intersticiais;
11. rewarded ainda pode aparecer voluntariamente durante adFreeUntil.

Corrija apenas problemas reais.

Regras:
- não alterar cálculo;
- não alterar histórico;
- não criar tela nova;
- rodar typecheck.
```

## Critérios de aceitação

```txt
[ ] Ads respeitam primeira experiência.
[ ] Ads não aparecem em Calcular.
[ ] Rewarded é voluntário.
[ ] adFreeUntil funciona.
[ ] Cooldown funciona.
[ ] Typecheck passa.
```

---

# TASK 25 — Auditoria final antes de build

## Objetivo

Revisar o app inteiro antes de gerar build.

## Arquivos permitidos

```txt
app/
src/
docs/
package.json
app.json
app.config.ts
```

## Referências

```txt
PROJECT_GUIDE.md
docs/01_APP_BLUEPRINT.md
docs/02_DESIGN_SYSTEM.md
docs/03_USER_FLOW.md
docs/04_SCREEN_SPECS.md
docs/05_DATA_MODEL.md
docs/06_CODEX_TASKS.md
```

## Prompt para Codex

```md
Faça uma auditoria final do PowerCost antes da build.

Leia:
- PROJECT_GUIDE.md
- docs/01_APP_BLUEPRINT.md
- docs/02_DESIGN_SYSTEM.md
- docs/03_USER_FLOW.md
- docs/04_SCREEN_SPECS.md
- docs/05_DATA_MODEL.md
- docs/06_CODEX_TASKS.md

Verifique:
1. rotas quebradas;
2. imports quebrados;
3. componentes duplicados;
4. lógica espalhada;
5. textos fora do i18n;
6. tema claro;
7. tema escuro;
8. tela pequena;
9. tablet;
10. cálculo;
11. histórico;
12. comparação;
13. configurações;
14. ads;
15. storage;
16. limites grátis;
17. rewarded;
18. typecheck.

Corrija apenas problemas reais.

Regras:
- não mudar design sem necessidade;
- não criar recurso novo;
- não criar login;
- não mexer no escopo;
- rodar typecheck;
- se existir lint, rodar lint.
```

## Critérios de aceitação

```txt
[ ] Rotas funcionam.
[ ] Typecheck passa.
[ ] Não há texto hardcoded relevante.
[ ] Cálculo funciona.
[ ] Histórico funciona.
[ ] Comparação funciona.
[ ] Ads respeitam regras.
[ ] Tema claro/escuro funciona.
[ ] App está pronto para build.
```

---

# TASK 26 — Preparação de build Android

## Objetivo

Preparar a primeira build Android de teste.

## Arquivos permitidos

```txt
app.json
app.config.ts
package.json
eas.json
assets/
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/historyStorage.ts
```

## Prompt para Codex

```md
Prepare o PowerCost para primeira build Android de teste.

Faça:
1. verificar app.json ou app.config.ts;
2. verificar nome do app;
3. verificar slug;
4. verificar package Android;
5. verificar ícone;
6. verificar splash;
7. verificar eas.json;
8. garantir que scripts principais existem;
9. rodar typecheck;
10. se possível, preparar comando EAS.

Regras:
- não alterar lógica do app;
- não alterar design das telas;
- não colocar IDs reais de ads sem confirmação;
- não publicar;
- apenas preparar build.
```

## Critérios de aceitação

```txt
[ ] Config Android existe.
[ ] EAS está preparado ou pendências foram listadas.
[ ] Typecheck passa.
[ ] Nenhuma lógica foi alterada.
```

---

# TASK 27 — Preparação de build iOS

## Objetivo

Preparar a primeira build iOS de teste.

## Arquivos permitidos

```txt
app.json
app.config.ts
package.json
eas.json
assets/
```

## Arquivos proibidos

```txt
src/utils/energyCalculations.ts
src/services/historyStorage.ts
```

## Prompt para Codex

```md
Prepare o PowerCost para primeira build iOS de teste.

Faça:
1. verificar app.json ou app.config.ts;
2. verificar nome do app;
3. verificar bundle identifier;
4. verificar ícone;
5. verificar splash;
6. verificar permissões;
7. verificar configuração de ads se aplicável;
8. verificar eas.json;
9. rodar typecheck.

Regras:
- não publicar;
- não alterar lógica do app;
- não colocar IDs reais de ads sem confirmação;
- não adicionar permissão desnecessária;
- apenas preparar build.
```

## Critérios de aceitação

```txt
[ ] Config iOS existe.
[ ] Bundle identifier está definido.
[ ] Ícone/splash conferidos.
[ ] Typecheck passa.
[ ] Pendências são listadas.
```

---

# 8. Prompt curto para continuar qualquer tarefa

Use este bloco no começo de cada conversa com Codex:

```md
# Contexto Atual do Projeto

Nome do app: PowerCost
Stack: Expo + React Native + TypeScript + Expo Router
Fase atual: [informar fase]
Objetivo desta conversa: [informar tarefa]
Arquivos principais:
- PROJECT_GUIDE.md
- docs/01_APP_BLUEPRINT.md
- docs/02_DESIGN_SYSTEM.md
- docs/03_USER_FLOW.md
- docs/04_SCREEN_SPECS.md
- docs/05_DATA_MODEL.md
- docs/06_CODEX_TASKS.md

Imagens:
- assets/screenshots-reference/[imagem da tela]

O que já está pronto:
- [listar]

O que NÃO deve ser alterado:
- [listar]

Critério de sucesso:
- [listar]
```

---

# 9. Protocolo anti-escopo para Codex

Antes de aceitar qualquer ideia nova, classificar:

```txt
A. essencial para V1
B. bom para V1, mas não obrigatório
C. premium futuro
D. pós-lançamento
E. descartar
```

Só entra na V1 se for:

```txt
A. essencial para calcular custo mensal de aparelhos
```

Exemplos:

| Ideia | Classificação |
|---|---|
| calcular custo mensal | A |
| histórico simples | A |
| comparação simples | A |
| tema claro/escuro | A |
| quatro idiomas | A |
| anúncios premiados | A |
| OCR da conta de luz | D |
| login | D |
| PDF | D |
| IA personalizada | D |
| smart plug | D |
| ranking online | E |

---

# 10. Definition of Done geral

Uma tarefa só termina quando:

```txt
[ ] implementou apenas o combinado;
[ ] não criou recurso fora do escopo;
[ ] não quebrou rotas;
[ ] não quebrou tema claro;
[ ] não quebrou tema escuro;
[ ] não removeu i18n;
[ ] não colocou anúncio em lugar proibido;
[ ] não misturou lógica com UI;
[ ] não deixou imports mortos;
[ ] não deixou erro de TypeScript;
[ ] rodou typecheck ou informou por que não foi possível.
```

---

# 11. Ordem recomendada para economizar créditos

## Rodadas pequenas

Usar uma tarefa por conversa com Codex.

Exemplo:

```txt
Rodada 1: Auditoria
Rodada 2: Types e constants
Rodada 3: Cálculos e validações
Rodada 4: Tema e i18n
Rodada 5: Componentes globais
Rodada 6: Home
Rodada 7: Calcular
Rodada 8: Resultado
Rodada 9: Histórico
Rodada 10: Comparar
Rodada 11: Ads
Rodada 12: Auditoria
```

## Evitar

```txt
"Crie o app inteiro"
"Melhore tudo"
"Refatore tudo"
"Implemente todas as telas e ads"
"Faça funcionar sem olhar os docs"
```

---

# 12. Próximo arquivo recomendado

Após o arquivo 06, criar:

```txt
docs/07_RELEASE_CHECKLIST.md
```

O próximo documento deve conter:

- checklist de build;
- checklist Android;
- checklist iOS;
- checklist de privacidade;
- checklist de AdMob;
- checklist de App Store;
- checklist de Play Store;
- textos obrigatórios;
- erros comuns antes da publicação.
