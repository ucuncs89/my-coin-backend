import { Controller, Get } from '@nestjs/common';
// import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import indodaxShared from 'src/shared/indodax.shared';
import rekuShared from 'src/shared/reku.shared';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  // constructor(private readonly dashboardService: DashboardService) {}

  @Get('solana-idr-indodax')
  async getPairTicker() {
    const data = await indodaxShared.getPairTicker('sol_idr');
    let tanggal_harga_terakhir: string | null = null;
    if (data?.server_time) {
      const date = new Date(data.server_time * 1000); // epoch to ms
      const pad = (num: number) => num.toString().padStart(2, '0');
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
      tanggal_harga_terakhir = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }
    return {
      success: true,
      message: 'Pair ticker fetched successfully',
      result: { ...data, tanggal_harga_terakhir },
    };
  }

  @Get('solana-idr-reku')
  async getMarketPrice() {
    const data = await rekuShared.getMarketPrice(51);

    // Transform data format
    const serverTime = Math.floor(Date.now() / 1000);
    const date = new Date(serverTime * 1000);
    const pad = (num: number) => num.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    const tanggal_harga_terakhir = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

    // Calculate volumes
    const lastPrice = data?.c || 0;
    const volumeIdr = data?.v || 0;
    const volSol = lastPrice > 0 ? volumeIdr / lastPrice : 0;

    // Determine buy and sell prices based on transaction type
    const buy = data?.tt === 0 ? data?.c : data?.c;
    const sell = data?.tt === 1 ? data?.c : data?.c;

    const transformedData = {
      buy: buy?.toString() || '0',
      high: data?.h?.toString() || '0',
      last: data?.c?.toString() || '0',
      low: data?.l?.toString() || '0',
      sell: sell?.toString() || '0',
      server_time: serverTime,
      vol_idr: volumeIdr?.toString() || '0',
      vol_sol: volSol.toFixed(8),
      tanggal_harga_terakhir,
    };

    return {
      success: true,
      message: 'Market price fetched successfully',
      result: transformedData,
    };
  }
}
