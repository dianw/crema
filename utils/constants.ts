/**
 * Application constants
 */

export const HASH_ALGORITHMS = [
  'md5',
  'sha1',
  'sha256',
  'sha384',
  'sha512'
] as const

export const RSA_KEY_SIZES = [
  1024,
  2048,
  3072,
  4096
] as const

export const CERTIFICATE_FIELDS = {
  COUNTRY: 'C',
  STATE: 'ST',
  LOCALITY: 'L',
  ORGANIZATION: 'O',
  ORGANIZATIONAL_UNIT: 'OU',
  COMMON_NAME: 'CN',
  EMAIL: 'emailAddress'
} as const

export const APP_CONFIG = {
  NAME: 'Crema',
  DESCRIPTION: 'Graphical Crypto Toolkit',
  VERSION: '2.0.0',
  GITHUB_URL: 'https://github.com/dianw/crema'
} as const

export type HashAlgorithm = typeof HASH_ALGORITHMS[number]
export type RSAKeySize = typeof RSA_KEY_SIZES[number]
export type CertificateField = typeof CERTIFICATE_FIELDS[keyof typeof CERTIFICATE_FIELDS]
