import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { sha256 } from "@noble/hashes/sha256";

export function generatePDA(programId: string, seed: string, bumpSeed: string) {
  try {
    const programIdBytes = new PublicKey(programId).toBytes();
    const seedBytes = new TextEncoder().encode(seed);
    const bumpSeedBytes = new TextEncoder().encode(bumpSeed);
    const data = Buffer.concat([programIdBytes, seedBytes, bumpSeedBytes]);
    const hash = bs58.decode(bs58.encode(data)).slice(0, 20);
    return new PublicKey(hash);
  } catch (e) {
    return null;
  }
}
const toBuffer = (arr: Buffer | Uint8Array | Array<number>) => {
  if (Buffer.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer.from(arr);
  }
};
export const createPDA = (
  programId: string,
  seeds: Buffer | Uint8Array,
  nonce: number
) => {
  const seedsWithNonce = [seeds].concat(Buffer.from([nonce]));
  let buffer = Buffer.alloc(0);
  seedsWithNonce.forEach(function (seed) {
    if (seed.length > 32) {
      throw new TypeError(`Max seed length exceeded`);
    }
    buffer = Buffer.concat([buffer, toBuffer(seed)]);
  });
  buffer = Buffer.concat([
    buffer,
    new PublicKey(programId).toBuffer(),
    Buffer.from("ProgramDerivedAddress"),
  ]);
  const publicKeyBytes = sha256(buffer);
  return new PublicKey(publicKeyBytes);
};
