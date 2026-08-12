# 01_APP_BLUEPRINT.md

# App Blueprint — PowerCost

## Versão do documento

**Arquivo:** `docs/01_APP_BLUEPRINT.md`  
**App:** PowerCost  
**Foco desta versão:** app extremamente simples, acessível para idosos, multilíngue e com monetização forte por anúncios comuns e anúncios premiados.  
**Stack recomendada:** Expo + React Native + TypeScript + Expo Router  
**Persistência:** Local-first com AsyncStorage na V1  
**Idiomas obrigatórios:** Português, Inglês, Espanhol e Francês  
**Temas obrigatórios:** Claro, escuro e sistema  

---

# 1. Resumo executivo

O **PowerCost** é um app simples para estimar quanto um aparelho elétrico gasta por mês na conta de energia.

A proposta desta versão é reduzir ao máximo a complexidade. O app deve funcionar bem até para usuários idosos, com:

- botões grandes;
- textos curtos;
- poucos campos por tela;
- números grandes;
- fluxo guiado;
- ícones claros;
- linguagem simples;
- modo claro e escuro;
- suporte a português, inglês, espanhol e francês;
- cálculo rápido sem login;
- monetização forte com anúncios comuns e anúncios premiados.

O app não deve parecer uma planilha, um painel técnico ou um sistema profissional de energia. Ele deve parecer uma calculadora simples, confiável e fácil.

---

# 2. Frase central do produto

```txt
PowerCost ajuda qualquer pessoa a descobrir quanto um aparelho elétrico custa por mês, usando potência, horas de uso e tarifa de energia.
```

---

# 3. Promessa principal

> Descubra quanto cada aparelho pesa na sua conta de luz.

---

# 4. Promessa simplificada para loja

## Português

> Calcule o gasto mensal dos seus aparelhos em poucos toques.

## Inglês

> Calculate the monthly cost of your appliances in just a few taps.

## Espanhol

> Calcula el costo mensual de tus aparatos en pocos toques.

## Francês

> Calculez le coût mensuel de vos appareils en quelques appuis.

---

# 5. Princípio principal da nova versão

O PowerCost deve ser desenhado para uma pessoa que não entende tecnologia.

A regra é:

```txt
Se um idoso não entender em 5 segundos o que fazer na tela, a tela está errada.
```

---

# 6. Público-alvo

## 6.1 Público principal

- Famílias.
- Idosos.
- Donos de casa.
- Locatários.
- Pessoas tentando economizar.
- Pequenos escritórios.
- Pequenas lojas.
- Salões.
- Oficinas pequenas.

## 6.2 Público com prioridade especial

### Idosos e usuários com baixa familiaridade digital

Esse público exige:

- menos texto;
- botões grandes;
- contraste forte;
- nenhuma etapa confusa;
- campos com exemplos;
- explicações curtas;
- feedback claro após cada ação;
- possibilidade de voltar sem medo;
- resultado grande e direto.

---

# 7. Problema principal

A maioria dos usuários sabe o valor total da conta de energia, mas não sabe qual aparelho pesa mais.

O problema não é só matemático. É também de compreensão:

- o usuário não sabe o que é kWh;
- o usuário não sabe onde ver potência;
- o usuário não sabe a tarifa correta;
- o usuário não quer fazer conta;
- o usuário desiste se a tela tiver muitos campos;
- o usuário pode errar números se o app não guiar.

---

# 8. Solução proposta

O app transforma uma pergunta complexa em um fluxo simples:

```txt
Qual aparelho?
→ Quanto ele consome?
→ Quanto tempo usa?
→ Quanto custa o kWh?
→ Resultado em reais
```

O usuário deve receber uma resposta como:

```txt
Este aparelho custa cerca de R$ 42,30 por mês.
```

---

# 9. Escopo da V1

## 9.1 Entra na V1

- Cálculo de consumo mensal.
- Cálculo de custo mensal.
- Custo diário.
- Custo anual.
- Lista simples de aparelhos.
- Aparelho personalizado.
- Histórico local.
- Comparação simples.
- Tema claro.
- Tema escuro.
- Idiomas:
  - português;
  - inglês;
  - espanhol;
  - francês.
- Anúncios comuns.
- Anúncios premiados.
- Desbloqueio temporário de recursos extras via anúncio premiado.
- Remoção temporária de anúncios comuns via anúncio premiado.
- Configuração de tarifa padrão.
- Aviso de resultado aproximado.

---

## 9.2 Fora da V1

