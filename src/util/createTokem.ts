import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
export const genrateToken = async (
  rpc: string | undefined,
  kp: web3.Keypair,
  tokenAmount: number
) => {
  let connection;
  if (rpc) {
    connection = new web3.Connection(rpc);
  } else {
    connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  }
  const mint = await createMint(
    connection,
    kp,
    kp.publicKey,
    kp.publicKey,
    9 // We are using 9 to match the CLI decimal default exactly
  );
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    kp,
    mint,
    kp.publicKey
  );
  const tx = await mintTo(
    connection,
    kp,
    mint,
    tokenAccount.address,
    kp,
    1000000000 * tokenAmount
  );

  return tx;
};
