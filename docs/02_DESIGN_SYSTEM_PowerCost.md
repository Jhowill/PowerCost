# 02_DESIGN_SYSTEM.md

# Design System — PowerCost

## 1. Identificação

**App:** PowerCost  
**Arquivo:** `docs/02_DESIGN_SYSTEM.md`  
**Fase:** 02 — Design System  
**Stack-alvo:** Expo + React Native + TypeScript + Expo Router  
**Foco:** app simples, acessível para idosos, multilíngue, claro/escuro e monetizado com anúncios comuns e premiados.

---

# 2. Direção visual do produto

O PowerCost deve parecer uma calculadora de economia doméstica, não uma planilha técnica.

A interface deve transmitir:

- simplicidade;
- confiança;
- economia;
- clareza;
- acessibilidade;
- controle financeiro;
- orientação passo a passo.

O usuário ideal precisa entender o que fazer sem pensar muito. O app deve funcionar para pessoas com baixa familiaridade digital, incluindo idosos.

## Regra principal

```txt
Uma tela, uma decisão principal.
```

Se a tela tiver muitas decisões ao mesmo tempo, ela deve ser dividida, simplificada ou transformada em passo guiado.

---

# 3. Personalidade visual

## 3.1 Atributos

| Atributo | Aplicação prática |
|---|---|
| Simples | poucos cards por tela, textos curtos e botões grandes |
| Confiável | números claros, cores estáveis, sem visual infantil |
| Econômico | verde como cor principal e amarelo como apoio energético |
| Didático | microtextos curtos explicando watts, kWh e tarifa |
| Acessível | contraste alto, área de toque grande e tipografia legível |
| Calmo | fundos suaves, espaçamento amplo e sem excesso visual |

## 3.2 O que evitar

- visual de planilha;
- telas lotadas;
- gráficos técnicos complexos;
- fonte pequena;
- botões próximos demais;
- cinza claro em texto importante;
- amarelo como texto principal;
- ícones sem texto;
- muitos CTAs na mesma tela;
- anúncios cobrindo o fluxo de cálculo;
- menus escondidos como única forma de navegação.

---

# 4. Princípios de acessibilidade para idosos

## 4.1 Leitura

- Texto comum nunca menor que 16 px.
- Texto principal recomendado: 18 px.
- Títulos entre 24 e 32 px.
- Resultado principal entre 44 e 56 px.
- Peso de fonte regular ou semibold.
- Evitar blocos com mais de 3 linhas.
- Evitar parágrafos longos.

## 4.2 Toque

- Altura mínima de botão: 56 px.
- Altura mínima de opção tocável: 52 px.
- Espaço mínimo entre botões: 12 px.
- Não depender de gestos escondidos.
- Não usar slider pequeno como controle principal.
- Preferir botões grandes para escolher tempo, aparelho e opções.

## 4.3 Compreensão

- Cada tela deve dizer claramente o que fazer.
- O botão principal deve ser evidente.
- Toda mensagem de erro deve dizer como corrigir.
- O app deve sempre permitir voltar.
- O app deve evitar termos técnicos sem explicação.

## 4.4 Contraste

- Texto principal deve ter alto contraste.
- Texto secundário deve continuar legível.
- Amarelo não deve ser usado para texto pequeno.
- Verde sobre fundo escuro deve ser claro o suficiente.
- Cards devem ter bordas ou contraste visível no modo escuro.

---

# 5. Paleta de cores

## 5.1 Conceito

A paleta usa:

- **verde** para economia, ação principal e confirmação;
- **amarelo** para energia, destaque leve e recompensa;
- **laranja** para atenção e alto gasto;
- **vermelho suave** para erro;
- **fundos calmos** para reduzir esforço visual.

---

# 6. Tema claro

## 6.1 Tokens principais

