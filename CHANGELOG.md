# @did.coop/did-key-ed25519

## 0.0.10

### Patch Changes

- ef1a63f: add typescript as devDependency to fix error when prepare script depends on it

## 0.0.9

### Patch Changes

- d983d85: change exports[.] to not define import as pointing to ts file. instead now there is only types, default, and default points to ./lib/index.js

## 0.0.8

### Patch Changes

- 199d9fa: change tsconfig.json from target=esnext to target es2017 or es2018 to increase compatibility with runtimes that don't support private class members

## 0.0.7

### Patch Changes

- fix import from base64url-universal in multibase.ts that could error when running from npm

## 0.0.6

### Patch Changes

- fix package.json exports for ./did-key and ./verifier to point to js not ts

## 0.0.5

### Patch Changes

- fix missing dependencies and other bad config in package.json
