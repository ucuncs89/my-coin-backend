import { Controller, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async findAll() {
    const wallets = await this.walletService.findAll();
    return {
      success: true,
      message: 'Wallets fetched successfully',
      data: wallets,
    };
  }
}
