import { Buffer } from "buffer";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";

export default class CustomWallet implements Wallet {
  constructor(readonly payer: Keypair) { }

  static with_private_key(private_key: Uint8Array): CustomWallet | never {

    const payer = Keypair.fromSecretKey(
      Buffer.from(
        private_key
      )
    );
    return new CustomWallet(payer);
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}