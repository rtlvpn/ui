import { x25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@noble/hashes/utils';
import { base64 } from '@scure/base';

export class WireGuardCrypto {
  /**
   * Generates a new WireGuard keypair (Curve25519)
   * WireGuard uses Curve25519 for key exchange with standard base64 encoding
   */
  static generateKeyPair(): {privateKey: string, publicKey: string} {
    try {
      // Generate a random private key (32 bytes)
      const privateKeyBytes = randomBytes(32);
      
      // Derive the public key from the private key
      const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);
      
      // Convert to standard base64 strings (WireGuard uses standard base64)
      const privateKey = base64.encode(privateKeyBytes);
      const publicKey = base64.encode(publicKeyBytes);
      
      return {
        privateKey,
        publicKey
      };
    } catch (error) {
      console.error('Error generating WireGuard keypair:', error);
      throw error;
    }
  }

  /**
   * Get the public key from a private key
   * @param privateKeyBase64 the Base64 encoded private key
   */
  static getPublicKey(privateKeyBase64: string): string {
    try {
      // Decode the base64 private key
      const privateKeyBytes = base64.decode(privateKeyBase64);
      
      // Derive the public key
      const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);
      
      // Return base64 encoded public key
      return base64.encode(publicKeyBytes);
    } catch (error) {
      console.error('Invalid private key:', error);
      throw new Error('Failed to derive public key from private key');
    }
  }
} 