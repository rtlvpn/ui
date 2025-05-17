import { RealityCrypto } from './reality-crypto';
import { WireGuardCrypto } from './wireguard-crypto';

export class CryptoService {
  /**
   * Generates Reality keypair (public/private keys)
   * Returns the keys in the format expected by the UI
   */
  static async generateRealityKeypair(): Promise<string[]> {
    try {
      const { privateKey, publicKey } = await RealityCrypto.generateKeyPair();
      
      // Format to match the original sing-box API response
      return [
        `PrivateKey: ${privateKey}`,
        `PublicKey: ${publicKey}`
      ];
    } catch (error) {
      console.error('Failed to generate Reality keypair:', error);
      throw new Error('Failed to generate Reality keypair');
    }
  }
  
  /**
   * Generates WireGuard keypair
   * Returns the keys in the format expected by the UI
   */
  static generateWireGuardKeypair(): string[] {
    try {
      const { privateKey, publicKey } = WireGuardCrypto.generateKeyPair();
      
      // Format to match the original sing-box API response
      return [
        `PrivateKey: ${privateKey}`,
        `PublicKey: ${publicKey}`
      ];
    } catch (error) {
      console.error('Failed to generate WireGuard keypair:', error);
      throw new Error('Failed to generate WireGuard keypair');
    }
  }
  
  /**
   * Gets the WireGuard public key from a private key
   */
  static getWireGuardPublicKey(privateKey: string): string {
    if (!privateKey || privateKey.trim() === '') {
      throw new Error('Private key cannot be empty');
    }
    
    try {
      return WireGuardCrypto.getPublicKey(privateKey);
    } catch (error) {
      console.error('Failed to get WireGuard public key:', error);
      throw new Error('Failed to derive public key from private key');
    }
  }
} 