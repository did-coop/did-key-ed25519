/** @file tools to multibase encode binary data */

// @ts-expect-error no types
import * as base64url from 'base64url-universal';
// @ts-expect-error no types
import * as base58btc from 'base58-universal';

// multibase base58-btc header
const MULTIBASE_BASE58BTC_HEADER = 'z';
// multicodec ed25519-pub header as varint
const MULTICODEC_ED25519_PUB_HEADER = new Uint8Array([0xed, 0x01]);
// multicodec ed25519-priv header as varint
const MULTICODEC_ED25519_PRIV_HEADER = new Uint8Array([0x80, 0x26]);

/**
 * encode data as multibase base58btc encoded data.
 * (always starts with 'z')
 * @param data - data to encode
 * @returns {string} encoded data
 */
export function encodeMutlibaseBase58btc(data: Uint8Array): string {
  return MULTIBASE_BASE58BTC_HEADER + base58btc.encode(data)
}

/**
 * encode a multibase base58-btc multicodec key
 * via https://github.com/digitalcredentials/ed25519-verification-key-2020/blob/main/src/Ed25519VerificationKey2020.ts#L636
 * @param multicodec - multicodec header to prepend
 * @param data - data of type indicated by multicodec
 * @returns - base58btc encoded multicodec + data
 */
export function encodeMulticodec(multicodec: Uint8Array, data: Uint8Array): Uint8Array {
  const multicodecData = new Uint8Array(multicodec.length + data.length)
  multicodecData.set(multicodec)
  multicodecData.set(data, multicodec.length)
  return multicodecData
}

/**
 * given a JWK, convert to publicKeyMultibase base58btc
 * @param jwk - key to serialize
 * @returns base58btc encoded ed25519 public key
 */
export function ed25519JwkToPublicKeyMultibase(jwk: Pick<import('node:crypto').JsonWebKey,'x'>) {
  const publicKeyBase64url = jwk.x
  const publicKey: Uint8Array = base64url.decode(publicKeyBase64url)
  const publicKeyMulticodec = encodeMulticodec(MULTICODEC_ED25519_PUB_HEADER, publicKey)
  const publicKeyMultibaseBase58btc = encodeMutlibaseBase58btc(publicKeyMulticodec)
  return publicKeyMultibaseBase58btc
}

/**
 * given a JWK, convert to privateKeyMultibase base58btc
 * @param jwk - key to serialize
 * @returns base58btc encoded ed25519 public key
 */
export function ed25519JwkToPrivateKeyMultibase(jwk: Pick<import('node:crypto').JsonWebKey,'d'>) {
  const privateKeyBase64url = jwk.d
  const privateKey: Uint8Array = base64url.decode(privateKeyBase64url)
  const privateKeyMulticodec = encodeMulticodec(MULTICODEC_ED25519_PRIV_HEADER, privateKey)
  const privateKeyMultibaseBase58btc = encodeMutlibaseBase58btc(privateKeyMulticodec)
  return privateKeyMultibaseBase58btc
}

/**
 * given a ed25519 public key
 * return it encoded with a multicodec prefix
 * @param publicKey - ed25519 public key (32 bytes)
 * @returns base58btc encoded ed25519 public key
 * @throws if publicKey is not correct size
 */
export function ed25519PublicKeyToMulticodec(publicKey: Uint8Array) {
  if (publicKey.byteLength !== 32) throw new Error(`ed25519 publicKey must be 32 bytes, got ${publicKey.byteLength}`)
  const publicKeyMulticodec = encodeMulticodec(MULTICODEC_ED25519_PUB_HEADER, publicKey)
  return publicKeyMulticodec
}

/**
 * given a ed25519 public key
 * return it encoded with a multicodec prefix and base58btc encoded to string
 * @param publicKey - ed25519 public key (32 bytes)
 * @returns base58btc encoded ed25519 public key
 * @throws if publicKey is not correct size
 */
export function encodeEd25519PublicKeyMultibase(publicKey: Uint8Array) {
  const publicKeyMulticodec = ed25519PublicKeyToMulticodec(publicKey)
  const publicKeyMultibaseBase58btc = encodeMutlibaseBase58btc(publicKeyMulticodec)
  return publicKeyMultibaseBase58btc
}
