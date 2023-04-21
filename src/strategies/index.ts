import {
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
} from '@nestjs/common';
import { DiscordBaseStrategy } from './discord.strategy';
import { BaseStrategy } from './base.strategy';
import { EmbedBuilder } from 'discord.js';

// export from here to access locally
export { DiscordBaseStrategy, BaseStrategy };
export const injectStrategies: Array<
  InjectionToken | OptionalFactoryDependency
> = [DiscordBaseStrategy];
export const strategyProviders: Array<Provider<any>> = [DiscordBaseStrategy];

export const strategyDependenciesProviders: Array<Provider<any>> = [
  {
    provide: EmbedBuilder.name,
    useClass: EmbedBuilder,
  },
];
