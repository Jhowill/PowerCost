# PowerCost — revisão de segurança e conformidade

Data da revisão: 12 de agosto de 2026

## Resultado técnico

- Expo Doctor: 18/18 verificações aprovadas.
- TypeScript e ESLint aprovados.
- Exportação web: 13 rotas geradas sem erro.
- Nenhum segredo privado encontrado no código. IDs públicos do AdMob não são credenciais secretas.
- O app não solicita câmera, localização, contatos, microfone ou outras permissões sensíveis.
- Os cálculos e preferências permanecem locais no AsyncStorage.

## Correções aplicadas

- Medição do AdMob atrasada até a conclusão do fluxo de consentimento UMP.
- Opções de privacidade do Google acessíveis nos Ajustes.
- Descrição de uso do identificador de rastreamento adicionada ao iOS.
- Anúncios reais restritos a builds de release; desenvolvimento usa IDs de teste.
- Bloqueio de anúncios em tela cheia simultâneos.
- Timeout limitado ao carregamento, sem interromper vídeos premiados em exibição.
- Rejeições de `ad.show()` tratadas para evitar Promise não capturada.
- App Open removido do carregamento tardio da Home e mantido apenas no retorno ao app, com intervalo mínimo de 10 minutos.
- Intersticial removido da ação de salvar; permanece somente em pausas naturais do fluxo.
- Hidratação local agora possui fallback para falha do AsyncStorage.
- Dados persistidos antigos ou corrompidos são normalizados antes do uso.
- Política de Privacidade e Termos de Uso completos disponíveis dentro do app em quatro idiomas.
- Rotas web `/privacy` e `/terms` prontas para publicação estática em HTTPS.
- Exclusão integral dos dados locais disponível nos Ajustes, com confirmação destrutiva e tratamento de falha.
- Permissões Android de sobreposição e armazenamento externo bloqueadas explicitamente no manifesto final.
- Backup Android desativado para impedir a restauração inesperada de dados locais apagados.
- SDK de anúncios reinicializado quando uma nova escolha de privacidade passa a permitir solicitações.
- Classificação máxima de conteúdo publicitário definida como PG e app configurado como não direcionado a crianças; a condição individual de idade permanece a cargo do consentimento regional.
- Configuração ProGuard do UMP preservada em builds Android otimizadas.
- Declaração de criptografia não isenta configurada como falsa no iOS.

## Pendências obrigatórias antes da submissão

1. Cadastrar nas lojas as URLs públicas registradas em `docs/09_STORE_LISTING_METADATA.md`. Migrar para domínio próprio é recomendável, mas não bloqueia o primeiro envio enquanto os documentos do GitHub estiverem públicos.
2. Configurar no painel do AdMob as mensagens UMP para EEA/Reino Unido, estados americanos aplicáveis e, no iOS, a mensagem explicativa de ATT quando rastreamento/personalização for utilizado.
3. Preencher o Data Safety do Google Play considerando também o Google Mobile Ads SDK. Revisar pelo menos identificadores do dispositivo, interações com o produto, diagnósticos e endereço IP/localização aproximada conforme a configuração efetiva do SDK.
4. Preencher o App Privacy da Apple de forma coerente com o AdMob e com a decisão sobre anúncios personalizados/rastreamento.
5. Definir o público-alvo como não direcionado a crianças, salvo se o app for adaptado integralmente às políticas Families/Kids e os anúncios forem configurados para isso.
6. Testar consentimento, ATT, banner, nativo, intersticial, premiado e App Open em builds EAS de release em aparelhos físicos Android e iOS. Expo Go não contém o módulo nativo do AdMob.
7. Recomenda-se informar também um e-mail público do responsável. Enquanto ele não for fornecido, o repositório usa a página pública de suporte por issues.

## Dependências

O `npm audit --omit=dev` encontrou 22 alertas transitivos: 0 críticos, 12 altos e 10 moderados. A maior parte está na cadeia de ferramentas Expo/Metro/PostCSS e o reparo automático sugerido migra para Expo 57, contrariando o requisito atual de Expo 54. Não foi aplicada uma atualização principal insegura. Reavaliar ao planejar a migração oficial de SDK.

## Referências oficiais

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- App Tracking Transparency: https://developer.apple.com/documentation/apptrackingtransparency
- Google Play User Data: https://support.google.com/googleplay/android-developer/answer/10144311
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Mobile Ads privacy: https://developers.google.com/admob/android/privacy
- Google Mobile Ads App Open: https://developers.google.com/admob/android/app-open
