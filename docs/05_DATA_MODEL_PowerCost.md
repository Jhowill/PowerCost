# 05_DATA_MODEL.md

# Data Model — PowerCost

## 1. Identificação

**App:** PowerCost  
**Arquivo:** `docs/05_DATA_MODEL.md`  
**Fase:** 05 — Data Model  
**Stack-alvo:** Expo + React Native + TypeScript + Expo Router  
**Persistência V1:** AsyncStorage  
**Modo de funcionamento:** local-first/offline para cálculo e histórico  
**Idiomas:** português, inglês, espanhol e francês  
**Temas:** sistema, claro e escuro  
**Monetização:** anúncios comuns + anúncios premiados + premium futuro

---

# 2. Objetivo deste documento

Este arquivo define os modelos de dados do PowerCost para orientar a implementação no Codex.

O app deve continuar simples para o usuário, mas o código precisa ser organizado, previsível e fácil de evoluir.

O modelo de dados cobre:

- catálogo de aparelhos;
- cálculo de consumo;
- resultado;
- histórico;
- configurações;
- idioma;
- tema;
- anúncios;
- recompensas temporárias;
- premium futuro;
- validações;
- storage local;
- migração de dados.

---

# 3. Princípios do modelo de dados

## 3.1 Local-first

O cálculo principal deve funcionar sem internet.

A internet só é necessária para:

- carregar anúncios comuns;
- carregar anúncios premiados;
- compra premium futura;
- links externos, como política de privacidade.

## 3.2 Separação obrigatória

Não misturar:

```txt
UI
cálculo
storage
ads
premium
i18n
tema
```

A tela deve consumir hooks e serviços.  
A tela não deve acessar AsyncStorage diretamente.

## 3.3 Dados simples

O app é para uso fácil, inclusive por idosos.  
O modelo deve evitar entidades complexas demais na V1.

## 3.4 Evolução controlada

Toda alteração futura no storage deve usar versão de schema.

---

# 4. Estrutura de pastas recomendada

```txt
src/
  types/
    appliance.ts
    simulation.ts
    settings.ts
    ads.ts
    premium.ts
    i18n.ts
    storage.ts

  constants/
    applianceCatalog.ts
    appLimits.ts
    adRules.ts
    storageKeys.ts
    locales.ts

  utils/
    energyCalculations.ts
    validators.ts
    formatters.ts
    dates.ts

  services/
    historyStorage.ts
    settingsStorage.ts
    adsStateStorage.ts
    premiumService.ts
    adsService.ts
    migrationService.ts

  hooks/
    useCalculation.ts
    useHistory.ts
    useTariff.ts
    useAdsAccess.ts
    useAppLocale.ts
    useAppTheme.ts
    usePremium.ts
```

---

# 5. Tipos base

## 5.1 Identificadores

```ts
export type EntityId = string;

export type ISODateString = string;
```

Regras:

- IDs devem ser strings.
- Datas devem ser salvas em ISO string.
- Não salvar objeto `Date` diretamente no storage.

Exemplo:

```ts
const now = new Date().toISOString();
```

---

# 6. Idiomas

## 6.1 SupportedLocale

```ts
export type SupportedLocale =
  | 'pt-BR'
  | 'en-US'
  | 'es-ES'
  | 'fr-FR';
```

## 6.2 LocaleInfo

```ts
export type LocaleInfo = {
  locale: SupportedLocale;
  label: string;
  nativeLabel: string;
  regionLabel: string;
};
```

## 6.3 Locales suportados

```ts
export const SUPPORTED_LOCALES: LocaleInfo[] = [
  {
    locale: 'pt-BR',
    label: 'Portuguese',
    nativeLabel: 'Português',
    regionLabel: 'Brasil',
  },
  {
    locale: 'en-US',
    label: 'English',
    nativeLabel: 'English',
    regionLabel: 'United States',
  },
  {
    locale: 'es-ES',
    label: 'Spanish',
    nativeLabel: 'Español',
    regionLabel: 'España',
  },
  {
    locale: 'fr-FR',
    label: 'French',
    nativeLabel: 'Français',
    regionLabel: 'France',
  },
];
```

## 6.4 Regra de fallback

```ts
export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';
```

Se o idioma do aparelho não for suportado:

```txt
usar pt-BR
```

---

# 7. Tema

## 7.1 AppTheme

```ts
export type AppTheme = 'system' | 'light' | 'dark';
```

## 7.2 ThemeModeResolved

```ts
export type ThemeModeResolved = 'light' | 'dark';
```

## 7.3 Regras

- `system`: segue o tema do aparelho.
- `light`: força modo claro.
- `dark`: força modo escuro.
- A preferência deve ser salva em `AppSettings`.

---

# 8. Moeda

## 8.1 CurrencyCode

```ts
export type CurrencyCode = 'BRL' | 'USD' | 'EUR';
```

## 8.2 Moeda padrão por idioma

```ts
export const DEFAULT_CURRENCY_BY_LOCALE: Record<SupportedLocale, CurrencyCode> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
  'es-ES': 'EUR',
  'fr-FR': 'EUR',
};
```

## 8.3 Observação

A V1 pode usar `BRL` como padrão global se o lançamento inicial for focado no Brasil.

Se o app for publicado internacionalmente, a moeda deve respeitar a configuração do usuário.

---

# 9. Categoria de aparelho

## 9.1 ApplianceCategory

