import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseStrategy } from './strategies';
import {
  IException,
  WatchData,
  WatchmanModuleOptions,
  WatchMetaData,
} from './interfaces';

@Injectable()
export class WatchmanService {
  constructor(
    private options: Partial<WatchmanModuleOptions>,
    private strategy: BaseStrategy,
  ) {}

  public setStrategy(strategy: BaseStrategy) {
    this.strategy = strategy;
  }

  public watch(exception: IException, data: WatchData): void {
    const { host, trackUUID, metaData } = data;
    let _host: WatchMetaData = null;
    if (host) {
      const ctx = host.switchToHttp();
      _host = {
        request: ctx.getRequest<Request>(),
        response: ctx.getResponse<Response>(),
      };
    }
    const status =
      'getStatus' in exception
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (trackUUID) exception.uuid = trackUUID;
    if (status === HttpStatus.INTERNAL_SERVER_ERROR)
      return this.strategy.execute(exception, status, _host, metaData);
    if (this.options && this.options.catchOnlyInternalExceptions) return;
    return this.strategy.execute(exception, status, _host, metaData);
  }
}
