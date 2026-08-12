# 03_USER_FLOW.md

# User Flow — PowerCost

## 1. Identificação

**App:** PowerCost  
**Arquivo:** `docs/03_USER_FLOW.md`  
**Fase:** 03 — Fluxo de Usuário  
**Stack-alvo:** Expo + React Native + TypeScript + Expo Router  
**Base:** `01_APP_BLUEPRINT.md` + `02_DESIGN_SYSTEM.md`  
**Foco:** app simples, acessível para idosos, com tema claro/escuro, quatro idiomas e monetização forte por anúncios comuns e premiados.

---

# 2. Objetivo deste documento

Este documento define como o usuário se move pelo PowerCost.

O fluxo deve manter a promessa central:

```txt
Calcular quanto um aparelho elétrico custa por mês com poucos toques.
```

A navegação deve ser simples, previsível e sem telas desnecessárias.

---

# 3. Princípio principal do fluxo

O PowerCost deve funcionar como uma calculadora guiada.

A lógica central é:

```txt
Início → Calcular → Resultado → Salvar / Comparar / Calcular outro
```

O usuário não deve precisar entender termos técnicos para usar o app.

---

# 4. Regras gerais de navegação

## 4.1 Regras obrigatórias

- O usuário deve conseguir fazer o primeiro cálculo sem login.
- O usuário não deve ver anúncio intersticial antes do primeiro resultado.
- O usuário deve sempre conseguir voltar.
- O app não deve depender de gestos escondidos.
- Cada tela deve ter apenas uma ação principal clara.
- O fluxo de cálculo deve ser dividido em passos.
- O resultado mensal deve ser a principal recompensa visual.
- A navegação inferior deve ter no máximo 4 abas.
- A comparação não deve ser aba fixa na V1.
- Configurações devem ser simples e sem termos técnicos.

## 4.2 Bottom tabs da V1

```txt
Início | Calcular | Histórico | Ajustes
```

## 4.3 Telas fora das tabs

```txt
Resultado
Comparar
Desbloquear Extras
```

Essas telas são abertas a partir de ações específicas.

---

# 5. Mapa geral de navegação

```txt
App aberto
│
├── Verificar primeiro uso
│   ├── Se novo usuário → Início com explicação simples
│   └── Se recorrente → Início com último cálculo e atalhos
│
├── Início
│   ├── Calcular agora → Calcular
│   ├── Último cálculo → Resultado
│   ├── Histórico → Histórico
│   ├── Remover anúncios → Desbloquear Extras
│   └── Ajustes → Configurações
│
├── Calcular
│   ├── Passo 1: Aparelho
│   ├── Passo 2: Potência
│   ├── Passo 3: Uso
│   ├── Passo 4: Tarifa
│   └── Ver resultado → Resultado
│
├── Resultado
│   ├── Salvar → Histórico local
│   ├── Comparar → Comparar
│   ├── Calcular outro → Calcular
│   ├── Editar dados → Calcular no passo correspondente
│   └── Desbloquear dicas → Anúncio premiado
│
├── Comparar
│   ├── Adicionar aparelho → Calcular
│   ├── Ver item → Resultado
│   ├── Remover item → Atualiza comparação
│   └── Comparar mais → Anúncio premiado
│
├── Histórico
│   ├── Ver cálculo → Resultado
│   ├── Recalcular → Calcular com dados preenchidos
│   ├── Excluir → Confirmação
│   └── Salvar mais → Anúncio premiado
│
├── Ajustes
│   ├── Idioma
│   ├── Tema
│   ├── Tarifa padrão
│   ├── Anúncios
│   ├── Limpar histórico
│   └── Sobre o cálculo
│
└── Desbloquear Extras
    ├── Remover anúncios por 30 min → Anúncio premiado
    ├── Comparar mais aparelhos → Anúncio premiado
    ├── Liberar mais histórico → Anúncio premiado
    ├── Liberar dicas → Anúncio premiado
    └── PowerCost Plus futuro
```

---