- Login.
- Conta na nuvem.
- OCR da conta de luz.
- Integração com concessionária.
- Cálculo tributário completo.
- Base oficial de modelos por marca.
- IA conversacional.
- PDF.
- Exportação avançada.
- Medidor real de consumo.
- Integração com smart plug.
- Dashboard complexo.
- Gráficos técnicos.
- Múltiplos imóveis.
- Compartilhamento social.
- Comunidade.
- Ranking online.

---

# 10. Estrutura simples do app

A nova versão deve evitar muitas telas soltas.

## 10.1 Telas principais

1. **Início**
2. **Calcular**
3. **Resultado**
4. **Comparar**
5. **Histórico**
6. **Configurações**
7. **Desbloquear Extras**

---

# 11. Navegação principal

## 11.1 Bottom tabs recomendadas

A navegação inferior deve ter apenas 4 abas:

```txt
Início | Calcular | Histórico | Ajustes
```

A comparação pode ser acessada pela tela de Resultado ou Histórico, sem precisar virar uma aba fixa.

## 11.2 Motivo

Para idosos e usuários pouco técnicos, muitas abas geram confusão. Quatro abas é o limite recomendado para manter clareza.

---

# 12. Jornada principal

## 12.1 Primeiro uso

```txt
Abrir app
→ Ver tela inicial simples
→ Tocar em "Calcular agora"
→ Escolher aparelho
→ Informar potência
→ Informar tempo de uso
→ Informar tarifa
→ Ver custo mensal grande
→ Salvar ou fazer novo cálculo
```

## 12.2 Uso recorrente

```txt
Abrir app
→ Tocar em "Calcular"
→ Usar tarifa salva
→ Ver resultado
→ Comparar ou salvar
```

## 12.3 Jornada com anúncio premiado

```txt
Usuário tenta usar função extra
→ App explica o benefício
→ Usuário escolhe assistir anúncio
→ Anúncio premiado é exibido
→ Recurso é liberado por tempo limitado
```

## 12.4 Jornada para remover anúncios comuns

```txt
Usuário vê opção "Remover anúncios por 30 minutos"
→ Usuário assiste anúncio premiado
→ App remove banners e intersticiais por 30 minutos
→ Após o período, anúncios comuns voltam
```

---

# 13. Tela 1 — Início

## Objetivo

Receber o usuário com clareza e iniciar o cálculo rapidamente.

## Conteúdo

- Nome do app: PowerCost.
- Frase simples: “Veja quanto um aparelho custa por mês.”
- Botão principal grande: “Calcular agora”.
- Card pequeno: “Último cálculo”.
- Card pequeno: “Tarifa salva”.
- Acesso discreto a histórico e configurações.

## Regras visuais

- Um botão principal.
- Texto grande.
- Pouca informação.
- Sem gráfico.
- Sem tela cheia de cards.
- Sem cadastro.
- Sem pop-up no primeiro uso.

## Estado vazio

```txt
Você ainda não calculou nenhum aparelho.
Toque em "Calcular agora" para começar.
```

## Anúncios nesta tela

### Gratuito

- Banner fixo inferior discreto.
- Não exibir intersticial na primeira abertura.
- Não exibir anúncio antes do primeiro cálculo.

### Após uso recorrente

- Banner na parte inferior.
- Card opcional: “Remover anúncios por 30 min assistindo um anúncio”.

---

# 14. Tela 2 — Calcular

## Objetivo

Permitir que o usuário informe os dados do aparelho de forma guiada.

## Estrutura recomendada

A tela deve parecer um passo a passo.

```txt
Passo 1 de 4: Aparelho
Passo 2 de 4: Potência
Passo 3 de 4: Uso
Passo 4 de 4: Tarifa
```

## Regra central

Nunca mostrar todos os campos técnicos de uma vez para o usuário idoso.

---

## 14.1 Passo 1 — Escolher aparelho

### Componentes

- Título: “Qual aparelho?”
- Busca simples.
- Botões grandes com ícone:
  - Chuveiro
  - Geladeira
  - Ar-condicionado
  - Ventilador
  - Televisão
  - Máquina de lavar
  - Computador
  - Lâmpada
  - Outro aparelho
- Botão: “Continuar”

### Regra

A lista inicial deve mostrar poucos aparelhos. O restante fica em “Ver mais”.

---

## 14.2 Passo 2 — Potência

### Componentes

- Título: “Qual a potência?”
- Campo grande: `Watts`
- Ajuda curta: “Veja na etiqueta do aparelho.”
- Botão de ajuda: “Não sei”
- Sugestão aproximada se houver aparelho pré-cadastrado.
- Botões:
  - “Voltar”
  - “Continuar”

### Comportamento do botão “Não sei”

Se o usuário tocar em “Não sei”, o app pode usar um valor aproximado do catálogo e mostrar:

```txt
Vamos usar uma potência aproximada. Você pode alterar depois.
```