```ts
export type ApplianceCategory =
  | 'kitchen'
  | 'bathroom'
  | 'laundry'
  | 'climate'
  | 'lighting'
  | 'office'
  | 'entertainment'
  | 'commerce'
  | 'beauty'
  | 'workshop'
  | 'other';
```

## 9.2 ApplianceCategoryMeta

```ts
export type ApplianceCategoryMeta = {
  id: ApplianceCategory;
  labelKey: string;
  iconName: string;
  sortOrder: number;
};
```

## 9.3 Categorias iniciais

```ts
export const APPLIANCE_CATEGORIES: ApplianceCategoryMeta[] = [
  {
    id: 'climate',
    labelKey: 'category.climate',
    iconName: 'snowflake',
    sortOrder: 1,
  },
  {
    id: 'bathroom',
    labelKey: 'category.bathroom',
    iconName: 'shower-head',
    sortOrder: 2,
  },
  {
    id: 'kitchen',
    labelKey: 'category.kitchen',
    iconName: 'refrigerator',
    sortOrder: 3,
  },
  {
    id: 'laundry',
    labelKey: 'category.laundry',
    iconName: 'washing-machine',
    sortOrder: 4,
  },
  {
    id: 'lighting',
    labelKey: 'category.lighting',
    iconName: 'lightbulb',
    sortOrder: 5,
  },
  {
    id: 'office',
    labelKey: 'category.office',
    iconName: 'monitor',
    sortOrder: 6,
  },
  {
    id: 'entertainment',
    labelKey: 'category.entertainment',
    iconName: 'tv',
    sortOrder: 7,
  },
  {
    id: 'commerce',
    labelKey: 'category.commerce',
    iconName: 'store',
    sortOrder: 8,
  },
  {
    id: 'beauty',
    labelKey: 'category.beauty',
    iconName: 'scissors',
    sortOrder: 9,
  },
  {
    id: 'workshop',
    labelKey: 'category.workshop',
    iconName: 'wrench',
    sortOrder: 10,
  },
  {
    id: 'other',
    labelKey: 'category.other',
    iconName: 'plug',
    sortOrder: 99,
  },
];
```

---

# 10. Aparelho

## 10.1 Appliance

```ts
export type Appliance = {
  id: string;
  nameKey: string;
  category: ApplianceCategory;
  iconName: string;
  defaultPowerWatts?: number;
  isCommon: boolean;
  isCustom: boolean;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
};
```

## 10.2 Campos

| Campo | Tipo | Obrigatório | Uso |
|---|---|---:|---|
| `id` | string | Sim | identificador |
| `nameKey` | string | Sim | chave i18n |
| `category` | ApplianceCategory | Sim | categoria |
| `iconName` | string | Sim | ícone |
| `defaultPowerWatts` | number | Não | potência aproximada |
| `isCommon` | boolean | Sim | aparece nos mais usados |
| `isCustom` | boolean | Sim | criado pelo usuário |
| `createdAt` | ISODateString | Não | usado em personalizados |
| `updatedAt` | ISODateString | Não | usado em personalizados |

## 10.3 Regra sobre potência padrão

`defaultPowerWatts` é apenas uma sugestão aproximada.  
O app deve permitir edição.

Mensagem associada:

```txt
Vamos usar uma potência aproximada. Você pode alterar depois.
```

---

# 11. Catálogo inicial de aparelhos

## 11.1 Observação

Os valores abaixo são apenas aproximações para facilitar o uso quando o usuário toca em “Não sei”.

Não devem ser apresentados como valor oficial.

## 11.2 ApplianceCatalog

```ts
export const APPLIANCE_CATALOG: Appliance[] = [
  {
    id: 'air_conditioner',
    nameKey: 'appliance.airConditioner',
    category: 'climate',
    iconName: 'snowflake',
    defaultPowerWatts: 1500,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'electric_shower',
    nameKey: 'appliance.electricShower',
    category: 'bathroom',
    iconName: 'shower-head',
    defaultPowerWatts: 5500,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'refrigerator',
    nameKey: 'appliance.refrigerator',
    category: 'kitchen',
    iconName: 'refrigerator',
    defaultPowerWatts: 150,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'fan',
    nameKey: 'appliance.fan',
    category: 'climate',
    iconName: 'fan',
    defaultPowerWatts: 100,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'television',
    nameKey: 'appliance.television',
    category: 'entertainment',
    iconName: 'tv',
    defaultPowerWatts: 120,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'washing_machine',
    nameKey: 'appliance.washingMachine',
    category: 'laundry',
    iconName: 'washing-machine',
    defaultPowerWatts: 500,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'desktop_computer',
    nameKey: 'appliance.desktopComputer',
    category: 'office',
    iconName: 'monitor',
    defaultPowerWatts: 300,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'led_lamp',
    nameKey: 'appliance.ledLamp',
    category: 'lighting',
    iconName: 'lightbulb',
    defaultPowerWatts: 10,
    isCommon: true,
    isCustom: false,
  },
  {
    id: 'microwave',
    nameKey: 'appliance.microwave',
    category: 'kitchen',
    iconName: 'microwave',
    defaultPowerWatts: 1200,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'electric_oven',
    nameKey: 'appliance.electricOven',
    category: 'kitchen',
    iconName: 'oven',
    defaultPowerWatts: 1500,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'air_fryer',
    nameKey: 'appliance.airFryer',
    category: 'kitchen',
    iconName: 'cooking-pot',
    defaultPowerWatts: 1500,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'iron',
    nameKey: 'appliance.iron',
    category: 'laundry',
    iconName: 'shirt',
    defaultPowerWatts: 1200,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'hair_dryer',
    nameKey: 'appliance.hairDryer',
    category: 'beauty',
    iconName: 'wind',
    defaultPowerWatts: 1800,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'freezer',
    nameKey: 'appliance.freezer',
    category: 'kitchen',
    iconName: 'box',
    defaultPowerWatts: 200,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'router',
    nameKey: 'appliance.router',
    category: 'office',
    iconName: 'wifi',
    defaultPowerWatts: 15,
    isCommon: false,
    isCustom: false,
  },
  {
    id: 'custom',
    nameKey: 'appliance.custom',
    category: 'other',
    iconName: 'plug',
    isCommon: true,
    isCustom: true,
  },
];
```

