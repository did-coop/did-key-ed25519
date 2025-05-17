/** @file tests for ./ed25519.ts */

import { describe, test } from "node:test"
import assert from "node:assert"
import { Ed25519Signer } from "./ed25519.js"

await describe('Ed25519Signer', async () => {
  await test(`can serialize toJSON and deserialize fromJSON`, async () => {
    const key = await Ed25519Signer.generate()
    const keyAsJson = JSON.stringify(key, null, 2)
    const keyFromJson = await Ed25519Signer.fromJSON(keyAsJson)

    // keys are equal according to Ed25519Signer.equals
    assert.ok(Ed25519Signer.equals(key, keyFromJson))

    assert.equal(key.id, keyFromJson.id)
    assert.equal(key.controller, keyFromJson.controller)
    assert.equal(key.publicKeyMultibase, keyFromJson.publicKeyMultibase)

    // keys should produce same signature for same data
    const sampleData = new TextEncoder().encode(Math.random().toString())
    const key1Signature = await key.sign({ data: sampleData })
    const key2Signature = await keyFromJson.sign({ data: sampleData })
    assert.deepEqual(key1Signature, key2Signature)
  })
})