# 6. Estados globais do usuário

## 6.1 Novo usuário

Condições:

- Sem cálculo salvo.
- Sem tarifa padrão.
- Sem histórico.
- Sem preferências manuais.

Comportamento:

```txt
Abrir app → Início simples → CTA “Calcular agora”
```

Não exibir:

- intersticial;
- bloqueio premium;
- limite de histórico;
- popup agressivo;
- pedido de avaliação.

---

## 6.2 Usuário recorrente

Condições:

- Já concluiu pelo menos um cálculo.

Comportamento:

```txt
Abrir app → Início com último cálculo + CTA “Calcular agora”
```

Pode exibir:

- banner discreto;
- card de remover anúncios por 30 min;
- atalho para histórico;
- atalho para comparar.

---

## 6.3 Usuário com tarifa salva

Condições:

- Existe `defaultTariffPerKwh`.

Comportamento:

- O passo de tarifa mostra a tarifa salva.
- O usuário pode editar.
- O app pode permitir pular confirmação se o fluxo for otimizado no futuro.

---

## 6.4 Usuário sem tarifa salva

Condições:

- Não existe tarifa padrão.

Comportamento:

- O passo de tarifa é obrigatório.
- Exibir ajuda curta.
- Oferecer “Usar valor aproximado”.
- Oferecer “Salvar esta tarifa”.

---

## 6.5 Usuário com período sem anúncios ativo

Condições:

- `adFreeUntil` maior que a data atual.

Comportamento:

- Não mostrar banners.
- Não mostrar intersticiais comuns.
- Ainda permitir anúncios premiados voluntários.
- Mostrar status em Configurações ou Desbloquear Extras.

---

## 6.6 Usuário com limite grátis atingido

Exemplos:

- Histórico grátis cheio.
- Comparação grátis atingiu limite.
- Cenários “e se?” bloqueados.

Comportamento:

```txt
Explicar limite → Oferecer anúncio premiado → Oferecer continuar grátis
```

Nunca bloquear:

- primeiro cálculo;
- resultado básico;
- edição dos dados do cálculo atual.

---

# 7. Fluxo de primeira abertura

## 7.1 Objetivo

Fazer o usuário iniciar o primeiro cálculo rapidamente.

## 7.2 Fluxo

```txt
Abrir app
→ Detectar idioma do sistema
→ Aplicar tema do sistema
→ Carregar configurações locais
→ Exibir tela Início
→ Usuário toca em "Calcular agora"
→ Ir para tela Calcular
```

## 7.3 Tela inicial para novo usuário

Conteúdo principal:

```txt
PowerCost
Veja quanto um aparelho custa por mês.
[Calcular agora]
```

Texto auxiliar:

```txt
Informe potência, tempo de uso e tarifa.
```

## 7.4 Regras

- Não pedir cadastro.
- Não pedir nome.
- Não pedir permissão desnecessária.
- Não mostrar anúncio intersticial.
- Não abrir paywall.
- Não forçar tutorial longo.

---

# 8. Fluxo de cálculo principal

## 8.1 Objetivo

Guiar o usuário por quatro passos simples.

## 8.2 Fluxo geral

```txt
Calcular
→ Passo 1: Aparelho
→ Passo 2: Potência
→ Passo 3: Uso
→ Passo 4: Tarifa
→ Resultado
```

## 8.3 Regras

- Um passo por vez.
- Campos grandes.
- Botão principal no final.
- Botão “Voltar” visível.
- Ajuda curta em cada passo.
- Sem anúncio entre os passos.
- Sem intersticial durante preenchimento.
- Se o usuário sair, pedir confirmação apenas se houver dados preenchidos.

---

# 9. Passo 1 — Escolher aparelho

## 9.1 Entrada

Usuário toca em:

```txt
Início → Calcular agora
```

ou:

```txt
Bottom tab → Calcular
```

## 9.2 Objetivo

Selecionar o aparelho que será calculado.

## 9.3 Conteúdo

Título:

```txt
Qual aparelho?
```

