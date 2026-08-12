# PowerCost — guia de declarações de privacidade nas lojas

Data da revisão: 12 de agosto de 2026

Este documento é um roteiro editorial para preencher App Store Connect, Google Play Console e AdMob. As respostas finais devem refletir a configuração efetivamente publicada e ser revisadas sempre que o SDK de anúncios ou o tratamento de dados mudar.

## Dados próprios do PowerCost

- Não há criação de conta, login, backend próprio ou envio do histórico de cálculos a um servidor do PowerCost.
- Cálculos, tarifa, idioma, tema, histórico e desbloqueios temporários ficam no AsyncStorage do aparelho.
- O usuário pode apagar itens do histórico, limpar todo o histórico ou excluir todos os dados locais nos Ajustes.
- A desinstalação normalmente remove esses dados locais, sujeita aos mecanismos de backup/restauração do sistema operacional.

## Google Mobile Ads

O app integra o Google Mobile Ads SDK e, por isso, as declarações não podem afirmar que nenhum dado é coletado. Validar na documentação atual do SDK e no relatório do Play Console, no mínimo:

- identificadores do dispositivo ou de publicidade;
- endereço IP e localização aproximada inferida;
- interações com o app e com anúncios;
- diagnósticos, desempenho e informações do dispositivo;
- finalidade de publicidade, medição, prevenção de fraude, segurança e personalização quando consentida.

Os dados podem ser processados pelo Google e parceiros. A caracterização como coleta, compartilhamento, rastreamento ou vinculação ao usuário depende da plataforma, região, consentimento e configuração publicada.

## Google Play — Data Safety

Antes do envio:

1. Consultar a seção de divulgação de dados do Google Mobile Ads SDK vigente.
2. Declarar os tipos de dados coletados pelo SDK mesmo que o PowerCost não os receba diretamente.
3. Marcar criptografia em trânsito somente conforme a declaração oficial do SDK.
4. Explicar que os dados próprios do usuário são locais e podem ser apagados dentro do app.
5. Não marcar o app como direcionado a crianças sem uma revisão específica das políticas Families e da configuração de anúncios.

## Apple — App Privacy e ATT

Antes do envio:

1. Preencher os rótulos de privacidade considerando o Google Mobile Ads SDK e sua configuração real.
2. Se houver rastreamento entre apps/sites ou acesso ao IDFA, manter a descrição de uso e apresentar ATT antes do rastreamento.
3. Não indicar rastreamento se a build publicada estiver tecnicamente configurada para anúncios não personalizados e sem rastreamento; validar isso em aparelho e no painel do provedor.
4. Garantir que a resposta da App Privacy seja coerente com a política pública e com o formulário UMP exibido.

## URLs e contato

- Usar as URLs públicas de política, termos e suporte registradas em `docs/09_STORE_LISTING_METADATA.md`.
- Recomenda-se migrar futuramente para as rotas `/privacy` e `/terms` em domínio próprio.
- A página pública de issues funciona como suporte inicial. Recomenda-se adicionar também um e-mail oficial antes da submissão.
- Manter a data da política e o conteúdo dos quatro idiomas sincronizados.

## Teste de aceite de privacidade

- Instalação nova em região com consentimento: nenhum anúncio é solicitado antes da conclusão do fluxo aplicável.
- Recusa de personalização: o app continua funcional.
- Ajustes > Opções de privacidade dos anúncios: reabre o formulário quando o SDK informa que ele está disponível.
- Ajustes > Excluir todos os dados locais: confirmação aparece; após aceitar, histórico, preferências e desbloqueios somem.
- Reinicialização após exclusão: dados apagados não reaparecem.
- Política e Termos: abrem nos quatro idiomas, respeitam tema claro/escuro e permitem voltar.
- Build iOS real: ATT aparece somente quando necessário e antes do rastreamento.
- Todos os formatos de anúncio são testados em build de desenvolvimento com IDs de teste e em release controlada antes da publicação.
