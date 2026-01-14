import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceSolanaDto {
  @ApiProperty({
    description: 'Solana wallet public key',
    example: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    required: false,
  })
  @IsString()
  @IsOptional()
  wallet_public_key?: string;

  @ApiProperty({
    description: 'Solana wallet private key (base58 encoded)',
    example: '5KJvsngHeMoi...',
    required: false,
  })
  @IsString()
  @IsOptional()
  private_key?: string;
}