Opções principais:

- Chuveiro
- Geladeira
- Ar-condicionado
- Ventilador
- Televisão
- Máquina de lavar
- Computador
- Lâmpada
- Outro aparelho

## 9.4 Ações

| Ação | Resultado |
|---|---|
| Tocar em aparelho | Seleciona aparelho |
| Tocar em “Outro aparelho” | Abre campo para nome personalizado |
| Tocar em “Continuar” | Vai para Potência |
| Tocar em “Voltar” | Retorna para Início ou tela anterior |

## 9.5 Estados

### Nenhum aparelho selecionado

- Botão “Continuar” desabilitado.
- Mensagem, se tentar avançar:

```txt
Escolha um aparelho para continuar.
```

### Aparelho personalizado

- Exibir campo:

```txt
Nome do aparelho
```

- Validar mínimo de 2 caracteres.

## 9.6 Saída

```txt
Aparelho selecionado → Passo 2
```

---

# 10. Passo 2 — Potência

## 10.1 Objetivo

Informar a potência em watts.

## 10.2 Conteúdo

Título:

```txt
Qual a potência?
```

Campo:

```txt
[____] W
```

Ajuda:

```txt
A potência costuma estar na etiqueta do aparelho.
```

Ações:

- “Não sei”
- “Voltar”
- “Continuar”

## 10.3 Fluxo com potência conhecida

```txt
Usuário digita watts
→ Validação
→ Continuar
→ Passo 3
```

## 10.4 Fluxo com “Não sei”

```txt
Usuário toca em "Não sei"
→ App usa potência aproximada do catálogo, se existir
→ Mostra mensagem
→ Usuário pode continuar ou editar
```

Mensagem:

```txt
Vamos usar uma potência aproximada. Você pode alterar depois.
```

## 10.5 Validações

| Caso | Mensagem |
|---|---|
| Campo vazio | Digite a potência do aparelho. |
| Valor 0 | Digite uma potência maior que zero. |
| Valor negativo | Digite uma potência maior que zero. |
| Valor inválido | Use apenas números. |

## 10.6 Saída

```txt
Potência válida → Passo 3
```

---

# 11. Passo 3 — Uso diário

## 11.1 Objetivo

Informar quanto tempo o aparelho é usado.

## 11.2 Conteúdo

Título:

```txt
Quanto tempo usa por dia?
```

Botões grandes:

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

## 11.3 Fluxo rápido

```txt
Usuário escolhe "2 horas"
→ Usuário escolhe "Todos os dias"
→ Continuar
→ Passo 4
```

## 11.4 Fluxo personalizado

```txt
Usuário toca "Outro tempo"
→ Campo manual de horas
→ Usuário informa horas
→ Escolhe dias por mês
→ Continuar
```

## 11.5 Valores padrão

| Opção | Valor |
|---|---:|
| 30 min | 0.5 |
| 1 hora | 1 |
| 2 horas | 2 |
| 4 horas | 4 |
| 8 horas | 8 |
| O dia todo | 24 |
| Todos os dias | 30 dias |
| Só dias úteis | 22 dias |

## 11.6 Validações

| Caso | Mensagem |
|---|---|
| Horas vazias | Informe o tempo de uso. |
| Horas menores que 0 | Use um valor entre 0 e 24 horas. |
| Horas maiores que 24 | Use um valor entre 0 e 24 horas. |
| Dias vazios | Informe os dias de uso no mês. |
| Dias menores que 1 | Use um valor entre 1 e 31 dias. |
| Dias maiores que 31 | Use um valor entre 1 e 31 dias. |

## 11.7 Saída

```txt
Uso válido → Passo 4
```

---

# 12. Passo 4 — Tarifa

## 12.1 Objetivo

Informar o preço de 1 kWh.

## 12.2 Conteúdo

Título:

```txt
Quanto custa 1 kWh?
```

Campo:

```txt
[____] R$/kWh
```

Ações:

- “Usar valor aproximado”
- “Onde encontro?”
- “Salvar esta tarifa”
- “Ver resultado”

