# @did.coop/did-key-ed25519

Create signatures that can be verified with [Ed25519VerificationKey2020][].

## Usage

### byexample

These snippets should pass [byexample](https://byexamples.github.io/byexample/languages/javascript)

> byexample -l javascript README.md

```javascript
> const { Ed25519Signer } = await import("@did.coop/did-key-ed25519")
> const signer = await Ed25519Signer.generate()
> // signer.id is a did:key ed25519 verification method id
> const signerIdMatch = signer.id.match(/^did:key:(.+)#(.+)$/)
> signerIdMatch[1] === signerIdMatch[2]
true
> const signature = await signer.sign({ data: new TextEncoder().encode('Hello, world!') })
> // Ed25519 signatures are 64 bytes
> signature.length
64
```

[Ed25519VerificationKey2020]: https://www.w3.org/community/reports/credentials/CG-FINAL-di-eddsa-2020-20220724/#ed25519verificationkey2020
