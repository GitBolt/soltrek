import * as anchor from '@project-serum/anchor'
import { anchorProgram } from '@/util/helper';
import { uploadJson } from '../upload';
import { PlaygroundSave } from '@/types/playground';

export const createPlayground = async (
  wallet: anchor.Wallet,
  data: PlaygroundSave,
) => {
  const program = anchorProgram(wallet);

  let [user_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      wallet.publicKey.toBuffer()
    ],
    program.programId
  )

  let details = { playgroundCount: new anchor.BN(0) }
  try {
    // @ts-ignore
    details = await program.account.user.fetch(user_account)
  } catch {
    console.log("Account not created yet")
  }

  const nextNumber = String(details.playgroundCount.toNumber() + 1)
  let [playground_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      wallet.publicKey.toBuffer(),
      Buffer.from(nextNumber)
    ],
    program.programId

  )

  const data_uri = await uploadJson(JSON.stringify(data))
  try {
    //@ts-ignore
    const ix = await program.methods.createPlayground(nextNumber, data_uri).accounts({
      userAccount: user_account,
      playgroundAccount: playground_account
    }).instruction()
    return ix

  } catch (e) {
    console.log(e)
    return undefined
  }
};