| Token | Valor | Uso |
|---|---:|---|
| `background` | `#F5FAF4` | fundo principal |
| `backgroundAlt` | `#ECF6EF` | fundo secundário |
| `surface` | `#FFFFFF` | cards e caixas |
| `surfaceSoft` | `#F8FCF8` | cards leves |
| `primary` | `#168A4A` | botão principal |
| `primaryPressed` | `#0F6B39` | botão pressionado |
| `primarySoft` | `#DFF5E8` | fundo de destaque verde |
| `secondary` | `#F5B82E` | energia, recompensa e detalhe visual |
| `secondarySoft` | `#FFF4D2` | fundo amarelo suave |
| `text` | `#17231B` | texto principal |
| `textMuted` | `#66736A` | texto secundário |
| `textOnPrimary` | `#FFFFFF` | texto sobre botão verde |
| `border` | `#DDE8DF` | borda de card e input |
| `borderStrong` | `#B8CDBE` | borda selecionada |
| `success` | `#168A4A` | sucesso |
| `warning` | `#D97706` | atenção e gasto médio |
| `danger` | `#C2410C` | erro e ação destrutiva |
| `info` | `#2563EB` | ajuda informativa |
| `adSurface` | `#FFF8E5` | card de anúncio premiado |
| `overlay` | `rgba(23, 35, 27, 0.45)` | modal |

---

# 7. Tema escuro

## 7.1 Tokens principais

| Token | Valor | Uso |
|---|---:|---|
| `background` | `#07130D` | fundo principal |
| `backgroundAlt` | `#0B1A12` | fundo secundário |
| `surface` | `#102018` | cards e caixas |
| `surfaceSoft` | `#14291E` | cards leves |
| `primary` | `#35C978` | botão principal |
| `primaryPressed` | `#1A9B55` | botão pressionado |
| `primarySoft` | `#123B25` | fundo de destaque verde |
| `secondary` | `#FACC15` | energia, recompensa e detalhe visual |
| `secondarySoft` | `#3A2D08` | fundo amarelo escuro |
| `text` | `#F3FFF6` | texto principal |
| `textMuted` | `#A8B8AD` | texto secundário |
| `textOnPrimary` | `#06100A` | texto sobre botão verde claro |
| `border` | `#254333` | borda de card e input |
| `borderStrong` | `#3F6B50` | borda selecionada |
| `success` | `#35C978` | sucesso |
| `warning` | `#F59E0B` | atenção e gasto médio |
| `danger` | `#FB923C` | erro e ação destrutiva |
| `info` | `#60A5FA` | ajuda informativa |
| `adSurface` | `#2C250E` | card de anúncio premiado |
| `overlay` | `rgba(0, 0, 0, 0.60)` | modal |

---

# 8. Cores semânticas de impacto

## 8.1 Baixo gasto

| Tema | Texto | Fundo |
|---|---:|---:|
| Claro | `#168A4A` | `#DFF5E8` |
| Escuro | `#35C978` | `#123B25` |

## 8.2 Gasto médio

| Tema | Texto | Fundo |
|---|---:|---:|
| Claro | `#B45309` | `#FFF4D2` |
| Escuro | `#FACC15` | `#3A2D08` |

## 8.3 Alto gasto

| Tema | Texto | Fundo |
|---|---:|---:|
| Claro | `#C2410C` | `#FFE7D6` |
| Escuro | `#FB923C` | `#3A160A` |

---

# 9. Tipografia

## 9.1 Família de fonte

Usar fonte padrão do sistema para evitar peso extra e garantir boa legibilidade:

```txt
iOS: San Francisco
Android: Roboto
Fallback: system font
```

Não adicionar fonte personalizada na V1, salvo necessidade real.

---

## 9.2 Escala tipográfica

| Token | Tamanho | Peso | Uso |
|---|---:|---:|---|
| `display` | 52 px | 700 | custo mensal na tela de resultado |
| `titleLarge` | 32 px | 700 | títulos principais |
| `title` | 28 px | 700 | títulos de tela |
| `subtitle` | 22 px | 600 | subtítulos e cards importantes |
| `bodyLarge` | 18 px | 400 | texto principal |
| `body` | 16 px | 400 | texto secundário |
| `button` | 18 px | 700 | botões principais |
| `caption` | 14 px | 400 | avisos e labels auxiliares |
| `small` | 12 px | 400 | uso raro; nunca para informação crítica |

## 9.3 Altura de linha

