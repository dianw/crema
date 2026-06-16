/**
 * Global type definitions for the application
 */

export interface User {
  displayName?: string | null
  email?: string | null
  uid?: string
  photoURL?: string | null
  emailVerified?: boolean
  [key: string]: unknown
}
export interface DistinguishedName {
  commonName: string | null
  organizationName: string | null
  organizationalUnitName: string | null
  localityName: string | null
  stateOrProvinceName: string | null
  countryName: string
}

export interface SubjectDN {
  [key: string]: string
}

export interface SubjectItem {
  name: string
  value: string
}

export interface Algorithm {
  text: string
  value: string
}

export interface HashParams {
  input: string | File
  alg: string
  isText: boolean
  isHmac: boolean
  hmacKey: string
}

export interface KeyPairData {
  id: string
  data: unknown
}

export interface HashResult {
  algorithm: string
  input: string
  isText: boolean
  output: string
  digest?: unknown
}

export interface RSAKeyPair {
  publicKey: string
  privateKey: string
  keySize: number
  format: 'pem' | 'pkcs8'
}

export interface CertificateSigningRequest {
  csr: string
  privateKey: string
  publicKey: string
  subject: Record<string, string>
}

export interface Country {
  name: string
  code: string
  flag?: string
}

export interface HashInputData {
  input: string
  isText: boolean
}

export interface CalculateParams {
  alg: string
  input: string | File
  isText: boolean
  isHmac: boolean
  hmacKey: string
}

export interface NavigationItem {
  name: string
  to?: { name: string }
  href?: string
  icon?: string
  children?: NavigationItem[]
  isCategory?: boolean
}

export interface CryptoOperation {
  id: string
  name: string
  description: string
  category: 'hash' | 'encryption' | 'pki' | 'other'
  path: string
}

// AES
export interface AESParams {
  mode: 'CBC' | 'GCM' | 'CTR'
  keySize: 128 | 192 | 256
  password: string
  input: string | File
  isText: boolean
  operation: 'encrypt' | 'decrypt'
  iv?: string
}
export interface AESResult { output: string; iv: string; mode: string; keySize: number }

// RSA Encrypt
export interface RSAEncryptParams { keyPem: string; input: string; operation: 'encrypt' | 'decrypt' }
export interface RSAEncryptResult { output: string }

// Self-Signed Certificate
export interface SelfSignedCertParams {
  dn: DistinguishedName
  keySize: number
  notBefore?: Date
  notAfter?: Date
}
export interface SelfSignedCertResult { certPem: string; privateKeyPem: string; publicKeyPem: string }

// Certificate Viewer
export interface CertificateInfo {
  subject: Record<string, string>
  issuer: Record<string, string>
  serialNumber: string
  notBefore: string
  notAfter: string
  publicKeyAlgorithm: string
  publicKeySize: number
  fingerprintSHA1: string
  fingerprintSHA256: string
  extensions: { name: string; value: string }[]
  rawPem: string
}

// EC KeyGen
export type ECCurve = 'P-256' | 'P-384' | 'P-521' | 'Ed25519'
export interface ECKeyPair { publicKey: string; privateKey: string; curve: ECCurve; format: 'pem' }
export interface ECKeyPairData { id: string; data: unknown }

// Digital Signature
export interface SignatureParams { keyPem: string; input: string | File; isText: boolean; algorithm: string; operation: 'sign' | 'verify'; signatureHex?: string }
export interface SignatureResult { signature?: string; valid?: boolean; algorithm: string }

// Base64
export interface Base64Params { input: string | File; operation: 'encode' | 'decode'; isText: boolean }
export interface Base64Result { output: string }

// Hex Converter
export interface HexParams { input: string; operation: 'toHex' | 'fromHex' }
export interface HexResult { output: string }

// Password Generator
export interface PasswordOptions { length: number; uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean }
export interface PasswordResult { password: string; entropy: number }

// Random Generator
export interface RandomParams { byteCount: number; format: 'hex' | 'decimal' | 'binary' }
export interface RandomResult { output: string; byteCount: number }

// PBKDF2
export interface PBKDF2Params { password: string; salt: string; iterations: number; keyLength: number; algorithm: string }
export interface PBKDF2Result { derivedKey: string; salt: string; iterations: number }
