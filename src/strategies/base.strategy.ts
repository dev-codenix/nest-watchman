import { Request, Response } from 'express';
import { Inject } from '@nestjs/common';
import { Watchman_OPTIONS } from '../constants';
import {
  DiscordConfig,
  IException,
  WatchmanModuleOptions,
  WatchMetaData,
} from '../interfaces';

type StrategyConfig = WatchmanModuleOptions['strategyConfig'];
export abstract class BaseStrategy {
  private _statusCode: number;
  private _exception: IException;
  private _request: Request;
  private _response: Response;
  private _filePath: string;
  private _fileName: string;
  private _metaData: any;
  private strategyConfig: StrategyConfig;

  @Inject(Watchman_OPTIONS)
  private _options: WatchmanModuleOptions = {
    strategyConfig: null,
    catchOnlyInternalExceptions: false,
  };

  execute(
    exception: IException,
    statusCode: number,
    host: WatchMetaData,
    metaDta: any,
  ): void {
    {
      this._statusCode = statusCode || null;
      this._exception = exception || null;
      this._request = host?.request || null;
      this._response = host?.response || null;
      this._metaData = metaDta || null;
      this._filePath = this.extractErrorPath(this._exception.stack);
      this._fileName =
        this._filePath && this.extractErrorFileNameFromPath(this._filePath);
      let message;
      if (!!host) message = this.withHostMessageFormat();
      else message = this.simpleMessageFormat();
      this.send(message);
    }
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get exception(): IException {
    return this._exception;
  }

  get metaData(): any {
    return this._metaData;
  }

  get request(): Request {
    return this._request;
  }

  get response(): Response {
    return this._response;
  }

  get filePath(): string {
    return this._filePath;
  }

  get fileName(): string {
    return this._fileName;
  }

  get config(): StrategyConfig {
    if (!this.strategyConfig) return this._options.strategyConfig;
    return this.strategyConfig;
  }

  set config(config: StrategyConfig) {
    this.strategyConfig = config;
  }

  private extractErrorFileNameFromPath(path: string): string | null {
    return (
      path
        .slice(path.lastIndexOf('/'))
        .replace('/', '')
        .replace(/\(|\)/gi, '') || null
    );
  }

  private extractErrorPath(errorStack: string): string | null {
    errorStack = errorStack.slice(errorStack.indexOf('\n'));
    const firstIndex = errorStack.indexOf('/');
    const nextIndex = errorStack.indexOf('\n', errorStack.indexOf('/'));

    const path = errorStack.slice(firstIndex, nextIndex);
    const uselessPaths = path.match(
      /node_modules|internal|streams|stream_base_commons|task_queues/gi,
    );
    if (uselessPaths && uselessPaths.length) {
      return this.extractErrorPath(errorStack.slice(nextIndex));
    }
    return path || null;
  }

  abstract send(messageBody): unknown;

  abstract withHostMessageFormat(): unknown;

  abstract simpleMessageFormat(): unknown;
}
