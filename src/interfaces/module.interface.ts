import { ArgumentsHost, ModuleMetadata, Type } from '@nestjs/common';
import { DiscordConfig } from './discord.interface';
import { Request, Response } from 'express';

export interface WatchmanModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  strategy?: any;
  inject?: any[];
  useClass?: Type<WatchmanModuleFactory>;
  useExisting?: Type<WatchmanModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<WatchmanModuleOptions> | WatchmanModuleOptions;
}
export interface WatchmanModuleOptions {
  /**
   * @default false
   * */
  catchOnlyInternalExceptions?: boolean;
  strategy?: any;
  strategyConfig?: DiscordConfig;
}

export interface WatchmanModuleFactory {
  createWatchmanModuleOptions: () =>
    | Promise<WatchmanModuleOptions>
    | WatchmanModuleOptions;
}

export interface WatchMetaData {
  request: Request;
  response: Response;
}

export interface WatchData {
  host?: ArgumentsHost | null;
  trackUUID?: string | null;
  metaData?: any;
}
