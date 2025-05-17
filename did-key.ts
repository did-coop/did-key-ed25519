/** @file tools for handling did:key DIDs <https://w3c-ccg.github.io/did-method-key/> */

// @ts-expect-error no types
import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'

// @ts-expect-error no types
import * as didMethodKey from '@digitalbazaar/did-method-key';
import type { DID, DIDKeyVerificationMethodId } from './did.js';
import { isDidKey } from './did.js';

const didKeyDriver = didMethodKey.driver()
didKeyDriver.use({
  multibaseMultikeyHeader: 'z6Mk',
  fromMultibase: Ed25519VerificationKey2020.from
})

/**
 * parse a did:key DID to a did document
 * @param didKey - did:key DID to parse
 * @returns {any} did document resolved for didKey
 */
export async function getDidDocumentFromDidKey(didKey: `did:key:${string}`) {
  const [,,publicKeyMultibase] = didKey.split(':')
  const publicKey = await Ed25519VerificationKey2020.from({
    controller: didKey,
    publicKeyMultibase,
  })
  const didInfo = await didKeyDriver.fromKeyPair({
    verificationKeyPair: publicKey,
  })
  return didInfo.didDocument
}

/**
 * get the controller DID of the provided did:key verificationMethod.
 * For a did:key, it's just a particularly parsed prefix of the provided verificationMethod id.
 * Use this function to do the parsing safely.
 * @param verificationMethod - verificationMethod id to get controller of (which is just a prefix of the verificationMethod id)
 * @returns {DID} controller DID - This is a did:key DID URI and not the URI of the verificationMethod from the DID Document of that DID
 * @throws if verficationMethod id DID is not did:key
 */
export function getControllerOfDidKeyVerificationMethod(verificationMethod: DIDKeyVerificationMethodId) {
  const did = verificationMethod.split('#').at(0)
  if ( ! isDidKey(did)) {
    throw new Error(`unable to determine did:key from did:key verificationMethod id`, {
      cause: {
        verificationMethod
      }
    })
  }
  return did
}
