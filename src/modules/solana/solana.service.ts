import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { solanaConfig } from 'src/config';

export type GetBalanceSolanaParams = {
  wallet_public_key?: string;
  private_key?: string;
};

@Injectable()
export class SolanaService {
  async getBalance(
    params: GetBalanceSolanaParams,
  ): Promise<{ balance: number; wallet_public_key: string }> {
    const { wallet_public_key, private_key } = params;

    if (!wallet_public_key && !private_key) {
      throw new BadRequestException(
        'Either wallet_public_key or private_key must be provided',
      );
    }

    let publicKey: PublicKey;

    if (private_key) {
      try {
        // Try to decode private key from base58
        const privateKeyBytes = bs58.decode(private_key);
        const keypair = Keypair.fromSecretKey(privateKeyBytes);
        publicKey = keypair.publicKey;
      } catch (error) {
        throw new BadRequestException(
          'Invalid private key format. Expected base58 encoded string',
        );
      }
    } else if (wallet_public_key) {
      try {
        publicKey = new PublicKey(wallet_public_key);
      } catch (error) {
        throw new BadRequestException('Invalid wallet public key format');
      }
    } else {
      throw new BadRequestException(
        'Either wallet_public_key or private_key must be provided',
      );
    }

    try {
      // Use mainnet by default, can be configured via env variable

      const connection = new Connection(solanaConfig.rpcUrl, 'confirmed');

      const balance = await connection.getBalance(publicKey);
      const balanceInSol = balance / 1e9; // Convert lamports to SOL

      return {
        balance: balanceInSol,
        wallet_public_key: publicKey.toBase58(),
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
