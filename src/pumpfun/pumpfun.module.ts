import { Module, DynamicModule } from '@nestjs/common';
import { PumpFunService } from './pumpfun.service';

export interface PumpFunModuleOptions {
  baseUrl: string;
  apiKey: string;
}

@Module({})
export class PumpFunModule {
  static forRoot(options: PumpFunModuleOptions): DynamicModule {
    return {
      module: PumpFunModule,
      providers: [
        {
          provide: PumpFunService,
          useFactory: () => {
            return new PumpFunService(options.baseUrl, options.apiKey);
          },
        },
      ],
      exports: [PumpFunService],
    };
  }
}
