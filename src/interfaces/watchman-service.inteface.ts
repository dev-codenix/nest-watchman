import { HttpException } from '@nestjs/common';

type UUID = { uuid?: string };
export type IException = HttpException & UUID;
