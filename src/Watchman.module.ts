import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { WatchmanService } from './Watchman.service';
import {
  WatchmanModuleAsyncOptions,
  WatchmanModuleFactory,
  WatchmanModuleOptions,
} from './interfaces';
import { STRATEGY_TOKEN, Watchman_OPTIONS } from './constants';
import {
  BaseStrategy,
  injectStrategies,
  strategyDependenciesProviders,
  strategyProviders,
} from './strategies';

@Module({})
export class WatchmanModule {
  static forRoot(option: WatchmanModuleOptions): DynamicModule {
    const provider: Provider<any> = {
      provide: WatchmanService,
      useFactory: (config: WatchmanModuleOptions, ...args: BaseStrategy[]) => {
        if (!option.strategy) throw new Error('Please Provide Strategy class');
        const loadedStrategy = args.find(
          (injectedStrategy) =>
            injectedStrategy && injectedStrategy instanceof option.strategy,
        );
        if (!config.strategyConfig)
          throw new Error('Please set your config in strategyConfig object');
        return new WatchmanService(config, loadedStrategy);
      },
      inject: [Watchman_OPTIONS, ...injectStrategies],
    };

    return {
      providers: [
        provider,
        { provide: Watchman_OPTIONS, useValue: option },
        ...strategyDependenciesProviders,
        ...strategyProviders,
      ],
      exports: [provider],
      module: WatchmanModule,
      imports: [HttpModule],
    };
  }
  static forRootAsync(options: WatchmanModuleAsyncOptions): DynamicModule {
    const provider: Provider = {
      provide: WatchmanService,
      useFactory: async (
        config: WatchmanModuleOptions,
        ...args: BaseStrategy[]
      ) => {
        const strategy = options.strategy || config.strategy;
        if (!strategy) throw new Error('Please Provide Strategy class');
        const loadedStrategy = args.find(
          (injectedStrategy) =>
            injectedStrategy && injectedStrategy instanceof strategy,
        );
        if (!options.strategy) {
          if (!config.strategyConfig)
            throw new Error('Please set your config in strategyConfig object');
        }

        return new WatchmanService(config, loadedStrategy);
      },
      inject: [
        { token: Watchman_OPTIONS, optional: true },
        { token: STRATEGY_TOKEN, optional: true },
        ...injectStrategies,
      ],
    };

    return {
      module: WatchmanModule,
      imports: [...(options.imports || []), HttpModule],
      providers: [
        ...this.createAsyncProviders(options),
        provider,
        ...strategyProviders,
        ...strategyDependenciesProviders,
        {
          provide: STRATEGY_TOKEN,
          useClass: options.strategy,
        },
      ],
      exports: [provider],
    };
  }

  private static createAsyncProviders(
    options: WatchmanModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<WatchmanModuleFactory>;
    if (useClass)
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: useClass,
          useClass,
        },
      ];

    return [
      {
        provide: Watchman_OPTIONS,
        useValue: null,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: WatchmanModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: Watchman_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<WatchmanModuleFactory>,
    ];

    return {
      provide: Watchman_OPTIONS,
      useFactory: async (optionsFactory: WatchmanModuleFactory) =>
        await optionsFactory.createWatchmanModuleOptions(),
      inject,
    };
  }
}
