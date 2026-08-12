# PowerCost

Aplicativo Expo/React Native para estimar o consumo e o custo mensal de aparelhos elétricos. A implementação segue os documentos de `docs/` e as referências visuais em `screens_light/`, `screens_dark/` e `support/`.

## Stack

- Expo SDK 54 + React Native 0.81
- TypeScript + Expo Router
- AsyncStorage (local-first)
- `expo-localization` com português, inglês, espanhol e francês
- temas claro, escuro e automático
- Google Mobile Ads em development/native build, usando IDs oficiais de teste
- placeholders seguros no Expo Go e na web

## Como executar

```bash
npm install
npm start
```

No Windows com política restrita do PowerShell, use `npm.cmd` e `npx.cmd`.

```bash
npm.cmd start
npm.cmd run android
npm.cmd run web
```

## Verificações

```bash
npm run check
npx expo export --platform web
```

Para servir a exportação estática gerada em `dist/`:

```bash
npm run preview:web
```

## Anúncios

O projeto já contém configuração e IDs oficiais de teste do Google. O SDK de anúncios tem código nativo e não funciona dentro do Expo Go; use uma development build/EAS para testar banners, intersticiais e rewarded reais.

```bash
npx eas-cli build --profile development
```

Antes de publicar, substitua os IDs de teste em `app.json` pelos IDs reais da conta AdMob e revise política de privacidade/consentimento aplicável.

## Estrutura principal

- `app/`: rotas e telas
- `src/context/`: estado global e persistência
- `src/components/`: UI e anúncios
- `src/i18n/`: traduções dos quatro idiomas
- `src/services/`: integração de anúncios por plataforma
- `src/utils/`: cálculo e formatação
- `docs/`: especificações funcionais
- `screens_light/` e `screens_dark/`: referências visuais

## Comandos de build

O arquivo `eas.json` inclui perfis `development`, `preview` e `production`. Nenhuma publicação é feita automaticamente.