## 12.3 Fluxo com tarifa salva

```txt
App carrega tarifa padrão
→ Campo já preenchido
→ Usuário pode alterar
→ Ver resultado
```

## 12.4 Fluxo sem tarifa

```txt
Usuário digita tarifa
ou
Usuário toca "Usar valor aproximado"
→ Tarifa é preenchida
→ Usuário toca "Ver resultado"
```

## 12.5 Ajuda “Onde encontro?”

Ao tocar:

```txt
A tarifa aparece na sua conta de luz. Procure por valor do kWh ou tarifa de energia.
```

## 12.6 Validações

| Caso | Mensagem |
|---|---|
| Campo vazio | Digite a tarifa ou use um valor aproximado. |
| Valor 0 | Digite uma tarifa maior que zero. |
| Valor negativo | Digite uma tarifa maior que zero. |
| Valor inválido | Use apenas números. |

## 12.7 Saída

```txt
Tarifa válida → Calcular → Resultado
```

---

# 13. Fluxo de resultado

## 13.1 Entrada

O resultado é aberto após o passo de tarifa.

## 13.2 Processamento

O app calcula:

```txt
consumoKwhMes = potenciaWatts × horasPorDia × diasPorMes ÷ 1000
```

```txt
custoMensal = consumoKwhMes × tarifaKwh
```

```txt
custoDiario = custoMensal ÷ diasPorMes
```

```txt
custoAnual = custoMensal × 12
```

## 13.3 Conteúdo visual

Principal:

```txt
R$ 42,30
por mês
```

Secundário:

```txt
36,8 kWh/mês
R$ 1,41 por dia
R$ 507,60 por ano
```

Explicação:

```txt
Este aparelho custa aproximadamente R$ 42,30 por mês.
```

Aviso:

```txt
Valor aproximado. Sua conta real pode variar.
```

## 13.4 Ações

| Ação | Resultado |
|---|---|
| Salvar | Salva no histórico |
| Comparar | Abre comparação |
| Calcular outro | Volta para Calcular |
| Editar dados | Volta ao passo correspondente |
| Ver dicas | Oferece anúncio premiado |

## 13.5 Estado após salvar

Mensagem:

```txt
Cálculo salvo.
```

Se histórico gratuito estiver cheio:

```txt
Seu histórico grátis está cheio.
Assista um anúncio para liberar mais espaços por 24 horas.
```

## 13.6 Anúncios no resultado

Permitido:

- Banner abaixo das ações.
- Card de anúncio premiado para dicas.
- Intersticial apenas após sair do resultado, respeitando cooldown.

Proibido:

- Banner acima do valor mensal.
- Intersticial antes do usuário ver o resultado.
- Anúncio cobrindo botões principais.

---

# 14. Fluxo de salvar cálculo

## 14.1 Fluxo normal

```txt
Resultado → Salvar
→ Verificar limite grátis
→ Salvar no armazenamento local
→ Mostrar "Cálculo salvo"
```

## 14.2 Histórico cheio

```txt
Resultado → Salvar
→ Histórico grátis cheio
→ Mostrar opção:
   - Assistir anúncio para liberar +5 espaços por 24h
   - Excluir cálculo antigo
   - Continuar sem salvar
```

## 14.3 Anúncio premiado para histórico

```txt
Usuário toca "Assistir anúncio"
→ Carregar rewarded ad
→ Usuário assiste até o fim
→ App define extraHistorySlotsUntil
→ Salva cálculo atual
→ Mostra "Espaços extras liberados"
```

## 14.4 Falha no anúncio

Mensagem:

```txt
Não foi possível carregar o anúncio agora.
```

Ações:

- Tentar novamente.
- Continuar sem salvar.
- Excluir cálculo antigo.

---

# 15. Fluxo de comparação

## 15.1 Entrada

A comparação pode ser aberta por:

```txt
Resultado → Comparar
```

ou:

```txt
Histórico → Comparar salvos
```

