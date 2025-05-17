/**
 * @file tools for signing/verifying with the Ed25519 instantiation
 * of the Edwards-Curve Digital Signature Algorithm (EdDSA) aka ed25519
 */

// @ts-expect-error no types
import { Ed25519VerificationKey2020 as DBEd25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'
// @ts-expect-error no types
import * as didMethodKey from '@digitalbazaar/did-method-key';
import type { DID, DIDKeyVerificationMethodId } from './did.js';
import type { ISigner } from './types.js';
import { getControllerOfDidKeyVerificationMethod } from './did-key.js';

const didKeyDriver = didMethodKey.driver()
didKeyDriver.use({
  multibaseMultikeyHeader: 'z6Mk',
  fromMultibase: DBEd25519VerificationKey2020.from
})

interface ExportedKeyPair {
  type: 'Ed25519VerificationKey2020'
  id: string
  controller?: string
  publicKeyMultibase: string
  privateKeyMultibase: string  
}

interface IDidDocVerificationMethod {
  id: string
}

export interface ISignatureVerifier {
  verify(options: {
    data: Uint8Array,
    signature: Uint8Array
  }): Promise<boolean>
}

export class Ed25519Signer
implements ISigner
{
  algorithm = 'Ed25519' as const
  #keyPair: DBEd25519VerificationKey2020
  #verificationMethod: IDidDocVerificationMethod
  static async generate (options: {
    seed?: Uint8Array
  }={}) {
    const keyPair = await DBEd25519VerificationKey2020.generate({ seed: options.seed })
    const invocationSignerDidInfo = await didKeyDriver.fromKeyPair({
      verificationKeyPair: keyPair
    })
    const didVerificationMethod = invocationSignerDidInfo.didDocument.verificationMethod[0]
    keyPair.controller = getControllerOfDidKeyVerificationMethod(didVerificationMethod.id)
    return new Ed25519Signer(
      keyPair,
      didVerificationMethod,
    )
  }
  static async fromJSON(json: string): Promise<Ed25519Signer> {
    const object = JSON.parse(json)
    const {
      publicKeyMultibase,
      privateKeyMultibase,
      controller,
    } = object
    if (typeof controller !== "string") {
      throw new Error(`json object must have controller string`, { cause: {
        parsedJson: object,
      } })
    }
    if (typeof publicKeyMultibase !== "string") {
      throw new Error(`json object must have publicKeyMultibase string`, { cause: object })
    }
    if (typeof privateKeyMultibase !== "string") {
      throw new Error(`json object must have privateKeyMultibase string`, { cause: object })
    }
    const keyPair = await DBEd25519VerificationKey2020.from({
      type: 'Ed25519VerificationKey2020',
      controller,
      publicKeyMultibase,
      privateKeyMultibase,
    })
    const invocationSignerDidInfo = await didKeyDriver.fromKeyPair({
      verificationKeyPair: keyPair
    })
    const didVerificationMethod = invocationSignerDidInfo.didDocument.verificationMethod[0]
    return new Ed25519Signer(
      keyPair,
      didVerificationMethod,
    )
  }
  static equals(key1: Ed25519Signer, key2: Ed25519Signer): boolean {
    return key1.#keyPair.fingerprint() === key2.#keyPair.fingerprint()
  }
  constructor(keyPair: DBEd25519VerificationKey2020, verificationMethod: IDidDocVerificationMethod) {
    this.#keyPair = keyPair
    this.#verificationMethod = verificationMethod
  }
  get controller(): DID<'key'> {
    return this.#keyPair.controller
  }
  get id(): DIDKeyVerificationMethodId {
    return this.#verificationMethod.id as DIDKeyVerificationMethodId
  }
  get publicKeyMultibase() {
    return this.#keyPair.publicKeyMultibase
  }
  async sign({data}: {data: Uint8Array}): Promise<Uint8Array> {
    const signature = await this.#keyPair.signer().sign({data})
    return signature
  }
  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `<Ed25519VerificationKey2020: ${this.publicKeyMultibase}>`
  }
  toJSON() {
    const exported = this.#keyPair.export({ publicKey: true, privateKey: true })
    return exported
  }
}
