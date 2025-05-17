/** @file tests related to multibase encoding */

import { test } from "node:test"

// @ts-expect-error no types
import { Ed25519VerificationKey2020 as DBEd25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020'

import assert from "node:assert";
import { ed25519JwkToPrivateKeyMultibase, ed25519JwkToPublicKeyMultibase, ed25519PublicKeyToMulticodec, encodeMutlibaseBase58btc } from "./multibase.js";

await test('can convert from jwk to publicKeyMultibase', async t => {
  const seed = new Uint8Array(32).fill(0)
  const keyPair = await DBEd25519VerificationKey2020.generate({ seed })
  const keyPairJwk = keyPair.toJwk({publicKey:true,privateKey:true})
  const publicKeyMultibase = ed25519JwkToPublicKeyMultibase(keyPairJwk)
  assert.equal(publicKeyMultibase, 'z6MkiTBz1ymuepAQ4HEHYSF1H8quG5GLVVQR3djdX3mDooWp')
})

await test('can convert from jwk to privateKeyMultibase', async t => {
  const seed = new Uint8Array(32).fill(0)
  const keyPair = await DBEd25519VerificationKey2020.generate({ seed })
  const keyPairJwk = keyPair.toJwk({publicKey:true,privateKey:true})
  const privateKeyMultibase = ed25519JwkToPrivateKeyMultibase(keyPairJwk)
  assert.equal(privateKeyMultibase, 'zruzdu1ot9nb4GJvVvUbeYynyRzDgp6tvyXbMYGBrMU3EZsZieAoXxGGrJBSiD5hFLFRVLYEXLUfcvuAxpu89W3tdLL')
})