## 15.2 Sem dados suficientes

Condição:

- Menos de 2 aparelhos calculados ou salvos.

Estado:

```txt
Simule pelo menos dois aparelhos para comparar.
[Adicionar aparelho]
```

## 15.3 Comparação gratuita

Limite:

```txt
Até 3 aparelhos
```

Fluxo:

```txt
Comparar → Listar aparelhos → Ordenar por custo mensal → Mostrar maior gasto
```

Conclusão textual:

```txt
O aparelho que mais pesa é: Ar-condicionado.
```

## 15.4 Comparação expandida com anúncio

Condição:

- Usuário tenta comparar mais de 3 aparelhos.
- Não tem premium.
- Não tem `expandedComparisonUntil` ativo.

Fluxo:

```txt
Mostrar bloqueio leve
→ Explicar recompensa
→ Usuário assiste anúncio
→ Liberar comparação com até 10 aparelhos por 24h
```

Texto:

```txt
Compare mais aparelhos por 24 horas.
Assista um anúncio para desbloquear.
```

## 15.5 Ações

| Ação | Resultado |
|---|---|
| Adicionar aparelho | Vai para Calcular |
| Ver aparelho | Vai para Resultado daquele cálculo |
| Remover item | Remove da comparação |
| Limpar comparação | Pede confirmação |
| Desbloquear mais | Rewarded ad |

---

# 16. Fluxo de histórico

## 16.1 Entrada

```txt
Bottom tab → Histórico
```

## 16.2 Estado vazio

```txt
Nenhum cálculo salvo ainda.
Seus cálculos aparecerão aqui.
[Calcular agora]
```

## 16.3 Lista com dados

Cada item exibe:

- nome do aparelho;
- custo mensal;
- data;
- consumo mensal;
- ações:
  - Ver;
  - Recalcular;
  - Excluir.

## 16.4 Ver cálculo

```txt
Histórico → Ver → Resultado
```

## 16.5 Recalcular

```txt
Histórico → Recalcular
→ Abre Calcular com dados preenchidos
→ Usuário edita
→ Resultado novo
```

## 16.6 Excluir

```txt
Histórico → Excluir
→ ConfirmDialog
→ Confirmar
→ Remove item
→ Toast "Cálculo excluído"
```

## 16.7 Anúncios no histórico

Permitido:

- Banner inferior.
- Intersticial ao abrir histórico após uso recorrente e cooldown.
- Rewarded card para liberar mais espaços.

Proibido:

- Intersticial logo após excluir.
- Anúncio cobrindo lista.
- Anúncio antes do primeiro cálculo salvo.

---

# 17. Fluxo de configurações

## 17.1 Entrada

```txt
Bottom tab → Ajustes
```

## 17.2 Seções

```txt
Aparência
Idioma
Tarifa padrão
Anúncios
Dados
Sobre
```

## 17.3 Alterar tema

Fluxo:

```txt
Ajustes → Tema
→ Selecionar Automático / Claro / Escuro
→ Aplicar imediatamente
→ Salvar preferência
```

## 17.4 Alterar idioma

Fluxo:

```txt
Ajustes → Idioma
→ Selecionar Português / English / Español / Français
→ Aplicar imediatamente
→ Salvar preferência
```

## 17.5 Alterar tarifa padrão

Fluxo:

```txt
Ajustes → Tarifa padrão
→ Digitar valor
→ Salvar
→ Usar nos próximos cálculos
```

## 17.6 Limpar histórico

Fluxo:

```txt
Ajustes → Limpar histórico
→ ConfirmDialog
→ Confirmar
→ Apagar cálculos salvos
→ Toast "Histórico apagado"
```

## 17.7 Remover anúncios por 30 min

Fluxo:

```txt
Ajustes → Remover anúncios por 30 min
→ Tela ou card explica recompensa
→ Usuário assiste anúncio
→ App define adFreeUntil
→ Toast "Anúncios removidos por 30 minutos"
```

---

# 18. Fluxo de anúncios comuns

