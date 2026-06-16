/**
 * Application constants
 */

import type { ECCurve } from '~/types'

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

export const AES_MODES = ['CBC', 'GCM', 'CTR'] as const
export const AES_KEY_SIZES = [128, 192, 256] as const
export const EC_CURVES: { label: string; value: ECCurve }[] = [
  { label: 'P-256 (prime256v1)', value: 'P-256' },
  { label: 'P-384', value: 'P-384' },
  { label: 'P-521', value: 'P-521' },
  { label: 'Ed25519', value: 'Ed25519' }
]
export const SIGNATURE_ALGORITHMS = ['sha256', 'sha384', 'sha512'] as const
export const PBKDF2_ALGORITHMS = ['sha256', 'sha512'] as const

export type AESMode = typeof AES_MODES[number]
export type AESKeySize = typeof AES_KEY_SIZES[number]
export type SignatureAlgorithm = typeof SIGNATURE_ALGORITHMS[number]
export type PBKDF2Algorithm = typeof PBKDF2_ALGORITHMS[number]