---

## 14.3 Passo 3 — Uso diário

### Componentes

- Título: “Quanto tempo usa por dia?”
- Botões grandes:
  - 30 min
  - 1 hora
  - 2 horas
  - 4 horas
  - 8 horas
  - O dia todo
- Campo manual: “Outro tempo”
- Dias por mês:
  - Todos os dias
  - Só dias úteis
  - Personalizado

### Regra

Evitar sliders pequenos. Idosos podem ter dificuldade com sliders. Preferir botões grandes.

---

## 14.4 Passo 4 — Tarifa

### Componentes

- Título: “Quanto custa 1 kWh?”
- Campo grande: `R$/kWh`
- Botão: “Usar valor aproximado”
- Botão de ajuda: “Onde encontro?”
- Checkbox simples: “Salvar esta tarifa”
- Botão principal: “Ver resultado”

### Texto de ajuda

```txt
A tarifa aparece na sua conta de luz. Se não souber, use um valor aproximado.
```

---

# 15. Tela 3 — Resultado

## Objetivo

Mostrar o custo mensal de forma clara e imediata.

## Hierarquia visual

O maior número da tela deve ser o custo mensal.

Exemplo:

```txt
R$ 42,30
por mês
```

Depois:

```txt
36,8 kWh/mês
R$ 1,41 por dia
R$ 507,60 por ano
```

## Componentes

- Nome do aparelho.
- Custo mensal gigante.
- Consumo mensal.
- Custo diário.
- Custo anual.
- Classificação:
  - Baixo gasto
  - Gasto médio
  - Alto gasto
- Texto simples:
  - “Este aparelho custa aproximadamente R$ X por mês.”
- Botões:
  - “Salvar”
  - “Calcular outro”
  - “Comparar”
- Aviso pequeno:
  - “Valor aproximado. A conta real pode variar.”

## Anúncios nesta tela

### Gratuito

- Não colocar banner colado no resultado principal.
- Banner pode aparecer abaixo das ações.
- Intersticial pode aparecer apenas depois que o usuário tocar em “Calcular outro” ou “Voltar ao início”.

### Anúncio premiado

Pode aparecer um card:

```txt
Desbloquear dicas de economia
Assista um anúncio e veja sugestões para reduzir este custo.
```

---

# 16. Tela 4 — Comparar

## Objetivo

Mostrar quais aparelhos custam mais.

## Versão simples

A comparação deve ser uma lista ordenada, não um gráfico complexo.

Exemplo:

```txt
1. Ar-condicionado — R$ 162,00/mês
2. Chuveiro — R$ 64,80/mês
3. Geladeira — R$ 40,50/mês
```

## Componentes

- Título: “Maiores gastos”
- Total mensal estimado.
- Lista com ranking.
- Barras horizontais simples.
- Botão: “Adicionar aparelho”
- Botão: “Limpar comparação”

## Regra para idosos

O app deve escrever a conclusão:

```txt
O aparelho que mais pesa é: Ar-condicionado.
```

## Limite gratuito sugerido

- Comparar até 3 aparelhos grátis.
- Para comparar mais aparelhos:
  - assistir anúncio premiado;
  - ou usar premium futuro.

## Anúncio premiado

```txt
Compare mais aparelhos por 24 horas.
Assista um anúncio para desbloquear.
```

---

# 17. Tela 5 — Histórico

## Objetivo

Guardar cálculos anteriores.

## Componentes

- Lista simples.
- Nome do aparelho.
- Custo mensal.
- Data.
- Botões:
  - Ver
  - Recalcular
  - Excluir

## Estado vazio

```txt
Nenhum cálculo salvo ainda.
```

## Limite gratuito sugerido

- Até 5 cálculos salvos grátis.
- Para salvar mais:
  - assistir anúncio premiado e liberar +5 espaços por 24 horas;
  - ou premium futuro.

## Anúncios

- Banner inferior.
- Intersticial ao abrir histórico a cada 2 ou 3 sessões, com controle de frequência.
- Não exibir intersticial imediatamente após o usuário excluir algo.

---

# 18. Tela 6 — Configurações

## Objetivo

Permitir ajustes básicos sem confundir.

## Componentes

- Idioma.
- Tema:
  - Automático
  - Claro
  - Escuro
- Tarifa padrão.
- Anúncios:
  - Remover por 30 min com anúncio premiado.
- Limpar histórico.
- Sobre o cálculo.
- Política de privacidade.
- Termos de uso.
- Versão do app.

## Regras

- Não usar termos técnicos.
- Não esconder idioma e tema.
- Deixar “Limpar histórico” com confirmação.

---

# 19. Tela 7 — Desbloquear Extras