## 18.1 Banner

### Quando pode aparecer

- Início, depois do primeiro resultado.
- Histórico.
- Comparação.
- Configurações.
- Resultado, abaixo das ações.

### Quando não pode aparecer

- Antes do primeiro resultado.
- No meio dos passos de cálculo.
- Acima do custo mensal.
- Colado ao botão principal.
- Durante tela de carregamento crítico.

---

## 18.2 Intersticial comum

### Gatilhos permitidos

- Após salvar cálculo.
- Após o segundo cálculo concluído.
- Ao voltar do resultado para início.
- Ao abrir histórico depois de uso recorrente.
- Ao sair da comparação.

### Condições obrigatórias

Antes de exibir, verificar:

```txt
hasSeenFirstResult === true
adFreeUntil expirado
cooldown respeitado
não está digitando
não acabou de ver outro intersticial
não está em fluxo crítico
```

### Cooldown sugerido

```txt
Mínimo: 3 minutos entre intersticiais
ou
mínimo: 2 cálculos concluídos entre intersticiais
```

### Fallback

Se não carregar:

```txt
Continuar fluxo normalmente.
```

Não mostrar erro para o usuário se o intersticial comum falhar.

---

# 19. Fluxo de anúncio premiado

## 19.1 Regra central

O anúncio premiado sempre deve ser voluntário.

## 19.2 Estrutura padrão

```txt
Usuário tenta usar extra
→ App mostra card explicando recompensa
→ Usuário toca "Assistir anúncio"
→ App carrega anúncio
→ Se carregar, exibe
→ Se usuário concluir, entrega recompensa
→ Se usuário cancelar, não entrega
→ Se falhar, mostra mensagem simples
```

## 19.3 Recompensas da V1

| Recurso | Gratuito | Rewarded |
|---|---|---|
| Remover anúncios | Não | 30 minutos |
| Comparação | até 3 aparelhos | até 10 aparelhos por 24h |
| Histórico | até 5 cálculos | +5 espaços por 24h |
| Dicas de economia | bloqueado ou limitado | libera para o cálculo atual |
| Cenário “e se?” | limitado | libera por 30 min |

## 19.4 Cancelamento

Se o usuário fechar antes de concluir:

```txt
Anúncio não concluído.
```

Não entregar recompensa.

## 19.5 Falha ao carregar

Mensagem:

```txt
Não foi possível carregar o anúncio agora.
```

Ações:

- Tentar novamente.
- Agora não.

---

# 20. Fluxo para remover anúncios por 30 minutos

## 20.1 Entrada

Pode ser acessado por:

```txt
Início → Card remover anúncios
Ajustes → Anúncios
Desbloquear Extras → Remover anúncios
```

## 20.2 Fluxo

```txt
Usuário toca "Remover anúncios por 30 min"
→ App explica:
   "Assista um anúncio e fique 30 minutos sem anúncios comuns."
→ Usuário toca "Assistir anúncio"
→ Rewarded ad
→ Conclusão
→ Definir adFreeUntil = agora + 30 minutos
→ Remover banners/intersticiais
→ Toast
```

## 20.3 Estado ativo

Em Ajustes ou Extras:

```txt
Sem anúncios até 15:40.
```

## 20.4 Expiração

Quando expirar:

```txt
Anúncios comuns voltam automaticamente.
```

Não precisa notificar o usuário.

---

# 21. Fluxo de dicas de economia

## 21.1 Entrada

```txt
Resultado → Desbloquear dicas
```

## 21.2 Fluxo grátis

Sem anúncio:

- Mostrar apenas resultado básico.
- Não mostrar dicas avançadas.

## 21.3 Fluxo com anúncio premiado

```txt
Usuário toca em "Ver dicas de economia"
→ App explica recompensa
→ Usuário assiste anúncio
→ App libera dicas do aparelho atual
```

## 21.4 Exemplo de dica

```txt
Se usar 1 hora a menos por dia, você pode economizar cerca de R$ X por mês.
```

