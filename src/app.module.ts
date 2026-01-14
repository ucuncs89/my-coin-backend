import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SolanaModule } from './modules/solana/solana.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { SocketModule } from './modules/socket/socket.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    DatabaseModule,
    SolanaModule,
    WalletModule,
    AuthModule,
    SocketModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
