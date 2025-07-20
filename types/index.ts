/**
 * Global type definitions for the application
 */

import type { User as FirebaseUser } from 'firebase/auth'

export interface User {
  displayName: string | null
  email: string | null
  uid: string
  photoURL?: string | null
  emailVerified?: boolean
}

export interface HashResult {
  algorithm: string
  input: string
  isText: boolean
  output: string
  digest?: any
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
