import * as anchor from '@project-serum/anchor'
import { anchorProgram } from '@/util/helper';

export const getUser = async (
  wallet: anchor.Wallet,
) => {
  const program = anchorProgram(wallet);

  let [user_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      wallet.publicKey.toBuffer()
    ],
    program.programId
  )

  try {
    //@ts-ignore
    const userData = await program.account.user.fetch(user_account);
    return userData
  } catch (e) {
    console.log(e)
    return undefined
  }
};

export const createUser = async (
  wallet: anchor.Wallet,
) => {
  const program = anchorProgram(wallet);

  let [user_account] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      wallet.publicKey.toBuffer()
    ],
    program.programId
  )

  try {
    //@ts-ignore
    const ix = await program.methods.createUser().accounts({
      userAccount: user_account,
    }).instruction()
    return ix

  } catch (e) {
    console.log(e)
    return undefined
  }
};