| Token | Line height |
|---|---:|
| `display` | 60 px |
| `titleLarge` | 38 px |
| `title` | 34 px |
| `subtitle` | 28 px |
| `bodyLarge` | 26 px |
| `body` | 24 px |
| `caption` | 20 px |

## 9.4 Regras

- Não usar texto menor que 14 px.
- Evitar caixa alta em frases longas.
- Evitar texto fino.
- Resultado principal deve sempre usar `display`.
- Labels de campos devem ser maiores que labels comuns em apps tradicionais.

---

# 10. Espaçamento

## 10.1 Tokens

| Token | Valor |
|---|---:|
| `xs` | 4 px |
| `sm` | 8 px |
| `md` | 12 px |
| `lg` | 16 px |
| `xl` | 24 px |
| `xxl` | 32 px |
| `xxxl` | 40 px |

## 10.2 Regras

- Padding horizontal padrão: 20 px.
- Padding em cards: 20 a 24 px.
- Espaço entre cards: 16 px.
- Espaço entre título e conteúdo: 16 px.
- Espaço entre botões empilhados: 12 px.
- Espaço inferior em telas com banner: mínimo de 80 px.
- Respeitar área segura em Android e iOS.

---

# 11. Raios de borda

| Token | Valor | Uso |
|---|---:|---|
| `sm` | 8 px | chips pequenos |
| `md` | 12 px | inputs |
| `lg` | 18 px | botões |
| `xl` | 24 px | cards principais |
| `pill` | 999 px | badges e chips arredondados |

---

# 12. Sombras e elevação

## 12.1 Tema claro

Cards principais:

```ts
shadowColor: '#000000'
shadowOpacity: 0.06
shadowRadius: 12
shadowOffset: { width: 0, height: 6 }
elevation: 2
```

## 12.2 Tema escuro

No tema escuro, preferir borda em vez de sombra:

```ts
borderWidth: 1
borderColor: theme.border
elevation: 0
```

## 12.3 Regras

- Não usar sombra pesada.
- Não usar efeito neon.
- Não usar glassmorphism.
- Não depender de sombra para separar elementos no modo escuro.

---

# 13. Ícones

## 13.1 Estilo

- Ícones simples.
- Traço arredondado.
- Sem detalhes excessivos.
- Sempre acompanhados de texto.
- Tamanho recomendado: 24 a 32 px.

## 13.2 Uso por categoria

| Categoria | Ícone sugerido |
|---|---|
| Chuveiro | shower/head |
| Geladeira | refrigerator |
| Ar-condicionado | snowflake |
| Ventilador | fan |
| Televisão | tv |
| Máquina de lavar | washing-machine |
| Computador | monitor |
| Lâmpada | lightbulb |
| Tarifa | receipt |
| Histórico | clock |
| Comparar | bar-chart |
| Ads premiado | gift/play |
| Configurações | settings |

## 13.3 Regras

- Não usar ícone sozinho como botão crítico.
- Não usar ícones muito parecidos para ações diferentes.
- Ícone de anúncio premiado deve parecer benefício, não punição.

---

# 14. Componentes globais

## 14.1 ScreenContainer

### Objetivo

Padronizar área segura, fundo, scroll e espaçamento.

### Regras

- Usar SafeAreaView.
- Usar ScrollView quando houver risco de conteúdo passar da tela.
- Aplicar padding horizontal padrão.
- Adicionar padding inferior quando houver banner.
- Suportar tema claro e escuro.

### Props sugeridas

```ts
type ScreenContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
  withBottomAdPadding?: boolean;
  centered?: boolean;
};
```

---

## 14.2 AppHeader

### Objetivo

Mostrar título da tela e ação de voltar quando necessário.

### Regras

- Título curto.
- Botão voltar visível em fluxos guiados.
- Não colocar muitas ações no header.
- Em idosos, preferir texto “Voltar” junto ao ícone.

### Props sugeridas

```ts
type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
};
```

---

## 14.3 AppCard

### Objetivo

Agrupar uma informação ou ação.

### Regras

