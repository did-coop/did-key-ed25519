/** @file tools for base64 encoding a la RFC 4648 <https://datatracker.ietf.org/doc/html/rfc4648#section-4> */

/**
 * encode data to base 64 string
 * @param data - data to base 64 encode
 * @returns {string} base64 encoded data
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 */
export function base64urlEncode(data: ArrayBuffer): string {
  const base64Encoded = btoa(String.fromCharCode(...new Uint8Array(data)));
  const base64urlEncoded = base64Encoded
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/g, '')
  return base64urlEncoded
}

/**
 * convert base64 string to base64url string.
 * (it just replaces 3 different characters to make it url safe)
 * @param base64UrlEncoded - base64 encoded data
 * @returns {string} base64url encoded data
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 */
export function base64urlToBase64(base64UrlEncoded: string): string {
  const base64Encoded = base64UrlEncoded
  .replace(/-/g, '+')
  .replace(/_/g, '/');
  return base64Encoded
}

/**
 * convert base64url string to base64 string.
 * (it just replaces 3 different characters)
 * @param base64Encoded - base64 encoded data
 * @returns {string} base64url encoded data
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 */
export function base64ToBase64Url(base64Encoded: string): string {
  const base64UrlEncoded = base64Encoded
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/g, '')
  return base64UrlEncoded
}

/**
 * convert bytes to base64 string (via `String.fromCodePoint(byte)`)
 * @param bytes - bytes to base64 encode
 * @returns {string} base64 encoded data
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 */
export function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

/**
 * convert base64 string to Uint8Array (via `String#charCodeAt`)
 * @param base64 - bytes as base64 string
 * @returns {Uint8Array} data bytes
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 */
export function bytesFromBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
