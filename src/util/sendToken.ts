import {
  PublicKey,
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { web3 } from "@project-serum/anchor";
export const sendSPL = async (
  mint: string,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  amount: number,
  rpc: string | undefined
) => {
  let connection;
  if (rpc) {
    connection = new Connection(rpc);
  } else {
    connection = new Connection(web3.clusterApiUrl("devnet"));
  }
  try {
    const token = new PublicKey(mint);
    const fromTokenAccount = await getAssociatedTokenAddress(token, fromPubKey);
    const toTokenAccount = await getAssociatedTokenAddress(token, toPubKey);
    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);
    const ix: TransactionInstruction[] = [];
    if (!toTokenAccountInfo) {
      ix.push(
        createAssociatedTokenAccountInstruction(
          fromPubKey,
          toTokenAccount,
          toPubKey,
          token
        )
      );
    }

    ix.push(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPubKey,
        Number(amount) * 100000
      )
    );

    return ix;
  } catch (e) {
    console.log("Error in Send SPL function:", e);
    return null;
  }
};
export const sendSOL = async (
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  amount: number
) => {
  try {
    const solTransfer = SystemProgram.transfer({
      fromPubkey: fromPubKey,
      toPubkey: toPubKey,
      lamports: LAMPORTS_PER_SOL * amount,
    });
    return solTransfer;
  } catch (e) {
    console.log(e);
    return null;
  }
};