- Um card deve ter um objetivo.
- Não colocar vários CTAs concorrentes dentro do mesmo card.
- Usar padding generoso.
- Evitar cards muito compactos.

### Estilo

| Propriedade | Valor |
|---|---|
| borderRadius | 24 px |
| padding | 20 px |
| background | `surface` |
| border | `border` |
| marginBottom | 16 px |

---

## 14.4 AppButton

### Variações

- `primary`
- `secondary`
- `outline`
- `ghost`
- `danger`
- `rewarded`

### Regra de tamanho

| Tamanho | Altura |
|---|---:|
| Grande | 60 px |
| Médio | 56 px |
| Pequeno | 48 px, evitar em ações principais |

### Primary

- Fundo: `primary`
- Texto: `textOnPrimary`
- Peso: 700
- Tamanho: 18 px
- Raio: 18 px

### Secondary

- Fundo: `primarySoft`
- Texto: `primary`
- Borda opcional.

### Outline

- Fundo: transparente.
- Borda: `borderStrong`.
- Texto: `text`.

### Ghost

- Fundo: transparente.
- Texto: `primary`.
- Usar apenas para ações secundárias.

### Danger

- Fundo: `danger`.
- Texto: branco no tema claro.
- Usar apenas para confirmação destrutiva.

### Rewarded

- Fundo: `secondary`.
- Texto: `#17231B`.
- Ícone: play ou presente.
- Texto deve indicar recompensa.

Exemplo:

```txt
Assistir anúncio
```

ou:

```txt
Remover anúncios por 30 min
```

---

## 14.5 BigChoiceButton

### Objetivo

Botão grande para escolha de aparelho, tempo de uso, idioma, tema ou opção simples.

### Estilo

- Altura mínima: 64 px.
- Ícone à esquerda.
- Texto grande.
- Subtexto opcional.
- Borda visível.
- Estado selecionado com borda verde e fundo suave.

### Uso

- Escolher aparelho.
- Escolher tempo de uso.
- Escolher tema.
- Escolher idioma.
- Escolher opção “Todos os dias” ou “Dias úteis”.

---

## 14.6 StepHeader

### Objetivo

Mostrar progresso do cálculo sem parecer técnico.

### Exemplo

```txt
Passo 2 de 4
Qual a potência?
```

### Componentes

- Texto pequeno: passo atual.
- Título grande.
- Barra de progresso simples.
- Ajuda curta opcional.

### Regras

- A barra não deve ser o elemento principal.
- O título da ação deve ser mais importante que o número do passo.

---

## 14.7 LargeNumber

### Objetivo

Exibir custo ou consumo com máxima clareza.

### Estilo

- Fonte: `display`.
- Peso: 700.
- Cor: `text`.
- Alinhamento central ou à esquerda conforme tela.
- Unidade abaixo em `bodyLarge`.

### Uso

- Resultado mensal.
- Total mensal na comparação.
- Custo anual se destacado.

---

## 14.8 AppInput

### Objetivo

Entrada numérica ou textual acessível.

### Estilo

- Altura mínima: 60 px.
- Fonte: 20 px para valor.
- Label acima.
- Unidade à direita quando necessário.
- Erro abaixo em linguagem simples.

### Exemplos

```txt
Potência
[ 1500 ] W
```

```txt
Tarifa
[ 0,90 ] R$/kWh
```

### Regras

- Usar teclado numérico para watts, horas, dias e tarifa.
- Não esconder unidade dentro do placeholder.
- Placeholder deve ser exemplo, não instrução crítica.

---

## 14.9 MetricCard

### Objetivo

Mostrar métricas secundárias no resultado.

### Exemplos

- `36,8 kWh/mês`
- `R$ 1,41 por dia`
- `R$ 507,60 por ano`

### Regras

- Métricas secundárias nunca podem competir visualmente com o custo mensal.
- Usar no máximo 3 MetricCards na tela de Resultado.

---

## 14.10 EmptyState

### Objetivo

Explicar estado vazio e guiar ação.

### Estrutura

- Ícone simples.
- Título curto.
- Texto curto.
- CTA opcional.

### Exemplo

```txt
Nenhum cálculo salvo
Seus cálculos aparecerão aqui.
[Calcular agora]
```

