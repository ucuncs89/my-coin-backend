import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { KnexService } from '../../database/knex.service';
import { PumpFunService } from '../../pumpfun/pumpfun.service';
@Injectable()
export class WalletService {
  constructor(private readonly knexService: KnexService) {}

  async create(createWalletDto: CreateWalletDto) {
    const dataWalletPumpFun = await new PumpFunService(
      process.env.PUMPFUN_BASE_URL as string,
      '',
    ).get('api/create-wallet');
    const findWallet = await this.knexService
      .client('wallet')
      .where({
        name: createWalletDto.name,
      })
      .first();
    if (findWallet) {
      throw new BadRequestException(
        'Wallet name already exists, please use a different name',
      );
    }
    await this.knexService.client('wallet').insert({
      name: createWalletDto.name,
      api_key: dataWalletPumpFun.apiKey,
      wallet_public_key: dataWalletPumpFun.walletPublicKey,
      private_key: dataWalletPumpFun.privateKey,
    });

    return {
      name: createWalletDto.name,
      wallet_public_key: dataWalletPumpFun.walletPublicKey,
      private_key: dataWalletPumpFun.privateKey,
    };
  }

  async findAll() {
    const wallets = await this.knexService
      .client('wallet')
      .select(
        'id',
        'name',
        'api_key',
        'wallet_public_key',
        this.knexService.client.raw(
          "DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at",
        ),
        this.knexService.client.raw(
          "DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at",
        ),
      )
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

    return wallets;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
