# Auditoria após correções — 13/09/2026

Base revisada: ce341ba. Este relatório acompanha o commit que o contém.
Escopo: implementação do plano pendente; testes de código e SDK simulado. Não constitui aprovação das lojas nem certificação de ausência de falhas.

## Alterações verificadas

- Cadastro da casa independente do histórico e dos limites publicitários. Inclusão explícita pelo resultado ou importação de registros escolhidos. Edição preserva o identificador do aparelho; salvar novamente não duplica. Remover da casa não remove histórico ou faturas.
- Moeda preservada no recálculo e nos registros. Metas globais separadas por BRL/USD/EUR; cada fatura registra sua própria moeda, meta, ações e referência de estimativa. Alterar um checkbox não muda moeda. Trocar moeda padrão limpa a tarifa padrão, sem converter cálculos antigos.
- Faturas selecionáveis por mês local, inclusive anteriores, com edição e exclusão confirmada. Todos os períodos salvos ficam acessíveis. Valores zero são aceitos. Diferenças de kWh/custo mantêm o sinal e períodos são comparados somente na mesma moeda. Duração, tarifas e impostos diferentes continuam exigindo interpretação pelo usuário.
- Registros antigos sem referência de estimativa não recebem comparações retroativas inventadas. Os snapshots existentes são preservados ao editar uma fatura.
- Formulário de cálculo remonta ao iniciar ou carregar um recálculo, sem reutilizar campos da operação anterior.
- Leitura de cada chave local isolada; JSON malformado e falhas de leitura não autorizam sobrescrita. Falha em configurações impede regravar moedas legadas presumidas. A interface avisa problemas de persistência e oferece nova tentativa.
- Histórico recuperável tem resultados recalculados a partir de entradas validadas. Datas, moeda, cômodo, números finitos e duplicação de IDs são tratados.
- Recompensa concedida no evento EARNED_REWARD, com gravação enfileirada imediatamente e sem esperar fechamento/conexão. Queda de rede posterior não revoga benefícios. Falhas físicas de armazenamento/processo não podem ter garantia absoluta; o app sinaliza erros de persistência.
- Exclusão mútua de anúncios e formulário de privacidade. Prazo existe para carregamento/rede, não para fingir que um anúncio apresentado fechou. O bloqueio só é liberado por fechamento/erro nativo; eventos nativos ausentes são tratados de forma conservadora, sem iniciar outro anúncio por temporizador.
- Intersticial só aparece se já estiver carregado na transição Calcular outro. Se não estiver pronto, a oportunidade é ignorada. Não há intersticial ao voltar da comparação.
- App Open automático desativado por ausência de uma etapa real de carregamento; anúncios nativos continuam sem colocação nas telas. Banners e premiados permanecem.
- Denúncia de anúncio acessível nos Ajustes e sob banners. Abre formulário público do GitHub, com descrição voluntária, plataforma e horário de preparação; avisa publicidade do conteúdo e possível necessidade de conta. Nada é enviado automaticamente.
- Textos nos quatro idiomas descrevem hipóteses ilustrativas, não um plano personalizado com garantia de economia. Política interna, pública e notas da revisão foram alinhadas.
- Deep links nativos aceitam somente rotas conhecidas, descartam parâmetros e rejeitam tamanho excessivo ou caminho malformado antes do decodificador legado.

## Evidências executadas

- npm test: 19 testes aprovados. Incluem migração, falha isolada de leitura, moeda, metas, cadastro sem duplicação, recompensa antes do fechamento, offline, timeout de carga, concorrência e deep links.
- npm run check: TypeScript e lint aprovados.
- npx expo-doctor: 18/18 verificações aprovadas.
- npx expo export --platform web: 18 rotas exportadas. Exportação não é teste de renderização interativa nem de SDK nativo.
- npx expo export --platform all: bundles Hermes iOS (3,43 MB), Android (3,42 MB) e web gerados com sucesso. Não equivale a compilar/instalar o binário nativo no EAS.
- Configuração nativa introspectada: supportsTablet=false; NSUserTrackingUsageDescription presente; GADApplicationIdentifier iOS correto; 50 entradas SKAdNetwork.
- Atualizações compatíveis: @xmldom/xmldom 0.8.15/0.9.12, fast-uri 3.1.7, js-yaml 3.15.2/4.3.2. Override PostCSS 8.5.28 no mesmo major.
- npm audit: 29 alertas (12 altos/17 moderados) antes, 25 (8 altos/17 moderados) depois. A contagem inclui propagação de dependências.

## Riscos e validações ainda pendentes

1. A automação visual não executou: o navegador encerrou duas vezes e a ferramenta alternativa falhou com helper_unknown_error do sandbox. Nenhum teste visual em navegador/iPhone deve ser considerado aprovado nesta rodada.
2. Testar nova build iPhone: instalação limpa e atualização, quatro idiomas, moedas, cadastro/edição, faturas, offline, UMP/ATT, cada anúncio de teste, erro/fechamento, retorno do segundo plano e persistência após reinício. Android também precisa de validação nativa.
3. AdMob UMP/ATT publicado, rótulos App Store Connect, classificação etária, controles de targeting/AdChoices dos criativos e recebimento de denúncias dependem das contas/SDK real. Não foram confirmados aqui.
4. Alertas residuais: image-size (cadeia Metro/build), uuid (cadeia Expo) e decode-uri-component (query-string/roteamento), além de dependências que herdam esses alertas. Não há justificativa para afirmar que todos são inexploráveis. O decodificador corrigido 0.5.0 é ESM e não substitui diretamente o require CommonJS usado pelo query-string atual; a mitigação adicionada cobre entrada de links NATIVOS. Uma publicação web precisaria de análise própria. Reavaliar migração de SDK em rodada dedicada, sem npm audit fix --force.
5. A funcionalidade nova melhora a utilidade, mas não prova unicidade nem garante reversão da recusa 4.3. Confirmar a build rejeitada, origem dos assets/código, apps relacionados e pedir exemplos à Apple.
6. Gerar nova build EAS e conferir Xcode/SDK efetivos nos logs. Não foi criada nem enviada uma build para as lojas nesta rodada. Renovar capturas com essa build real.

## Referências

- [Diretrizes Apple](https://developer.apple.com/app-store/review/guidelines/)
- [Orientação de App Open do Google](https://developers.google.com/admob/ios/app-open)
- [Alerta do decodificador de URI e mitigação por limite de entrada](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr)