---

## 14.11 ConfirmDialog

### Objetivo

Confirmar ações importantes.

### Uso

- Limpar histórico.
- Excluir cálculo.
- Sair de cálculo não salvo.

### Regras

- Título claro.
- Texto curto.
- Botão destrutivo destacado apenas quando necessário.
- Botão “Cancelar” sempre visível.

---

## 14.12 Toast / Feedback

### Objetivo

Confirmar ações leves.

### Exemplos

```txt
Cálculo salvo.
```

```txt
Anúncios removidos por 30 minutos.
```

```txt
Não foi possível carregar o anúncio agora.
```

### Regras

- Duração curta.
- Não cobrir botão principal.
- Não usar para erros críticos de formulário.

---

# 15. Componentes de anúncios

## 15.1 BannerAdSlot

### Objetivo

Reservar espaço fixo para banner comum sem quebrar layout.

### Regras

- Sempre respeitar área segura inferior.
- Nunca ficar colado ao CTA principal.
- Nunca aparecer antes do primeiro resultado, se a regra do produto assim determinar.
- Se o anúncio não carregar, o espaço pode recolher.

### Altura reservada

```txt
50 a 70 px
```

---

## 15.2 RewardedUnlockCard

### Objetivo

Oferecer desbloqueio voluntário por anúncio premiado.

### Estrutura

- Ícone de presente ou play.
- Título do benefício.
- Explicação da duração.
- Botão “Assistir anúncio”.
- Texto menor: “Opcional”.

### Exemplo

```txt
Remover anúncios
Assista um anúncio e fique 30 minutos sem anúncios comuns.
[Assistir anúncio]
```

### Regras

- Recompensa deve estar clara antes do clique.
- Não usar linguagem enganosa.
- Sempre permitir recusar.
- Se falhar, explicar de forma simples.

---

## 15.3 AdFreeCard

### Objetivo

Mostrar status de período sem anúncios.

### Estados

- Inativo:
  - “Remover anúncios por 30 min”
- Ativo:
  - “Sem anúncios até 15:40”
- Falha:
  - “Não foi possível carregar o anúncio agora.”

---

## 15.4 InterstitialGate

### Objetivo

Controlar momentos de intersticial sem poluir telas.

### Regras visuais

- Não é um componente visual permanente.
- Deve respeitar cooldown.
- Nunca deve ser disparado durante digitação.
- Nunca deve aparecer antes do primeiro resultado.
- Nunca deve aparecer duas vezes seguidas.

---

# 16. Bottom tab

## 16.1 Abas

```txt
Início | Calcular | Histórico | Ajustes
```

## 16.2 Regras

- No máximo 4 abas.
- Ícone + texto.
- Texto sempre visível.
- Altura confortável.
- Contraste alto.
- Área segura respeitada.
- Comparação não deve ser aba fixa na V1.

## 16.3 Estilo

| Item | Tema claro | Tema escuro |
|---|---:|---:|
| Fundo | `surface` | `surface` |
| Aba ativa | `primary` | `primary` |
| Aba inativa | `textMuted` | `textMuted` |
| Borda superior | `border` | `border` |

---

# 17. Cards principais por tela

## 17.1 Início

### Card principal

- Título: “Veja quanto um aparelho custa por mês.”
- CTA: “Calcular agora.”
- Visual: destaque verde suave.
- Ícone: raio ou tomada.

### Cards secundários

- Último cálculo.
- Tarifa salva.
- Remover anúncios por 30 min, apenas após uso recorrente.

---

## 17.2 Calcular

### Card de escolha

- Um passo por vez.
- Botões grandes.
- Ajuda curta.
- Sem banner no meio do formulário.
- Sem intersticial durante preenchimento.

---

## 17.3 Resultado

### Card principal

- Custo mensal gigante.
- Nome do aparelho.
- Badge de impacto.
- Texto resumido.
- Aviso de estimativa.

### Cards secundários

- Consumo mensal.
- Custo diário.
- Custo anual.

### Card de anúncio premiado

- Dicas de economia.
- Cenários “e se?”.
- Não deve aparecer antes do resultado principal.

