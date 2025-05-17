import { x25519 } from '@noble/curves/ed25519';
import { randomBytes } from '@noble/hashes/utils';
import { base64url } from '@scure/base';

export class RealityCrypto {
  /**
   * Generates a new Reality keypair using the same approach as sing-box
   * Reality uses Curve25519 with URL-safe base64 encoding without padding
   */
  static generateKeyPair(): {privateKey: string, publicKey: string} {
    try {
      // Generate a random private key (32 bytes)
      const privateKeyBytes = randomBytes(32);
      
      // Derive the public key from the private key
      const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);
      
      // Convert to base64url strings WITHOUT padding
      // This is equivalent to Go's base64.RawURLEncoding
      const privateKey = base64url.encode(privateKeyBytes).replace(/=+$/, '');
      const publicKey = base64url.encode(publicKeyBytes).replace(/=+$/, '');
      
      return {
        privateKey,
        publicKey
      };
    } catch (error) {
      console.error('Error generating Reality keypair:', error);
      throw error;
    }
  }

  /**
   * Get the public key from a private key
   * @param privateKeyBase64Url the Base64URL encoded private key (without padding)
   */
  static getPublicKey(privateKeyBase64Url: string): string {
    try {
      // Add padding if necessary to make it valid base64 for decoding
      const paddedKey = this.addBase64Padding(privateKeyBase64Url);
      
      // Decode the base64url private key
      const privateKeyBytes = base64url.decode(paddedKey);
      
      // Derive the public key
      const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);
      
      // Return base64url encoded public key WITHOUT padding
      return base64url.encode(publicKeyBytes).replace(/=+$/, '');
    } catch (error) {
      console.error('Invalid private key:', error);
      throw new Error('Failed to derive public key from private key');
    }
  }
  
  /**
   * Helper method to add padding to base64 if needed for decoding
   */
  private static addBase64Padding(str: string): string {
    // Add padding if necessary
    return str + '='.repeat((4 - str.length % 4) % 4);
  }
} 