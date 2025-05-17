/** @file types (only) for ed25519-verification-key-2020 package */

// abstraction of Digital Signature Algorithm implementation
export interface ISigner {
  id?: string
  sign(signable: { data: Uint8Array }): Promise<Uint8Array>
}