---

## 17.4 Comparação

### Card principal

- Total mensal estimado.
- Conclusão em texto.
- Ranking simples.

### Card de anúncio premiado

- Comparar mais aparelhos por 24 horas.

---

## 17.5 Histórico

### Card de item

- Nome do aparelho.
- Custo mensal.
- Data.
- Ações pequenas, mas legíveis:
  - Ver
  - Recalcular
  - Excluir

---

## 17.6 Configurações

### Cards

- Aparência.
- Idioma.
- Tarifa.
- Anúncios.
- Dados.
- Sobre.

---

# 18. Formulários

## 18.1 Regra principal

Não mostrar potência, horas, dias e tarifa todos juntos no primeiro contato.

O fluxo guiado deve manter uma pergunta por etapa.

## 18.2 Ordem de entrada

```txt
Aparelho → Potência → Tempo de uso → Tarifa → Resultado
```

## 18.3 Erros

### Potência

```txt
Digite uma potência maior que zero.
```

### Horas

```txt
Use um valor entre 0 e 24 horas.
```

### Dias

```txt
Digite um número entre 1 e 31 dias.
```

### Tarifa

```txt
Digite uma tarifa maior que zero.
```

## 18.4 Ajuda curta

### Potência

```txt
A potência costuma estar na etiqueta do aparelho.
```

### Tarifa

```txt
A tarifa aparece na sua conta de luz.
```

### Estimativa

```txt
Valor aproximado. Sua conta real pode variar.
```

---

# 19. Estados visuais

## 19.1 Loading

### Uso

- Carregar histórico.
- Carregar anúncio.
- Salvar cálculo.

### Visual

- Indicador simples.
- Texto claro.
- Nunca deixar tela vazia sem explicação.

Exemplo:

```txt
Carregando...
```

---

## 19.2 Erro

### Visual

- Ícone simples.
- Texto direto.
- Botão de tentar novamente, se aplicável.

Exemplo:

```txt
Não foi possível salvar agora.
[Tentar novamente]
```

---

## 19.3 Sucesso

### Visual

- Toast ou mensagem curta.
- Não bloquear fluxo.

Exemplo:

```txt
Cálculo salvo.
```

---

## 19.4 Premium ou extra bloqueado

### Visual

- Card claro.
- Benefício explicado.
- Opções:
  - assistir anúncio;
  - continuar grátis;
  - futuro Plus.

Exemplo:

```txt
Você pode comparar até 3 aparelhos grátis.
Assista um anúncio para comparar mais por 24 horas.
```

---

# 20. Linguagem visual por impacto

## 20.1 Baixo gasto

- Verde.
- Mensagem calma.

```txt
Baixo gasto
Este aparelho tem pouco impacto na conta.
```

## 20.2 Gasto médio

- Amarelo/laranja.
- Mensagem neutra.

```txt
Gasto médio
Vale acompanhar o tempo de uso.
```

## 20.3 Alto gasto

- Laranja forte.
- Mensagem objetiva, sem alarmismo.

```txt
Alto gasto
Este aparelho pode pesar bastante na conta.
```

---

# 21. Internacionalização visual

## 21.1 Idiomas

O app deve suportar:

```txt
pt-BR
en-US
es-ES
fr-FR
```

## 21.2 Regras de layout para idiomas

- Botões devem aceitar textos 30% maiores.
- Cards devem expandir verticalmente.
- Não fixar altura em textos traduzidos.
- Evitar frases longas em CTAs.
- Não concatenar frases manualmente.
- Unidade e valor devem ser formatados por locale.

## 21.3 CTAs principais

| Chave | pt-BR | en-US | es-ES | fr-FR |
|---|---|---|---|---|
| `calculateNow` | Calcular agora | Calculate now | Calcular ahora | Calculer |
| `continue` | Continuar | Continue | Continuar | Continuer |
| `seeResult` | Ver resultado | See result | Ver resultado | Voir le résultat |
| `save` | Salvar | Save | Guardar | Enregistrer |
| `watchAd` | Assistir anúncio | Watch ad | Ver anuncio | Voir l’annonce |
| `settings` | Ajustes | Settings | Ajustes | Réglages |