## Objetivo

Centralizar recursos liberados por anúncios premiados e premium futuro.

## Componentes

- Título: “Desbloquear extras”
- Cards de benefício:
  - Remover anúncios por 30 min
  - Comparar mais aparelhos por 24 h
  - Salvar mais cálculos por 24 h
  - Ver dicas de economia
  - Usar cenários “e se?”
- Botão em cada card:
  - “Assistir anúncio”
- Área futura:
  - “PowerCost Plus”

## Regra

Cada recompensa deve ser clara antes do anúncio.

Exemplo:

```txt
Assista um anúncio para remover anúncios comuns por 30 minutos.
```

Nunca usar frases vagas como:

```txt
Assista para ganhar benefício.
```

---

# 20. Regras de cálculo

## 20.1 Fórmula principal

```txt
Consumo mensal em kWh = potência em watts × horas por dia × dias por mês ÷ 1000
```

## 20.2 Fórmula de custo

```txt
Custo mensal = consumo mensal em kWh × tarifa por kWh
```

## 20.3 Fórmulas secundárias

```txt
Custo diário = custo mensal ÷ dias por mês
```

```txt
Custo anual = custo mensal × 12
```

```txt
Consumo anual = consumo mensal × 12
```

---

# 21. Validações

## 21.1 Potência

- Obrigatória.
- Maior que 0.
- Unidade: watts.
- Exemplo: `1500 W`.

## 21.2 Horas por dia

- Obrigatória.
- Entre 0 e 24.
- Aceita decimal.
- Exemplo: `1,5 h`.

## 21.3 Dias por mês

- Obrigatório.
- Entre 1 e 31.
- Inteiro.
- Opções rápidas:
  - 30 dias;
  - 22 dias úteis;
  - personalizado.

## 21.4 Tarifa

- Obrigatória para custo em dinheiro.
- Maior que 0.
- Formato decimal.
- Deve respeitar idioma/região na exibição.

---

# 22. Linguagem do app

## 22.1 Regras gerais

- Frases curtas.
- Evitar jargão.
- Evitar blocos longos.
- Usar exemplos.
- Confirmar ações importantes.
- Evitar termos como “parâmetros”, “estimativa monetária”, “consumo energético nominal”.

## 22.2 Exemplos corretos

```txt
Quanto tempo você usa por dia?
```

```txt
Este aparelho custa cerca de R$ 42,30 por mês.
```

```txt
Valor aproximado. Sua conta real pode variar.
```

## 22.3 Exemplos proibidos

```txt
Insira os parâmetros energéticos nominais do dispositivo.
```

```txt
A métrica mensal consolidada foi processada.
```

```txt
Configure a granularidade da unidade consumidora.
```

---

# 23. Acessibilidade para idosos

## 23.1 Tipografia

- Tamanho mínimo de texto comum: 16 px.
- Texto principal: 18 px.
- Títulos: 24 a 32 px.
- Resultado principal: 40 a 56 px.
- Evitar texto muito fino.
- Evitar blocos com mais de 3 linhas.

## 23.2 Botões

- Altura mínima: 52 px.
- Área de toque confortável.
- Texto claro.
- Ícone opcional, nunca sozinho.
- Botão principal sempre destacado.

## 23.3 Contraste

- Alto contraste entre texto e fundo.
- Evitar cinza claro demais.
- Não usar amarelo como texto principal.
- Amarelo deve ser apoio visual, não texto crítico.

## 23.4 Navegação

- Sempre mostrar botão “Voltar”.
- Nunca prender o usuário em uma tela.
- Não usar gestos escondidos.
- Evitar menus escondidos.
- Não depender de swipe.

## 23.5 Feedback

- Após calcular, mostrar resultado imediatamente.
- Após salvar, mostrar mensagem:
  - “Cálculo salvo.”
- Após erro, explicar exatamente:
  - “Digite uma potência maior que zero.”

---

# 24. Design system inicial

## 24.1 Personalidade visual

- Simples.
- Confiável.
- Calmo.
- Econômico.
- Didático.
- Sem excesso de elementos.

## 24.2 Tema claro

| Token | Uso | Valor sugerido |
|---|---|---|
| background | Fundo principal | `#F5FAF4` |
| surface | Cards | `#FFFFFF` |
| primary | Verde economia | `#168A4A` |
| primaryDark | Verde forte | `#0F6B39` |
| secondary | Amarelo energia | `#F5B82E` |
| text | Texto principal | `#17231B` |
| muted | Texto secundário | `#66736A` |
| border | Bordas suaves | `#DDE8DF` |
| danger | Erro | `#C2410C` |
| success | Sucesso | `#168A4A` |
| warning | Alto gasto | `#D97706` |

