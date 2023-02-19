import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

export function generatePDA(programId: string, seed: string, bumpSeed: string) {
  const programIdBytes = new PublicKey(programId).toBytes();
  const seedBytes = new TextEncoder().encode(seed);
  const bumpSeedBytes = new TextEncoder().encode(bumpSeed);
  const data = Buffer.concat([programIdBytes, seedBytes, bumpSeedBytes]);
  const hash = bs58.decode(bs58.encode(data)).slice(0, 20);
  return new PublicKey(hash);
}