## 21.4 Textos curtos por padrão

Não usar textos extensos em botões. Usar explicações no card.

---

# 22. Componentes de idioma

## 22.1 LanguageOption

### Uso

Tela de Configurações.

### Estrutura

- Nome do idioma no próprio idioma.
- Subtexto opcional.
- Estado selecionado.

Exemplo:

```txt
Português
Brasil
```

```txt
English
United States
```

```txt
Español
España
```

```txt
Français
France
```

---

# 23. Componentes de tema

## 23.1 ThemeOption

### Opções

- Automático.
- Claro.
- Escuro.

### Regras

- Usar texto + ícone.
- Mostrar opção selecionada claramente.
- Aplicar mudança imediatamente.
- Salvar preferência local.

---

# 24. Layout mobile-first

## 24.1 Largura base

Pensar primeiro em telas de 360 px a 430 px de largura.

## 24.2 Tablets

Em tablets:

- limitar largura máxima do conteúdo a 620 px;
- centralizar conteúdo;
- não esticar botões demais;
- manter resultado grande;
- permitir cards em duas colunas apenas para métricas secundárias.

## 24.3 Celular pequeno

Em celulares pequenos:

- manter scroll;
- reduzir espaçamentos verticais, mas não reduzir fonte abaixo do mínimo;
- manter CTA principal visível no final do conteúdo;
- evitar telas sem scroll quando houver anúncio.

---

# 25. Hierarquia de tela

## 25.1 Ordem padrão

```txt
1. Header simples
2. Pergunta ou objetivo da tela
3. Conteúdo principal
4. Ajuda curta
5. CTA principal
6. Ação secundária
7. Anúncio, se permitido
```

## 25.2 Resultado

```txt
1. Nome do aparelho
2. Custo mensal gigante
3. Explicação curta
4. Métricas secundárias
5. Ações
6. Aviso de estimativa
7. Ads extras, se permitido
```

---

# 26. Regras para anúncios no layout

## 26.1 Banner

Permitido:

- início após uso recorrente;
- histórico;
- configurações;
- comparação;
- abaixo das ações na tela de resultado.

Proibido:

- antes do primeiro resultado;
- no meio do formulário;
- colado ao botão principal;
- cobrindo campos;
- em cima do resultado mensal.

## 26.2 Intersticial

Permitido:

- após salvar cálculo;
- após concluir mais de um cálculo;
- ao voltar para início depois do resultado;
- ao abrir histórico após frequência mínima.

Proibido:

- no primeiro uso;
- antes do primeiro cálculo;
- durante preenchimento;
- entre passo 1, 2, 3 e 4 da tela Calcular;
- dois intersticiais em sequência.

## 26.3 Rewarded

Permitido:

- desbloquear comparação expandida;
- liberar +5 espaços no histórico;
- remover anúncios por 30 minutos;
- liberar dicas de economia;
- liberar cenários “e se?”.

Obrigatório:

- explicar recompensa antes;
- ter botão de recusar;
- tratar falha;
- entregar recompensa após conclusão.

---

# 27. Componentes por domínio

## 27.1 UI base

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

## 27.2 Cálculo

```txt
src/components/calculation/
  AppliancePicker.tsx
  PowerStep.tsx
  UsageStep.tsx
  TariffStep.tsx
  ResultSummary.tsx
```

## 27.3 Anúncios

```txt
src/components/ads/
  BannerAdSlot.tsx
  RewardedUnlockCard.tsx
  AdFreeCard.tsx
```

## 27.4 Histórico

```txt
src/components/history/
  SimulationHistoryItem.tsx
```

## 27.5 Comparação

```txt
src/components/comparison/
  SimpleRankingList.tsx
  RankingBar.tsx
```

---

# 28. Tokens em TypeScript

## 28.1 colors.ts