## 21.5 Regra

As dicas devem ser baseadas no cálculo atual. Não prometer economia garantida.

---

# 22. Fluxo de cenários “e se?”

## 22.1 Entrada

```txt
Resultado → Cenário "e se?"
```

## 22.2 Bloqueio gratuito

```txt
Compare mudanças no uso por 30 minutos.
Assista um anúncio para desbloquear.
```

## 22.3 Fluxo com anúncio

```txt
Rewarded ad concluído
→ whatIfUnlockedUntil = agora + 30 min
→ Exibir controles:
   - usar 1h a menos
   - usar metade do tempo
   - mudar tarifa
   - mudar potência
```

## 22.4 Resultado

Mostrar diferença simples:

```txt
Economia estimada: R$ 12,40 por mês.
```

---

# 23. Fluxo de idioma

## 23.1 Primeiro uso

```txt
Detectar idioma do sistema
→ Se suportado, usar automaticamente
→ Se não suportado, usar português
```

## 23.2 Troca manual

```txt
Ajustes → Idioma
→ Selecionar idioma
→ Atualizar interface imediatamente
→ Salvar locale
```

## 23.3 Idiomas suportados

```txt
pt-BR
en-US
es-ES
fr-FR
```

## 23.4 Regra técnica

Nenhuma tela deve usar texto fixo fora do sistema i18n.

---

# 24. Fluxo de tema

## 24.1 Primeiro uso

```txt
Detectar tema do sistema
→ Aplicar automaticamente
```

## 24.2 Troca manual

```txt
Ajustes → Aparência
→ Automático / Claro / Escuro
→ Aplicar imediatamente
→ Salvar preferência
```

## 24.3 Estados

| Estado | Comportamento |
|---|---|
| system | segue o aparelho |
| light | força tema claro |
| dark | força tema escuro |

---

# 25. Fluxos de erro

## 25.1 Erro de campo

Exemplo:

```txt
Digite uma potência maior que zero.
```

Comportamento:

- Mostrar erro abaixo do campo.
- Manter dados já digitados.
- Não avançar.

## 25.2 Erro ao salvar

```txt
Não foi possível salvar agora.
[Tentar novamente]
```

Comportamento:

- Não perder cálculo atual.
- Permitir tentar de novo.
- Permitir voltar ao resultado.

## 25.3 Erro ao carregar histórico

```txt
Não foi possível carregar o histórico.
[Tentar novamente]
```

## 25.4 Erro de anúncio premiado

```txt
Não foi possível carregar o anúncio agora.
```

Comportamento:

- Não travar usuário.
- Não entregar recompensa.
- Permitir tentar depois.

## 25.5 Erro inesperado

```txt
Algo deu errado.
[Tentar novamente]
```

Regra:

- Nunca mostrar stack trace ao usuário.

---

# 26. Fluxo de saída com dados não salvos

## 26.1 Condição

Usuário está no fluxo de cálculo e já preencheu algum dado.

## 26.2 Ao tocar voltar para sair

Mostrar confirmação:

```txt
Sair do cálculo?
Os dados preenchidos serão perdidos.
[Continuar calculando]
[Sair]
```

## 26.3 Regra

Não mostrar confirmação se nenhum dado foi preenchido.

---

# 27. Fluxo de edição

## 27.1 Editar a partir do resultado

```txt
Resultado → Editar dados
→ Escolher o que editar:
   - Aparelho
   - Potência
   - Uso
   - Tarifa
→ Voltar ao passo correspondente
→ Recalcular
→ Resultado atualizado
```

## 27.2 Recalcular a partir do histórico

```txt
Histórico → Recalcular
→ Abrir Calcular com dados preenchidos
→ Usuário altera
→ Resultado novo
```

## 27.3 Regra

Não sobrescrever cálculo antigo automaticamente. Se salvar novamente, criar novo registro ou pedir confirmação.

---

# 28. Fluxo de limpeza de dados

## 28.1 Limpar histórico