---

# 12. Entrada da simulação

## 12.1 SimulationInput

```ts
export type SimulationInput = {
  applianceId?: string;
  applianceName: string;
  applianceNameKey?: string;
  category?: ApplianceCategory;
  powerWatts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  tariffPerKwh: number;
  currency: CurrencyCode;
};
```

## 12.2 Campos

| Campo | Tipo | Obrigatório | Regra |
|---|---|---:|---|
| `applianceId` | string | Não | pode ser personalizado |
| `applianceName` | string | Sim | nome exibível |
| `applianceNameKey` | string | Não | usado no catálogo |
| `category` | ApplianceCategory | Não | filtro/organização |
| `powerWatts` | number | Sim | maior que zero |
| `hoursPerDay` | number | Sim | 0 a 24 |
| `daysPerMonth` | number | Sim | 1 a 31 |
| `tariffPerKwh` | number | Sim | maior que zero |
| `currency` | CurrencyCode | Sim | BRL/USD/EUR |

---

# 13. Rascunho da simulação

## 13.1 CalculationStep

```ts
export type CalculationStep =
  | 'appliance'
  | 'power'
  | 'usageTariff';
```

## 13.2 CalculationDraft

```ts
export type CalculationDraft = {
  step: CalculationStep;

  applianceId?: string;
  applianceName?: string;
  applianceNameKey?: string;
  category?: ApplianceCategory;
  customApplianceName?: string;

  powerWatts?: number;
  hoursPerDay?: number;
  daysPerMonth?: number;
  tariffPerKwh?: number;

  currency: CurrencyCode;
  saveTariffAsDefault: boolean;

  startedAt: ISODateString;
  updatedAt?: ISODateString;
};
```

## 13.3 Regras

- O draft não precisa ser persistido na V1.
- Se o usuário tentar sair com dados preenchidos, exibir confirmação.
- Se no futuro persistir draft, criar storage separado.

---

# 14. Resultado da simulação

## 14.1 ImpactLevel

```ts
export type ImpactLevel = 'low' | 'medium' | 'high';
```

## 14.2 SimulationResult

```ts
export type SimulationResult = {
  consumptionKwhMonth: number;
  consumptionKwhYear: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
  impactLevel: ImpactLevel;
};
```

## 14.3 Critério inicial de impacto

A classificação deve ser simples e ajustável.

```ts
export const getImpactLevel = (costPerMonth: number): ImpactLevel => {
  if (costPerMonth < 20) return 'low';
  if (costPerMonth < 80) return 'medium';
  return 'high';
};
```

## 14.4 Observação

Essas faixas não são científicas.  
São apenas orientação visual para o usuário.

---

# 15. Simulação salva

## 15.1 SavedSimulation

```ts
export type SavedSimulation = {
  id: EntityId;
  input: SimulationInput;
  result: SimulationResult;
  notes?: string;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
};
```

## 15.2 Regras

- O histórico deve ordenar por `createdAt` do mais recente para o mais antigo.
- Recalcular a partir do histórico não deve sobrescrever o cálculo antigo automaticamente.
- Se o usuário salvar novamente, criar novo registro ou pedir confirmação em versão futura.
- Na V1, criar novo registro é mais simples.

---

# 16. Configurações do app

## 16.1 AppSettings

```ts
export type AppSettings = {
  schemaVersion: number;

  locale: SupportedLocale;
  theme: AppTheme;
  currency: CurrencyCode;

  defaultTariffPerKwh?: number;

  hasCompletedFirstCalculation: boolean;
  hasSeenFirstResult: boolean;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
```

## 16.2 Valores padrão

