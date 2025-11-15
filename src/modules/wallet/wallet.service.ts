import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { KnexService } from '../../database/knex.service';

@Injectable()
export class WalletService {
  constructor(private readonly knexService: KnexService) {}

  create(createWalletDto: CreateWalletDto) {}

  async findAll() {
    const wallets = await this.knexService
      .client('wallet')
      .select(
        'id',
        'name',
        'api_key',
        'wallet_public_key',
        'created_at',
        'updated_at',
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
