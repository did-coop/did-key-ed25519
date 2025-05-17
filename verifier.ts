/** @file tools for verifiying signatures using ed25519 */

// @ts-expect-error no types
import { Ed25519VerificationKey2020 as DBEd25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'
// @ts-expect-error no types
import * as didMethodKey from '@digitalbazaar/did-method-key';
import { DID, DIDKeyVerificationMethodId, getDidForDidUri, isDidKeyVerificationMethodId } from './did.js';

const didKeyDriver = didMethodKey.driver()
didKeyDriver.use({
  multibaseMultikeyHeader: 'z6Mk',
  fromMultibase: DBEd25519VerificationKey2020.from
})

export interface ISignatureVerifier {
  verify(options: {
    data: Uint8Array,
    signature: Uint8Array
  }): Promise<boolean>
}

/**
 * given id of verificationMethod, return an object that can verify signatures using that verificationMethod
 * @param keyId - should be like did:key:{publicKey}#{publicKey}
 * @returns verifier which can verify signatures signed by keyId
 */
export async function getVerifierForKeyId(keyId: string): Promise<{
  verifier: ISignatureVerifier,
  verificationMethod: {
    controller: DID<'key'>
  }
}> {
  if (!isDidKeyVerificationMethodId(keyId)) {
    throw new Error(`unable to determine verifier unless keyId is a did:key verification method id`, {
      cause: keyId
    })
  }
  const did = getDidForDidUri(keyId)
  const dbKey = await createDBKeyFromKeyId(keyId)
  const verifier = dbKey.verifier()
  const exported = dbKey.export({publicKey: true, includeContext: true})
  const verificationMethod = {
    controller: did,
    ...exported
  }
  return {
    verifier,
    verificationMethod,
  }
}

/**
 * create a key using @digitalbazaar/ed25519-verification-key-2020 and return it
 * @param keyId - id of verificationMethod from did:key DID document
 * @returns {import('@digitalbazaar/ed25519-verification-key-2020').Ed25519VerificationKey2020} key object that can verify
 */
export async function createDBKeyFromKeyId(keyId: string) {
  const didKeyMatch = keyId.match(/did:key:(?<methodSpecificAddr>\w+)#(?<fragment>\w+)/)
  const publicKeyMultibase = didKeyMatch?.groups?.methodSpecificAddr
  if (! publicKeyMultibase) {
    throw new Error(`unable to parse keyId`, { cause: { keyId }})
  }
  const dbKey = new DBEd25519VerificationKey2020({
    id: keyId,
    publicKeyMultibase,
  })
  return dbKey
}
