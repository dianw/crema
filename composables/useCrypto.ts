/**
 * Crypto composable for common cryptographic operations
 */
export const useCrypto = () => {
  /**
   * Convert string to hex
   */
  const stringToHex = (str: string): string => {
    return Array.from(str)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * Convert hex to string
   */
  const hexToString = (hex: string): string => {
    const hexPairs = hex.match(/.{1,2}/g) || []
    return hexPairs
      .map(pair => String.fromCharCode(parseInt(pair, 16)))
      .join('')
  }

  /**
   * Generate random bytes
   */
  const generateRandomBytes = (length: number): Uint8Array => {
    return crypto.getRandomValues(new Uint8Array(length))
  }

  /**
   * Generate random hex string
   */
  const generateRandomHex = (length: number): string => {
    const bytes = generateRandomBytes(Math.ceil(length / 2))
    return Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length)
  }

  return {
    stringToHex,
    hexToString,
    generateRandomBytes,
    generateRandomHex
  }
}