## 24.3 Tema escuro

| Token | Uso | Valor sugerido |
|---|---|---|
| background | Fundo principal | `#07130D` |
| surface | Cards | `#102018` |
| primary | Verde economia | `#35C978` |
| primaryDark | Verde escuro | `#1A9B55` |
| secondary | Amarelo energia | `#FACC15` |
| text | Texto principal | `#F3FFF6` |
| muted | Texto secundário | `#A8B8AD` |
| border | Bordas | `#254333` |
| danger | Erro | `#FB923C` |
| success | Sucesso | `#35C978` |
| warning | Alto gasto | `#F59E0B` |

## 24.4 Componentes visuais

### Botão principal

- Grande.
- Verde.
- Texto branco.
- Altura mínima de 56 px.
- Canto arredondado.
- Label objetivo:
  - “Calcular agora”
  - “Ver resultado”
  - “Salvar cálculo”

### Card

- Fundo claro ou escuro conforme tema.
- Bordas suaves.
- Pouca sombra.
- Padding grande.
- Um objetivo por card.

### Input

- Grande.
- Unidade visível.
- Placeholder com exemplo.
- Erro abaixo do campo.
- Teclado numérico.

### Badge

- Baixo gasto.
- Gasto médio.
- Alto gasto.

### Empty State

- Ícone simples.
- Texto curto.
- CTA claro.

---

# 25. Idiomas

## 25.1 Idiomas obrigatórios

```txt
pt-BR — Português
en-US — English
es-ES — Español
fr-FR — Français
```

## 25.2 Idioma padrão

- Detectar idioma do sistema.
- Se não houver suporte, usar português.
- Permitir troca manual em Configurações.

## 25.3 Regras de tradução

- Não concatenar frases com variáveis de forma rígida.
- Usar arquivos de tradução por chave.
- Preparar plurais.
- Preparar moeda e números por locale.
- Manter frases curtas em todos os idiomas.

## 25.4 Exemplo de chaves i18n

```ts
const translations = {
  "home.title": "PowerCost",
  "home.subtitle": "Veja quanto um aparelho custa por mês.",
  "home.start": "Calcular agora",
  "calculate.appliance.title": "Qual aparelho?",
  "calculate.power.title": "Qual a potência?",
  "calculate.usage.title": "Quanto tempo usa por dia?",
  "calculate.tariff.title": "Quanto custa 1 kWh?",
  "result.monthlyCost": "por mês",
  "result.estimated": "Valor aproximado. Sua conta real pode variar.",
  "ads.removeFor30": "Remover anúncios por 30 min",
  "ads.watchToUnlock": "Assistir anúncio",
};
```

## 25.5 Exemplos de textos principais

### Português

```txt
Calcular agora
Qual aparelho?
Qual a potência?
Quanto tempo usa por dia?
Ver resultado
```

### Inglês

```txt
Calculate now
Which appliance?
What is the power?
How long do you use it per day?
See result
```

### Espanhol

```txt
Calcular ahora
¿Qué aparato?
¿Cuál es la potencia?
¿Cuánto tiempo lo usas por día?
Ver resultado
```

### Francês

```txt
Calculer maintenant
Quel appareil ?
Quelle est la puissance ?
Combien de temps l’utilisez-vous par jour ?
Voir le résultat
```

---

# 26. Plano de anúncios agressivo

## 26.1 Definição

O plano de anúncios será agressivo em volume, mas controlado em momentos críticos.

A função principal do app é calcular. Portanto:

```txt
Nunca bloquear o primeiro cálculo com anúncio.
Nunca colocar anúncio antes do primeiro resultado.
Nunca cobrir o resultado principal.
```

Depois que o usuário entender o valor do app, a monetização pode ser mais forte.

---

## 26.2 Formatos de anúncios

### Banner

Uso frequente e contínuo.

Locais:

- Início.
- Histórico.
- Configurações.
- Comparação.
- Parte inferior da tela, respeitando área segura.

Evitar:

- Em cima de botão principal.
- No meio do formulário.
- Colado ao resultado mensal.

---

### Intersticial comum

Uso agressivo, mas em transições naturais.

Locais recomendados:

- Depois de salvar cálculo.
- Ao voltar para início após resultado.
- Ao abrir histórico após algumas ações.
- Ao concluir 2 ou 3 cálculos.
- Ao sair da tela de comparação.

Frequência sugerida:

```txt
Não exibir no primeiro cálculo.
Depois do primeiro cálculo:
- no máximo 1 intersticial a cada 2 cálculos;
- ou no máximo 1 intersticial a cada 3 minutos;
- nunca dois intersticiais em sequência.
```

---

### Anúncio premiado

