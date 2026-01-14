import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { GetBalanceSolanaDto } from './dto/get-balance-solana.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

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

  @Get('get-balance')
  async getBalance(@Query('id') id: number) {
    const wallet = await this.walletService.findOne(id);
    const balance = await this.walletService.getBalanceSolana({
      wallet_public_key: wallet.wallet_public_key,
      private_key: wallet.private_key,
    });
    return {
      message: 'Balance fetched successfully',
      result: balance,
    };
  }

  @Get('get-balance-solana')
  @ApiQuery({
    name: 'wallet_public_key',
    required: false,
    description: 'Solana wallet public key',
  })
  @ApiQuery({
    name: 'private_key',
    required: false,
    description: 'Solana wallet private key (base58 encoded)',
  })
  async getBalanceSolana(@Query() getBalanceSolanaDto: GetBalanceSolanaDto) {
    const balance =
      await this.walletService.getBalanceSolana(getBalanceSolanaDto);
    return {
      success: true,
      message: 'Solana balance fetched successfully',
      result: balance,
    };
  }
}