```ts
export const lightColors = {
  background: '#F5FAF4',
  backgroundAlt: '#ECF6EF',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FCF8',
  primary: '#168A4A',
  primaryPressed: '#0F6B39',
  primarySoft: '#DFF5E8',
  secondary: '#F5B82E',
  secondarySoft: '#FFF4D2',
  text: '#17231B',
  textMuted: '#66736A',
  textOnPrimary: '#FFFFFF',
  border: '#DDE8DF',
  borderStrong: '#B8CDBE',
  success: '#168A4A',
  warning: '#D97706',
  danger: '#C2410C',
  info: '#2563EB',
  adSurface: '#FFF8E5',
};

export const darkColors = {
  background: '#07130D',
  backgroundAlt: '#0B1A12',
  surface: '#102018',
  surfaceSoft: '#14291E',
  primary: '#35C978',
  primaryPressed: '#1A9B55',
  primarySoft: '#123B25',
  secondary: '#FACC15',
  secondarySoft: '#3A2D08',
  text: '#F3FFF6',
  textMuted: '#A8B8AD',
  textOnPrimary: '#06100A',
  border: '#254333',
  borderStrong: '#3F6B50',
  success: '#35C978',
  warning: '#F59E0B',
  danger: '#FB923C',
  info: '#60A5FA',
  adSurface: '#2C250E',
};
```

---

## 28.2 spacing.ts

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};
```

---

## 28.3 typography.ts

```ts
export const typography = {
  display: {
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '700' as const,
  },
  titleLarge: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
};
```

---

# 29. Regras de implementação para Codex

## 29.1 Obrigatório

- Usar tokens do design system.
- Não criar cores soltas dentro das telas.
- Não criar fonte menor que o permitido.
- Não criar tela cheia de cards.
- Não colocar texto fixo fora do i18n.
- Não colocar anúncio antes do primeiro resultado.
- Usar componentes globais.
- Preservar tema claro/escuro.
- Preservar acessibilidade.
- Rodar typecheck.

## 29.2 Proibido

- Criar dashboard complexo.
- Criar gráficos avançados.
- Criar premium antes da função básica.
- Colocar anúncio entre os passos do cálculo.
- Usar slider como entrada principal para idosos.
- Criar cinco ou mais abas.
- Usar ícone sem label em ação importante.
- Criar CTAs concorrentes.

---

# 30. Checklist de revisão visual

Antes de aprovar qualquer tela:

```txt
[ ] O usuário sabe o que fazer em 5 segundos?
[ ] Existe apenas um CTA principal?
[ ] O texto é grande o suficiente?
[ ] Os botões têm área de toque confortável?
[ ] A tela funciona em modo claro?
[ ] A tela funciona em modo escuro?
[ ] O conteúdo funciona em português, inglês, espanhol e francês?
[ ] O anúncio não bloqueia a ação principal?
[ ] O resultado principal está evidente?
[ ] O texto evita termos técnicos desnecessários?
[ ] O layout funciona em celular pequeno?
[ ] O layout funciona em tablet?
```

---

# 31. Direção para imagens das telas

Quando gerar imagens de referência, usar:

```txt
mobile app screen, 9:16, clean energy cost calculator, elderly-friendly interface, large buttons, large numbers, green economy color palette, yellow energy accent, soft rounded cards, clear hierarchy, accessible typography, light mode, React Native feasible layout, premium but simple
```

Para modo escuro:

```txt
dark mode mobile app screen, clean energy cost calculator, high contrast, elderly-friendly, large buttons, large numbers, dark green background, bright green primary button, yellow energy accent, rounded cards, simple hierarchy, React Native feasible layout
```

## 31.1 Regra para imagens

As imagens devem seguir o design system, mas a especificação técnica deve corrigir qualquer excesso visual, texto redundante ou elemento difícil de implementar.

---

# 32. Resumo final

O design system do PowerCost deve garantir que o app seja simples, claro e acessível. O visual precisa apoiar a promessa principal: calcular o custo mensal de um aparelho com poucos toques.

A prioridade é legibilidade, botões grandes, fluxo guiado, resultado evidente, tema claro/escuro consistente e suporte real a quatro idiomas. Os anúncios fazem parte do modelo de negócio, mas devem ser posicionados de forma controlada para não bloquear a primeira experiência nem prejudicar o cálculo principal.