```txt
Ajustes → Limpar histórico
→ ConfirmDialog
→ Confirmar
→ Apagar histórico local
→ Voltar para Ajustes
```

## 28.2 Mensagem

```txt
Histórico apagado.
```

## 28.3 Regra

Não apagar:

- idioma;
- tema;
- tarifa padrão;
- estado de anúncios;
- premium.

---

# 29. Critérios de conclusão do fluxo

O fluxo estará correto quando:

- O usuário fizer o primeiro cálculo sem cadastro.
- Nenhum anúncio aparecer antes do primeiro resultado.
- O cálculo acontecer em no máximo 4 passos.
- Cada passo tiver uma pergunta clara.
- O resultado mensal for compreendido imediatamente.
- O usuário conseguir salvar um cálculo.
- O usuário conseguir abrir histórico.
- O usuário conseguir comparar aparelhos.
- O usuário conseguir mudar idioma.
- O usuário conseguir mudar tema.
- O usuário conseguir remover anúncios por 30 minutos via anúncio premiado.
- O usuário conseguir desbloquear extras via anúncio premiado.
- O usuário não ficar preso em nenhuma tela.
- O app funcionar em português, inglês, espanhol e francês.
- O app funcionar em tema claro e escuro.
- O app preservar acessibilidade para idosos.

---

# 30. Rotas sugeridas

## 30.1 Expo Router

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

## 30.2 Mapeamento

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

# 31. Hooks necessários para o fluxo

```txt
useCalculation
useHistory
useTariff
useAdsAccess
useAppLocale
useAppTheme
usePremium
```

## 31.1 useCalculation

Responsável por:

- estado temporário do cálculo;
- validação por passo;
- cálculo do resultado;
- edição e recálculo.

## 31.2 useHistory

Responsável por:

- salvar cálculo;
- listar histórico;
- excluir;
- recalcular;
- verificar limite gratuito.

## 31.3 useTariff

Responsável por:

- tarifa padrão;
- salvar tarifa;
- carregar tarifa;
- formatar tarifa por locale.

## 31.4 useAdsAccess

Responsável por:

- saber se anúncios comuns devem aparecer;
- controlar `adFreeUntil`;
- controlar cooldown de intersticial;
- controlar recompensas temporárias;
- lidar com falha de anúncio.

## 31.5 useAppLocale

Responsável por:

- idioma do sistema;
- troca manual;
- persistência;
- integração com i18n.

## 31.6 useAppTheme

Responsável por:

- tema do sistema;
- claro;
- escuro;
- persistência.

---

# 32. Regras anti-confusão

## 32.1 Não usar dashboard na home

A home deve ter:

- CTA para cálculo;
- último cálculo;
- tarifa salva;
- acesso a extras.

Não deve ter:

- gráfico;
- ranking completo;
- lista longa;
- múltiplas métricas;
- textos técnicos.

## 32.2 Não mostrar todas as configurações de uma vez no cálculo

O cálculo deve ser passo a passo.

## 32.3 Não colocar comparação como aba principal

A comparação deve ser uma consequência do cálculo, não o centro do app.

## 32.4 Não interromper preenchimento com anúncio

Anúncios comuns não podem aparecer durante os passos do cálculo.

## 32.5 Não criar onboarding longo

A tela inicial já deve explicar o suficiente.

---

# 33. Fluxo mínimo para MVP

Se for necessário reduzir ainda mais, manter apenas:

```txt
Início
→ Calcular
→ Resultado
→ Histórico
→ Ajustes
```

Comparação e extras podem entrar após o cálculo principal estar funcionando.

---

# 34. Próximo arquivo recomendado

Após este fluxo, criar:

```txt
docs/04_SCREEN_SPECS.md
```

O próximo documento deve transformar cada tela em especificação técnica para o Codex, incluindo:

- rota;
- objetivo;
- componentes;
- dados;
- ações;
- estados;
- anúncios permitidos;
- anúncios proibidos;
- comportamento em tema claro/escuro;
- comportamento multilíngue;
- critérios de aceitação.
