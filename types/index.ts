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
  href: string
  icon?: string
  children?: NavigationItem[]
}

export interface CryptoOperation {
  id: string
  name: string
  description: string
  category: 'hash' | 'encryption' | 'pki' | 'other'
  path: string
}
