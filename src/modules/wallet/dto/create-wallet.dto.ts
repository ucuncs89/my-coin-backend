import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: 'Wallet name',
    example: 'My Wallet',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
