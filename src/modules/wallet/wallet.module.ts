import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PumpFunService } from 'src/pumpfun/pumpfun.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PumpFunService],
})
export class WalletModule {}