Uso central na monetização.

O usuário assiste porque quer desbloquear algo.

Regras:

- Sempre voluntário.
- Sempre explicar a recompensa antes.
- Sempre entregar a recompensa após conclusão.
- Sempre permitir recusar.
- Não prometer dinheiro real.
- Não usar recompensa enganosa.
- Não forçar o usuário a assistir para usar o cálculo básico.

---

### Anúncio premiado intersticial

Pode ser usado em transições naturais, desde que com tela introdutória clara e opção de recusar.

Exemplo:

```txt
Quer liberar comparação avançada por 24 horas?
Assista a um anúncio ou continue grátis.
```

Botões:

```txt
Assistir anúncio
Agora não
```

---

# 27. Recompensas por anúncio premiado

## 27.1 Remover anúncios comuns por curto período

### Recompensa

```txt
Remover banners e intersticiais por 30 minutos.
```

### Regras

- O usuário assiste um anúncio premiado.
- O app salva `adFreeUntil`.
- Durante o período:
  - não mostrar banner;
  - não mostrar intersticial comum;
  - ainda pode mostrar botões voluntários de anúncio premiado.
- Após o tempo, anúncios comuns voltam.

### Duração recomendada

```txt
30 minutos
```

### Limite

```txt
Máximo de 3 ativações seguidas.
Depois disso, sugerir PowerCost Plus.
```

---

## 27.2 Comparação expandida

### Grátis

```txt
Comparar até 3 aparelhos.
```

### Com anúncio premiado

```txt
Comparar até 10 aparelhos por 24 horas.
```

### Premium futuro

```txt
Comparações ilimitadas.
```

---

## 27.3 Mais espaços no histórico

### Grátis

```txt
Salvar até 5 cálculos.
```

### Com anúncio premiado

```txt
Liberar +5 espaços por 24 horas.
```

### Premium futuro

```txt
Histórico ilimitado.
```

---

## 27.4 Dicas de economia

### Grátis

```txt
Resultado básico sem dicas avançadas.
```

### Com anúncio premiado

```txt
Liberar dicas simples para aquele aparelho.
```

Exemplo:

```txt
Se usar 1 hora a menos por dia, pode economizar cerca de R$ X por mês.
```

---

## 27.5 Cenário “e se?”

### Grátis

```txt
Não disponível ou limitado a 1 cenário.
```

### Com anúncio premiado

```txt
Liberar simulações "e se?" por 30 minutos.
```

Cenários:

- usar menos horas;
- usar menos dias;
- trocar potência;
- mudar tarifa.

---

# 28. Plano de monetização por etapa

## 28.1 Primeiro uso

Objetivo: não assustar.

- Sem intersticial.
- Sem popup agressivo.
- Banner opcional apenas depois da primeira tela.
- Resultado básico livre.

## 28.2 Depois do primeiro resultado

Objetivo: começar monetização.

- Banner em telas secundárias.
- Card de anúncio premiado:
  - remover anúncios por 30 min;
  - liberar dicas;
  - salvar resultado.

## 28.3 Usuário recorrente

Objetivo: monetização agressiva.

- Banner em quase todas as telas não críticas.
- Intersticial em transições naturais.
- Rewards para comparação, histórico e dicas.
- Bloqueios leves de volume gratuito.

## 28.4 Usuário pesado

Objetivo: converter para premium futuro.

- Mostrar limites gratuitos.
- Oferecer anúncio premiado como alternativa.
- Mostrar plano Plus como melhor solução.

---

# 29. Regras de segurança para anúncios

Mesmo com plano agressivo, o app precisa evitar rejeição e avaliações ruins.

## Regras obrigatórias

- Não enganar o usuário.
- Não forçar anúncio para cálculo básico.
- Não posicionar anúncio causando toque acidental.
- Não pedir avaliação em troca de recompensa.
- Não prometer dinheiro.
- Não prometer economia garantida.
- Não usar anúncio em tela de erro crítico.
- Não bloquear o botão de voltar.
- Não exibir anúncio comum durante digitação.
- Não mostrar intersticial em sequência.

## Regras para revisão de loja

- Usar IDs de teste durante desenvolvimento.
- Trocar para IDs reais só em produção.
- Garantir fallback se anúncio não carregar.
- Não deixar botão de anúncio sem resposta.
- Se anúncio falhar, mostrar mensagem clara:
  - “Não foi possível carregar o anúncio agora.”

---

# 30. Plano premium futuro

Embora a V1 foque em ads, o projeto deve estar preparado para premium.

## PowerCost Plus

Benefícios:

