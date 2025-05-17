/** @file tools for handling DIDs from <https://www.w3.org/TR/did-core/> */

/**
 * a DID string
 * @template Method - DID method <https://www.w3.org/TR/did-core/#methods>
 * @see https://www.w3.org/TR/did-core/#did-syntax
 */
export type DID<Method extends string = string> = `did:${Method}:${string}`

/**
 * did:key DIDs resolve to a did document with only a single verificationMethod.
 * this is the type of the id of that verification method.
 * It's usually like `did:key:{publicKeyMultibase}#{publicKeyMultibase}` (where both `{publicKeyMultibase}` are identical).
 */
export type DIDKeyVerificationMethodId = `${DID<'key'>}#${string}`

/**
 * type guard whether the value is a did:key DID string
 * @param s - value to test
 * @returns {boolean} true if s is a did:key
 */
export function isDidKey(s: unknown): s is `did:key:${string}` {
  return Boolean(typeof s === 'string' && s.match(/^did:key:([^:#]+)$/))
}

/**
 * type guard whether the value is a did:web DID string
 * @param s - value to test
 * @returns {boolean} true if s is a did:web
 */
export function isDidWeb(s: unknown): s is `did:web:${string}` {
  return Boolean(typeof s === 'string' && s.match(/^did:web:([^:#]+)/))
}

/**
 * type guard whether the value is a did:key verificationMethod id string
 * which is generally like `did:key:${publicKey}#${publicKey}`
 * @param s - value to test
 * @returns {boolean} true if s is a did:key verificationMethod id DID URI
 */
export function isDidKeyVerificationMethodId(s: unknown): s is `did:key:${string}#${string}` {
  return Boolean(typeof s === 'string' && s.match(/did:key:([^:#]+)#([^:#]+)$/))
}

/**
 * parse a DID URL to only the DID string that prefixes it
 * @template Method
 * @param didUri - DID URI to parse
 * @returns {string} DID string
 */
export function getDidForDidUri<Method extends string=string>(didUri: `did:${Method}:${string}`): DID<Method> {
  const u = new URL(didUri)
  u.pathname = ''
  u.hash = ''
  u.search = ''
  return u.toString() as DID<Method>
}