```ts
export const DEFAULT_APP_SETTINGS: AppSettings = {
  schemaVersion: 1,
  locale: 'pt-BR',
  theme: 'system',
  currency: 'BRL',
  defaultTariffPerKwh: undefined,
  hasCompletedFirstCalculation: false,
  hasSeenFirstResult: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

## 16.3 Regras

- `hasSeenFirstResult` controla quando anúncios comuns podem começar.
- `defaultTariffPerKwh` deve preencher o campo de tarifa automaticamente.
- Alterações de idioma e tema devem ser persistidas.

---

# 17. Limites grátis

## 17.1 AppLimits

```ts
export type AppLimits = {
  freeHistoryLimit: number;
  freeComparisonLimit: number;
  rewardedHistoryExtraSlots: number;
  rewardedComparisonLimit: number;
};
```

## 17.2 Valores recomendados

```ts
export const APP_LIMITS: AppLimits = {
  freeHistoryLimit: 5,
  freeComparisonLimit: 3,
  rewardedHistoryExtraSlots: 5,
  rewardedComparisonLimit: 10,
};
```

## 17.3 Regras

- A primeira simulação nunca deve ser bloqueada.
- O resultado básico nunca deve ser bloqueado.
- Os limites devem ser aplicados somente a histórico, comparação e extras.

---

# 18. Durações de recompensas por anúncio

## 18.1 RewardDurationMinutes

```ts
export type RewardDurationMinutes = number;
```

## 18.2 RewardDurations

```ts
export const REWARD_DURATIONS = {
  adFreeMinutes: 30,
  expandedComparisonMinutes: 24 * 60,
  extraHistorySlotsMinutes: 24 * 60,
  whatIfMinutes: 30,
} as const;
```

---

# 19. AdsState

## 19.1 RewardedFeature

```ts
export type RewardedFeature =
  | 'ad_free'
  | 'expanded_comparison'
  | 'extra_history_slots'
  | 'energy_tips'
  | 'what_if';
```

## 19.2 AdsState

```ts
export type AdsState = {
  schemaVersion: number;

  adFreeUntil?: ISODateString;
  expandedComparisonUntil?: ISODateString;
  extraHistorySlotsUntil?: ISODateString;
  whatIfUnlockedUntil?: ISODateString;

  tipsUnlockedSimulationIds: EntityId[];

  lastInterstitialShownAt?: ISODateString;
  completedCalculationsSinceLastInterstitial: number;

  rewardedAdsWatchedToday: number;
  lastRewardedAdWatchedAt?: ISODateString;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};