- Remover anúncios permanentemente.
- Histórico ilimitado.
- Comparações ilimitadas.
- Dicas de economia sempre liberadas.
- Cenários “e se?” ilimitados.
- Categorias personalizadas.
- Múltiplas tarifas salvas.
- Exportação futura.

## Regra

O Plus deve ser preparado no código, mas pode não ser lançado na primeira build.

---

# 31. Modelo de dados inicial

## 31.1 Appliance

```ts
type ApplianceCategory =
  | 'kitchen'
  | 'bathroom'
  | 'laundry'
  | 'climate'
  | 'lighting'
  | 'office'
  | 'commerce'
  | 'beauty'
  | 'workshop'
  | 'other';

type Appliance = {
  id: string;
  nameKey: string;
  category: ApplianceCategory;
  defaultPowerWatts?: number;
  isCustom: boolean;
  createdAt: string;
  updatedAt?: string;
};
```

---

## 31.2 SimulationInput

```ts
type SimulationInput = {
  applianceId?: string;
  applianceName: string;
  powerWatts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  tariffPerKwh: number;
};
```

---

## 31.3 SimulationResult

```ts
type SimulationResult = {
  consumptionKwhMonth: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
  consumptionKwhYear: number;
  impactLevel: 'low' | 'medium' | 'high';
};
```

---

## 31.4 SavedSimulation

```ts
type SavedSimulation = {
  id: string;
  input: SimulationInput;
  result: SimulationResult;
  createdAt: string;
  updatedAt?: string;
};
```

---

## 31.5 AppSettings

```ts
type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR';

type AppTheme = 'system' | 'light' | 'dark';

type AppSettings = {
  locale: SupportedLocale;
  theme: AppTheme;
  defaultTariffPerKwh?: number;
  currency: 'BRL' | 'USD' | 'EUR';
  hasCompletedOnboarding: boolean;
  updatedAt?: string;
};
```

---

## 31.6 AdsState

```ts
type AdsState = {
  adFreeUntil?: string;
  expandedComparisonUntil?: string;
  extraHistorySlotsUntil?: string;
  whatIfUnlockedUntil?: string;
  lastInterstitialShownAt?: string;
  completedCalculationsSinceLastInterstitial: number;
};
```

---

## 31.7 PremiumState

```ts
type PremiumState = {
  isPremium: boolean;
  entitlementId?: string;
  source?: 'revenuecat' | 'local_mock';
};
```

---

# 32. Estrutura de arquivos recomendada

```txt
docs/
  01_APP_BLUEPRINT.md
  02_DESIGN_SYSTEM.md
  03_USER_FLOW.md
  04_SCREEN_SPECS.md
  05_DATA_MODEL.md
  06_CODEX_TASKS.md
  07_RELEASE_CHECKLIST.md

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

src/
  components/
    ui/
      AppButton.tsx
      AppCard.tsx
      ScreenContainer.tsx
      AppHeader.tsx
      EmptyState.tsx
      LargeNumber.tsx
      StepHeader.tsx
      BigChoiceButton.tsx
    calculation/
      AppliancePicker.tsx
      PowerStep.tsx
      UsageStep.tsx
      TariffStep.tsx
      ResultSummary.tsx
    ads/
      BannerAdSlot.tsx
      RewardedUnlockCard.tsx
      AdFreeCard.tsx
    history/
      SimulationHistoryItem.tsx
    comparison/
      SimpleRankingList.tsx
  constants/
    applianceCatalog.ts
    colors.ts
    spacing.ts
    typography.ts
    routes.ts
    adRules.ts
  hooks/
    useCalculation.ts
    useHistory.ts
    useTariff.ts
    useAppLocale.ts
    useAppTheme.ts
    useAdsAccess.ts
    usePremium.ts
  i18n/
    index.ts
    pt-BR.ts
    en-US.ts
    es-ES.ts
    fr-FR.ts
  services/
    calculationService.ts
    historyStorage.ts
    settingsStorage.ts
    adsService.ts
    premiumService.ts
  types/
    appliance.ts
    simulation.ts
    settings.ts
    ads.ts
    premium.ts
  utils/
    energyCalculations.ts
    formatters.ts
    validators.ts
```

---

# 33. Ordem ideal de implementação

## Etapa 1 — Base do projeto

- Configurar Expo Router.
- Criar estrutura de pastas.
- Criar tokens de tema.
- Criar suporte claro/escuro.
- Criar i18n básico.
- Criar componentes globais.

## Etapa 2 — Cálculo

- Implementar fórmula.
- Implementar validações.
- Implementar formatação de moeda, kWh e números.
- Criar testes simples manuais ou unitários, se houver estrutura.

## Etapa 3 — Fluxo de cálculo

- Tela Calcular com passos.
- Escolha de aparelho.
- Potência.
- Uso.
- Tarifa.
- Resultado.

