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
} from "node_modules/@solana/spl-token"


export const sendSPL = async (
  token: PublicKey,
  fromPubKey: PublicKey,
  toPubKey: PublicKey,
  amount: number,
  rpc?: string
) => {

  const connection = new Connection(rpc || process.env.NEXT_PUBLIC_DEFAULT_RPC as string)
  try {
    const fromTokenAccount = await getAssociatedTokenAddress(token, fromPubKey);
    const toTokenAccount = await getAssociatedTokenAddress(token, toPubKey);
    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

    const ix: TransactionInstruction[] = [];
    
    console.log(fromTokenAccount)
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
  fromPubKey: string,
  toPubKey: string,
  amount: number
) => {
  if (!fromPubKey || !toPubKey || !amount) return;
  try {
    const solTransfer = SystemProgram.transfer({
      fromPubkey: new PublicKey(fromPubKey),
      toPubkey: new PublicKey(toPubKey),
      lamports: LAMPORTS_PER_SOL * amount,
    });
    return solTransfer;
  } catch (e) {
    console.log(e);
    return null;
  }
};