```

## 19.3 Valores padrão

```ts
export const DEFAULT_ADS_STATE: AdsState = {
  schemaVersion: 1,

  adFreeUntil: undefined,
  expandedComparisonUntil: undefined,
  extraHistorySlotsUntil: undefined,
  whatIfUnlockedUntil: undefined,

  tipsUnlockedSimulationIds: [],

  lastInterstitialShownAt: undefined,
  completedCalculationsSinceLastInterstitial: 0,

  rewardedAdsWatchedToday: 0,
  lastRewardedAdWatchedAt: undefined,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

## 19.4 Regras

- Se `adFreeUntil` estiver ativo, não mostrar banners nem intersticiais comuns.
- Rewarded ads voluntários ainda podem aparecer.
- `tipsUnlockedSimulationIds` libera dicas para cálculos específicos.
- Intersticiais devem respeitar cooldown.

---

# 20. Controle de anúncios comuns

## 20.1 InterstitialRules

```ts
export type InterstitialRules = {
  minMinutesBetweenInterstitials: number;
  minCalculationsBetweenInterstitials: number;
  blockBeforeFirstResult: boolean;
};
```

## 20.2 Valores recomendados

```ts
export const INTERSTITIAL_RULES: InterstitialRules = {
  minMinutesBetweenInterstitials: 3,
  minCalculationsBetweenInterstitials: 2,
  blockBeforeFirstResult: true,
};
```

## 20.3 Função de verificação

```ts
export type CanShowInterstitialParams = {
  hasSeenFirstResult: boolean;
  adFreeUntil?: ISODateString;
  lastInterstitialShownAt?: ISODateString;
  completedCalculationsSinceLastInterstitial: number;
  now: Date;
};

export const canShowInterstitial = (
  params: CanShowInterstitialParams
): boolean => {
  if (!params.hasSeenFirstResult) return false;

  if (params.adFreeUntil && new Date(params.adFreeUntil) > params.now) {
    return false;
  }

  if (
    params.completedCalculationsSinceLastInterstitial <
    INTERSTITIAL_RULES.minCalculationsBetweenInterstitials
  ) {
    return false;
  }

  if (!params.lastInterstitialShownAt) return true;

  const last = new Date(params.lastInterstitialShownAt).getTime();
  const diffMinutes = (params.now.getTime() - last) / 1000 / 60;

  return diffMinutes >= INTERSTITIAL_RULES.minMinutesBetweenInterstitials;
};
```

---

# 21. Rewarded unlock

## 21.1 RewardedUnlockResult

```ts
export type RewardedUnlockResult =
  | {
      success: true;
      feature: RewardedFeature;
      expiresAt?: ISODateString;
      simulationId?: EntityId;
    }
  | {
      success: false;
      reason: 'not_loaded' | 'cancelled' | 'failed' | 'unknown';
    };
```

## 21.2 RewardedUnlockRequest

```ts
export type RewardedUnlockRequest = {
  feature: RewardedFeature;
  simulationId?: EntityId;
};
```

## 21.3 Regras por feature

| Feature | Efeito |
|---|---|
| `ad_free` | define `adFreeUntil` |
| `expanded_comparison` | define `expandedComparisonUntil` |
| `extra_history_slots` | define `extraHistorySlotsUntil` |
| `energy_tips` | adiciona id em `tipsUnlockedSimulationIds` |
| `what_if` | define `whatIfUnlockedUntil` |

---

# 22. Premium futuro

## 22.1 PremiumFeature

```ts
export type PremiumFeature =
  | 'remove_ads'
  | 'unlimited_history'
  | 'unlimited_comparison'
  | 'energy_tips'
  | 'what_if'
  | 'custom_categories'
  | 'multiple_tariffs'
  | 'export';
```

## 22.2 PremiumState

```ts
export type PremiumState = {
  schemaVersion: number;
  isPremium: boolean;
  entitlementId?: string;
  activeFeatures: PremiumFeature[];
  source?: 'revenuecat' | 'local_mock';
  updatedAt?: ISODateString;
};
```

## 22.3 Valor padrão

```ts
export const DEFAULT_PREMIUM_STATE: PremiumState = {
  schemaVersion: 1,
  isPremium: false,
  activeFeatures: [],
  source: 'local_mock',
};
```

## 22.4 Regra

A V1 pode deixar premium preparado, mas não precisa lançar compra real.

O app deve funcionar sem premium.

---

# 23. Histórico

## 23.1 HistoryState

```ts
export type HistoryState = {
  schemaVersion: number;
  simulations: SavedSimulation[];
  updatedAt: ISODateString;
};
```

## 23.2 Valor padrão

```ts
export const DEFAULT_HISTORY_STATE: HistoryState = {
  schemaVersion: 1,
  simulations: [],
  updatedAt: new Date().toISOString(),
};
```

## 23.3 Regras

- Ordenar por `createdAt` decrescente.
- Permitir excluir.
- Permitir abrir resultado.
- Permitir recalcular.
- Respeitar limite grátis se não houver recompensa ou premium.

---

# 24. Comparação

## 24.1 ComparisonItem

```ts
export type ComparisonItem = {
  simulationId: EntityId;
  applianceName: string;
  costPerMonth: number;
  consumptionKwhMonth: number;
  impactLevel: ImpactLevel;
};
```

## 24.2 ComparisonResult

```ts
export type ComparisonResult = {
  items: ComparisonItem[];
  totalCostPerMonth: number;
  totalConsumptionKwhMonth: number;
  highestCostItem?: ComparisonItem;
};
```

## 24.3 Função de comparação

```ts
export const buildComparison = (
  simulations: SavedSimulation[]
): ComparisonResult => {
  const items = simulations
    .map((simulation) => ({
      simulationId: simulation.id,
      applianceName: simulation.input.applianceName,
      costPerMonth: simulation.result.costPerMonth,
      consumptionKwhMonth: simulation.result.consumptionKwhMonth,
      impactLevel: simulation.result.impactLevel,
    }))
    .sort((a, b) => b.costPerMonth - a.costPerMonth);

  return {
    items,
    totalCostPerMonth: items.reduce((sum, item) => sum + item.costPerMonth, 0),
    totalConsumptionKwhMonth: items.reduce(
      (sum, item) => sum + item.consumptionKwhMonth,
      0
    ),
    highestCostItem: items[0],
  };
};
```

---

# 25. Cálculo de energia

## 25.1 EnergyCalculationInput

```ts
export type EnergyCalculationInput = {
  powerWatts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  tariffPerKwh: number;
};
```

## 25.2 calculateEnergyCost

```ts
export const calculateEnergyCost = (
  input: EnergyCalculationInput
): SimulationResult => {
  const consumptionKwhMonth =
    (input.powerWatts * input.hoursPerDay * input.daysPerMonth) / 1000;

  const costPerMonth = consumptionKwhMonth * input.tariffPerKwh;
  const costPerDay = costPerMonth / input.daysPerMonth;
  const costPerYear = costPerMonth * 12;
  const consumptionKwhYear = consumptionKwhMonth * 12;

  return {
    consumptionKwhMonth,
    consumptionKwhYear,
    costPerDay,
    costPerMonth,
    costPerYear,
    impactLevel: getImpactLevel(costPerMonth),
  };
};
```

## 25.3 Regras

- A função deve ser pura.
- Não acessar storage.
- Não acessar i18n.
- Não formatar moeda dentro da função.
- Não arredondar os valores internamente.
- Arredondar apenas na exibição.

---

# 26. Validações

## 26.1 ValidationError

```ts
export type ValidationErrorCode =
  | 'required'
  | 'invalid_number'
  | 'must_be_positive'
  | 'min_value'
  | 'max_value'
  | 'too_short'
  | 'too_long';

export type ValidationError = {
  field: string;
  code: ValidationErrorCode;
  messageKey: string;
};
```

## 26.2 ValidationResult

```ts
export type ValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      errors: ValidationError[];
    };
```

## 26.3 validatePowerWatts

```ts
export const validatePowerWatts = (value: unknown): ValidationResult => {
  const numberValue = Number(value);

  if (value === undefined || value === null || value === '') {
    return {
      valid: false,
      errors: [
        {
          field: 'powerWatts',
          code: 'required',
          messageKey: 'error.powerRequired',
        },
      ],
    };
  }

  if (Number.isNaN(numberValue)) {
    return {
      valid: false,
      errors: [
        {
          field: 'powerWatts',
          code: 'invalid_number',
          messageKey: 'error.useOnlyNumbers',
        },
      ],
    };
  }

  if (numberValue <= 0) {
    return {
      valid: false,
      errors: [
        {
          field: 'powerWatts',
          code: 'must_be_positive',
          messageKey: 'error.powerMustBePositive',
        },
      ],
    };
  }

  return { valid: true };
};
```

## 26.4 validateHoursPerDay

```ts
export const validateHoursPerDay = (value: unknown): ValidationResult => {
  const numberValue = Number(value);

  if (value === undefined || value === null || value === '') {
    return {
      valid: false,
      errors: [
        {
          field: 'hoursPerDay',
          code: 'required',
          messageKey: 'error.hoursRequired',
        },
      ],
    };
  }

  if (Number.isNaN(numberValue)) {
    return {
      valid: false,
      errors: [
        {
          field: 'hoursPerDay',
          code: 'invalid_number',
          messageKey: 'error.useOnlyNumbers',
        },
      ],
    };
  }

  if (numberValue < 0 || numberValue > 24) {
    return {
      valid: false,
      errors: [
        {
          field: 'hoursPerDay',
          code: 'max_value',
          messageKey: 'error.hoursRange',
        },
      ],
    };
  }

  return { valid: true };
};
```

## 26.5 validateDaysPerMonth

```ts
export const validateDaysPerMonth = (value: unknown): ValidationResult => {
  const numberValue = Number(value);

  if (value === undefined || value === null || value === '') {
    return {
      valid: false,
      errors: [
        {
          field: 'daysPerMonth',
          code: 'required',
          messageKey: 'error.daysRequired',
        },
      ],
    };
  }

  if (Number.isNaN(numberValue)) {
    return {
      valid: false,
      errors: [
        {
          field: 'daysPerMonth',
          code: 'invalid_number',
          messageKey: 'error.useOnlyNumbers',
        },
      ],
    };
  }

  if (numberValue < 1 || numberValue > 31) {
    return {
      valid: false,
      errors: [
        {
          field: 'daysPerMonth',
          code: 'max_value',
          messageKey: 'error.daysRange',
        },
      ],
    };
  }

  return { valid: true };
};
```

## 26.6 validateTariffPerKwh

```ts
export const validateTariffPerKwh = (value: unknown): ValidationResult => {
  const numberValue = Number(value);

  if (value === undefined || value === null || value === '') {
    return {
      valid: false,
      errors: [
        {
          field: 'tariffPerKwh',
          code: 'required',
          messageKey: 'error.tariffRequired',
        },
      ],
    };
  }

  if (Number.isNaN(numberValue)) {
    return {
      valid: false,
      errors: [
        {
          field: 'tariffPerKwh',
          code: 'invalid_number',
          messageKey: 'error.useOnlyNumbers',
        },
      ],
    };
  }

  if (numberValue <= 0) {
    return {
      valid: false,
      errors: [
        {
          field: 'tariffPerKwh',
          code: 'must_be_positive',
          messageKey: 'error.tariffMustBePositive',
        },
      ],
    };
  }

  return { valid: true };
};
```

---

# 27. Formatação

## 27.1 formatCurrency

```ts
export const formatCurrency = (
  value: number,
  locale: SupportedLocale,
  currency: CurrencyCode
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
```

## 27.2 formatKwh

```ts
export const formatKwh = (
  value: number,
  locale: SupportedLocale
): string => {
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)} kWh`;
};
```

## 27.3 formatTariff

```ts
export const formatTariff = (
  value: number,
  locale: SupportedLocale,
  currency: CurrencyCode
): string => {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);

  return `${formatted}/kWh`;
};
```

## 27.4 formatDateShort

```ts
export const formatDateShort = (
  isoDate: ISODateString,
  locale: SupportedLocale
): string => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate));
};
```

---

# 28. Storage local

## 28.1 StorageKeys

```ts
export const STORAGE_KEYS = {
  appSettings: '@powercost/app_settings',
  history: '@powercost/history',
  adsState: '@powercost/ads_state',
  premiumState: '@powercost/premium_state',
  customAppliances: '@powercost/custom_appliances',
} as const;
```

## 28.2 StorageEnvelope

```ts
export type StorageEnvelope<T> = {
  schemaVersion: number;
  data: T;
  updatedAt: ISODateString;
};
```

## 28.3 Regra

Todo storage deve ser salvo com versão.

Exemplo:

```ts
const envelope: StorageEnvelope<AppSettings> = {
  schemaVersion: 1,
  data: settings,
  updatedAt: new Date().toISOString(),
};
```

---

# 29. Storage de configurações

## 29.1 settingsStorage

```ts
export type SettingsStorage = {
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: AppSettings) => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<AppSettings>;
  resetSettings: () => Promise<AppSettings>;
};
```

## 29.2 Regras

- Se não existir storage, retornar `DEFAULT_APP_SETTINGS`.
- Se o JSON estiver corrompido, retornar default e registrar erro internamente.
- Não quebrar o app por falha de configuração.

---

# 30. Storage de histórico

## 30.1 historyStorage

```ts
export type HistoryStorage = {
  getHistory: () => Promise<HistoryState>;
  saveSimulation: (simulation: SavedSimulation) => Promise<HistoryState>;
  deleteSimulation: (id: EntityId) => Promise<HistoryState>;
  clearHistory: () => Promise<HistoryState>;
};
```

## 30.2 Regras

- Ordenar histórico após salvar.
- Não salvar duplicata com mesmo `id`.
- `clearHistory` não apaga configurações.
- Falha ao salvar deve retornar erro tratado.

---

# 31. Storage de ads

## 31.1 adsStateStorage

```ts
export type AdsStateStorage = {
  getAdsState: () => Promise<AdsState>;
  saveAdsState: (state: AdsState) => Promise<void>;
  updateAdsState: (partial: Partial<AdsState>) => Promise<AdsState>;
  resetAdsState: () => Promise<AdsState>;
};
```

## 31.2 Regras

- Recompensas expiradas podem continuar salvas.
- Hooks devem verificar se ainda estão válidas.
- Reset de ads não deve apagar histórico.

---

# 32. Custom appliances

## 32.1 CustomAppliancesState

```ts
export type CustomAppliancesState = {
  schemaVersion: number;
  appliances: Appliance[];
  updatedAt: ISODateString;
};
```

## 32.2 Regras

- V1 pode permitir aparelho personalizado sem salvar no catálogo.
- Se salvar personalizados, usar este storage.
- Aparelhos personalizados devem ter `isCustom: true`.

---

# 33. Migração

## 33.1 AppSchemaVersion

```ts
export const CURRENT_SCHEMA_VERSION = 1;
```

## 33.2 MigrationResult

```ts
export type MigrationResult<T> = {
  data: T;
  migrated: boolean;
};
```

## 33.3 migrationService

```ts
export type MigrationService = {
  migrateAppSettings: (raw: unknown) => MigrationResult<AppSettings>;
  migrateHistory: (raw: unknown) => MigrationResult<HistoryState>;
  migrateAdsState: (raw: unknown) => MigrationResult<AdsState>;
  migratePremiumState: (raw: unknown) => MigrationResult<PremiumState>;
};
```

## 33.4 Regra

Se a estrutura antiga for inválida, não travar o app.

Preferir:

```txt
fallback seguro + log interno
```

---

# 34. Hooks

## 34.1 useCalculation

```ts
export type UseCalculationReturn = {
  draft: CalculationDraft;
  setAppliance: (appliance: Appliance, customName?: string) => void;
  setPowerWatts: (powerWatts: number) => void;
  setUsage: (hoursPerDay: number, daysPerMonth: number) => void;
  setTariff: (tariffPerKwh: number, saveAsDefault?: boolean) => void;
  goToStep: (step: CalculationStep) => void;
  goNext: () => void;
  goBack: () => void;
  validateCurrentStep: () => ValidationResult;
  calculate: () => SimulationResult;
  resetDraft: () => void;
};
```

## 34.2 useHistory

```ts
export type UseHistoryReturn = {
  simulations: SavedSimulation[];
  isLoading: boolean;
  error?: string;
  canSaveMore: boolean;
  saveSimulation: (
    input: SimulationInput,
    result: SimulationResult
  ) => Promise<SavedSimulation | null>;
  deleteSimulation: (id: EntityId) => Promise<void>;
  clearHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
};
```

## 34.3 useAdsAccess

```ts
export type UseAdsAccessReturn = {
  canShowBanner: boolean;
  canShowInterstitial: boolean;
  isAdFreeActive: boolean;

  adFreeUntil?: ISODateString;
  expandedComparisonActive: boolean;
  extraHistorySlotsActive: boolean;
  whatIfActive: boolean;

  unlockRewardedFeature: (
    request: RewardedUnlockRequest
  ) => Promise<RewardedUnlockResult>;

  markInterstitialShown: () => Promise<void>;
  incrementCompletedCalculationCounter: () => Promise<void>;
};
```

## 34.4 useAppLocale

```ts
export type UseAppLocaleReturn = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
};
```

## 34.5 useAppTheme

```ts
export type UseAppThemeReturn = {
  theme: AppTheme;
  resolvedTheme: ThemeModeResolved;
  setTheme: (theme: AppTheme) => Promise<void>;
};
```

---

# 35. Chaves i18n mínimas

## 35.1 Home

```ts
export const HOME_KEYS = [
  'home.title',
  'home.subtitle',
  'home.calculateNow',
  'home.history',
  'home.compare',
  'home.savingTip',
];
```

## 35.2 Cálculo

```ts
export const CALCULATION_KEYS = [
  'calculate.title',
  'calculate.step',
  'calculate.applianceQuestion',
  'calculate.searchAppliance',
  'calculate.mostUsed',
  'calculate.powerQuestion',
  'calculate.powerHelp',
  'calculate.usageQuestion',
  'calculate.daysQuestion',
  'calculate.tariffQuestion',
  'calculate.seeResult',
];
```

## 35.3 Resultado

```ts
export const RESULT_KEYS = [
  'result.title',
  'result.monthlyCostEstimated',
  'result.perMonth',
  'result.monthlyConsumption',
  'result.dailyCost',
  'result.yearlyCost',
  'result.approxWarning',
  'result.saveToHistory',
  'result.calculateAnother',
];
```

## 35.4 Ads

```ts
export const ADS_KEYS = [
  'ads.watch',
  'ads.removeAds30',
  'ads.compareMore24',
  'ads.saveMore24',
  'ads.energyTips',
  'ads.whatIf',
  'ads.failedToLoad',
  'ads.rewardActiveUntil',
];
```

---

# 36. Estados de tela

## 36.1 AsyncState

```ts
export type AsyncState<T> =
  | {
      status: 'idle';
      data?: T;
      error?: undefined;
    }
  | {
      status: 'loading';
      data?: T;
      error?: undefined;
    }
  | {
      status: 'success';
      data: T;
      error?: undefined;
    }
  | {
      status: 'error';
      data?: T;
      error: string;
    };