## Etapa 4 — Histórico

- Salvar cálculo.
- Listar histórico.
- Excluir cálculo.
- Recalcular.

## Etapa 5 — Comparação

- Ranking simples.
- Total mensal.
- Limite gratuito.
- Desbloqueio por anúncio premiado.

## Etapa 6 — Ads

- Banner.
- Intersticial com controle de frequência.
- Rewarded ads.
- Remoção temporária de anúncios.
- Fallback de erro.

## Etapa 7 — Configurações

- Idioma.
- Tema.
- Tarifa padrão.
- Limpar histórico.
- Sobre cálculo.

## Etapa 8 — Polimento

- Acessibilidade.
- Responsividade.
- Textos.
- Estados vazios.
- Erros.
- Typecheck.
- Build.

---

# 34. Critérios de conclusão da V1

A V1 estará pronta quando:

- O usuário conseguir calcular um aparelho sem login.
- O app exibir custo mensal grande e claro.
- O app funcionar em tema claro e escuro.
- O app funcionar em português, inglês, espanhol e francês.
- O app salvar histórico local.
- O app comparar pelo menos 3 aparelhos gratuitamente.
- O app tiver anúncios comuns implementados com controle de frequência.
- O app tiver anúncio premiado para remover anúncios por tempo limitado.
- O app tiver anúncio premiado para liberar funções extras.
- O app exibir fallback quando anúncio não carregar.
- O app não exibir anúncio antes do primeiro resultado.
- O app funcionar em telas pequenas.
- O app for compreensível para idosos.
- O typecheck passar.
- Não houver tela redundante.
- Não houver função fora do blueprint.

---

# 35. Riscos e decisões

## 35.1 Risco: anúncios demais causarem rejeição do usuário

### Decisão

Anúncios serão agressivos, mas concentrados após o valor principal ser entregue.

---

## 35.2 Risco: app ficar complexo por causa de idiomas

### Decisão

Todas as strings devem nascer com chave i18n desde o início. Não escrever texto fixo dentro das telas.

---

## 35.3 Risco: idosos não entenderem campos técnicos

### Decisão

Usar passos separados, botões grandes, exemplos e opção “Não sei”.

---

## 35.4 Risco: o app parecer impreciso

### Decisão

Mostrar sempre que o resultado é aproximado e permitir editar dados.

---

## 35.5 Risco: cálculo com tarifa incorreta

### Decisão

Permitir valor aproximado, mas explicar que a tarifa real pode estar na conta de luz.

---

# 36. O que o Codex não deve fazer

- Não criar login.
- Não criar dashboard técnico.
- Não adicionar gráfico complexo.
- Não misturar lógica de cálculo dentro da UI.
- Não colocar textos fixos fora do i18n.
- Não bloquear cálculo básico por anúncio.
- Não inserir anúncio antes do primeiro resultado.
- Não criar mais abas sem aprovação.
- Não usar fontes pequenas.
- Não criar tela poluída.
- Não alterar o escopo sem atualizar o blueprint.

---

# 37. Notas de conformidade para anúncios

O plano de ads deve ser validado na implementação conforme políticas atuais da rede de anúncios e das lojas.

Regras práticas para manter o plano seguro:

- anúncios premiados precisam ser uma escolha do usuário;
- a recompensa deve ser informada antes do anúncio;
- a recompensa prometida deve ser entregue após o anúncio concluído;
- o app deve permitir recusar anúncios premiados;
- anúncios comuns não devem prejudicar a função principal;
- o app não deve usar recompensa monetária real;
- o app deve ter fallback quando o anúncio falhar;
- o app deve evitar comportamento enganoso ou indução acidental de cliques.

---

# 38. Definição final do produto

O PowerCost será um app de cálculo simples de energia, feito para qualquer pessoa, inclusive idosos. Ele deve estimar o custo mensal de aparelhos com poucos toques, mostrar o resultado em números grandes e permitir comparação básica.

A monetização será forte por anúncios, com banners, intersticiais controlados e anúncios premiados para desbloquear extras ou remover anúncios comuns por um curto período. A função principal — calcular o custo mensal de um aparelho — deve continuar simples, rápida e livre no primeiro uso.

---

# 39. Próximo arquivo recomendado

Após aprovar este blueprint, criar:

```txt
docs/02_DESIGN_SYSTEM.md
```

O próximo documento deve detalhar:

- tema claro;
- tema escuro;
- botões grandes;
- inputs acessíveis;
- tipografia para idosos;
- paleta verde/amarelo;
- componentes de anúncio;
- estados de erro;
- layout mobile-first;
- padrões visuais para quatro idiomas.
