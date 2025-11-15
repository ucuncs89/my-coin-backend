import { Controller, Get, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async findAll() {
    const wallets = await this.walletService.findAll();
    return {
      success: true,
      message: 'Wallets fetched successfully',
      result: wallets,
    };
  }

  @Post('create')
  async create(@Body() createWalletDto: CreateWalletDto) {
    const wallet = await this.walletService.create(createWalletDto);
    return {
      message: 'Wallet created successfully',
      result: wallet,
    };
  }
}
