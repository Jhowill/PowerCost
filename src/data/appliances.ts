import { Appliance } from '../types';

export const APPLIANCES: Appliance[] = [
  { id: 'air_conditioner', nameKey: 'appliance.airConditioner', categoryKey: 'category.climate', icon: 'snow-outline', defaultPowerWatts: 1500 },
  { id: 'electric_shower', nameKey: 'appliance.shower', categoryKey: 'category.bathroom', icon: 'water-outline', defaultPowerWatts: 5500 },
  { id: 'refrigerator', nameKey: 'appliance.refrigerator', categoryKey: 'category.kitchen', icon: 'cube-outline', defaultPowerWatts: 150 },
  { id: 'tv', nameKey: 'appliance.tv', categoryKey: 'category.entertainment', icon: 'tv-outline', defaultPowerWatts: 120 },
  { id: 'washing_machine', nameKey: 'appliance.washingMachine', categoryKey: 'category.laundry', icon: 'refresh-circle-outline', defaultPowerWatts: 1000 },
  { id: 'fan', nameKey: 'appliance.fan', categoryKey: 'category.climate', icon: 'aperture-outline', defaultPowerWatts: 80 },
  { id: 'computer', nameKey: 'appliance.computer', categoryKey: 'category.office', icon: 'desktop-outline', defaultPowerWatts: 300 },
  { id: 'lamp', nameKey: 'appliance.lamp', categoryKey: 'category.lighting', icon: 'bulb-outline', defaultPowerWatts: 10 },
  { id: 'other', nameKey: 'appliance.other', categoryKey: 'category.other', icon: 'add-circle-outline' },
];