```

## 36.2 Uso recomendado

- Histórico.
- Ads.
- Storage.
- Premium.
- Configurações.

---

# 37. Eventos internos

## 37.1 AppEvent

```ts
export type AppEvent =
  | {
      type: 'calculation_started';
      createdAt: ISODateString;
    }
  | {
      type: 'calculation_completed';
      simulationId?: EntityId;
      costPerMonth: number;
      createdAt: ISODateString;
    }
  | {
      type: 'simulation_saved';
      simulationId: EntityId;
      createdAt: ISODateString;
    }
  | {
      type: 'rewarded_ad_completed';
      feature: RewardedFeature;
      createdAt: ISODateString;
    }
  | {
      type: 'interstitial_shown';
      createdAt: ISODateString;
    };
```

## 37.2 Observação

Na V1, esses eventos podem ser apenas internos para controle de estado.  
Não implementar analytics externo sem decisão posterior.

---

# 38. Regras de privacidade

O modelo local não deve coletar dados pessoais.

## 38.1 Não coletar

- Nome do usuário.
- E-mail.
- Endereço.
- Conta de luz real.
- CPF.
- Localização precisa.
- Dados de concessionária.
- Fotos.
- Contatos.

## 38.2 Dados locais salvos

- Simulações.
- Histórico.
- Tarifa padrão.
- Idioma.
- Tema.
- Estado de anúncios.
- Premium futuro.

## 38.3 Observação sobre ads

Se usar AdMob, a política de privacidade deve informar o uso de anúncios e possíveis dados coletados por terceiros.

---

# 39. Exemplo completo de registro salvo

```ts
const exampleSavedSimulation: SavedSimulation = {
  id: 'sim_1723400000000',
  input: {
    applianceId: 'air_conditioner',
    applianceName: 'Ar-condicionado',
    applianceNameKey: 'appliance.airConditioner',
    category: 'climate',
    powerWatts: 1500,
    hoursPerDay: 6,
    daysPerMonth: 30,
    tariffPerKwh: 0.9,
    currency: 'BRL',
  },
  result: {
    consumptionKwhMonth: 270,
    consumptionKwhYear: 3240,
    costPerDay: 8.1,
    costPerMonth: 243,
    costPerYear: 2916,
    impactLevel: 'high',
  },
  createdAt: '2026-08-11T17:30:00.000Z',
};
```

---

# 40. Dados que não devem ir para a UI diretamente

Evitar passar para componentes visuais:

- storage cru;
- envelope de storage;
- erros técnicos;
- objetos de SDK de anúncios;
- objetos de RevenueCat;
- datas sem formatar;
- números sem formatar;
- chaves i18n sem tradução.

A UI deve receber dados prontos para exibição quando possível.

---

# 41. Ordem de implementação recomendada para Codex

## 41.1 Etapa 1 — Types

Criar:

```txt
src/types/appliance.ts
src/types/simulation.ts
src/types/settings.ts
src/types/ads.ts
src/types/premium.ts
src/types/i18n.ts
src/types/storage.ts
```

## 41.2 Etapa 2 — Constants

Criar:

```txt
src/constants/applianceCatalog.ts
src/constants/appLimits.ts
src/constants/adRules.ts
src/constants/storageKeys.ts
src/constants/locales.ts
```

## 41.3 Etapa 3 — Utils

Criar:

```txt
src/utils/energyCalculations.ts
src/utils/validators.ts
src/utils/formatters.ts
src/utils/dates.ts
```

## 41.4 Etapa 4 — Storage

Criar:

```txt
src/services/settingsStorage.ts
src/services/historyStorage.ts
src/services/adsStateStorage.ts
src/services/migrationService.ts
```

## 41.5 Etapa 5 — Hooks

Criar:

```txt
src/hooks/useCalculation.ts
src/hooks/useHistory.ts
src/hooks/useTariff.ts
src/hooks/useAdsAccess.ts
src/hooks/useAppLocale.ts
src/hooks/useAppTheme.ts
src/hooks/usePremium.ts
```

---

# 42. Critérios de aceitação do Data Model

O arquivo 05 estará pronto quando:

```txt
[ ] Existem tipos para aparelhos.
[ ] Existem tipos para cálculo.
[ ] Existem tipos para resultado.
[ ] Existem tipos para histórico.
[ ] Existem tipos para configurações.
[ ] Existem tipos para idioma.
[ ] Existem tipos para tema.
[ ] Existem tipos para anúncios.
[ ] Existem tipos para premium futuro.
[ ] Existem constantes de limites grátis.
[ ] Existem durações de recompensas.
[ ] Existem chaves de storage.
[ ] Existem regras de validação.
[ ] Existem funções de cálculo puras.
[ ] Existem formatos de moeda e kWh.
[ ] Existe estratégia de migração.
[ ] Existe separação entre UI, lógica e storage.
```

---

# 43. O que o Codex não deve fazer nesta fase

- Não implementar telas.
- Não adicionar bibliotecas sem necessidade.
- Não criar login.
- Não implementar premium real.
- Não integrar AdMob antes da base de cálculo.
- Não colocar lógica de cálculo dentro de componente visual.
- Não salvar dados pessoais.
- Não usar `any`.
- Não deixar texto fixo sem i18n.
- Não criar storage sem versão.

---

# 44. Resumo final

O modelo de dados do PowerCost deve ser simples para o usuário e organizado para o código.

A V1 precisa salvar apenas o essencial:

```txt
simulações
configurações
estado de anúncios
premium futuro
```

A função principal deve continuar offline:

```txt
potência × horas × dias ÷ 1000 = kWh
kWh × tarifa = custo
```

Todo o restante — anúncios, recompensas, comparação, histórico e premium futuro — deve ficar separado em tipos, serviços e hooks próprios.
