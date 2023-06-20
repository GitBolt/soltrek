import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "node_modules/@solana/spl-token";

import { DataV2, createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';

import * as web3 from "@solana/web3.js";
import { findMetadataPda } from "@metaplex-foundation/js";
import { SystemProgram } from "@solana/web3.js";
import { uploadJson } from "./upload";
const METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";


const createMetaData = async (
  name: string,
  symbol: string,
  description: string,
  image: string
) => {
  const TOKEN_METADATA = {
    name: name,
    symbol: symbol,
    description: description,
    image: image,
  };
  const uri = await uploadJson(JSON.stringify(TOKEN_METADATA))

  const ON_CHAIN_METADATA = {
    name: TOKEN_METADATA.name,
    symbol: TOKEN_METADATA.symbol,
    uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;
  return ON_CHAIN_METADATA;
};

export const createNewMint = async (
  rpc: string | undefined,
  payer: web3.Keypair,
  destinationWallet: web3.PublicKey,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  name: string,
  symbol: string,
  description: string,
  image: string
) => {
  let connection;
  if (rpc) {
    connection = new web3.Connection(rpc);
  } else {
    connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  }

  const mintKeypair = new web3.Keypair()
  const metadata = await createMetaData(name, symbol, description, image)

  const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);
  const metadataPDA = findMetadataPda(mintKeypair.publicKey)
  const tokenATA = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    destinationWallet
  );
  const ix: web3.TransactionInstruction[] = [];

  const ix1 = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: mintKeypair.publicKey,
    space: MINT_SIZE,
    lamports: requiredBalance,
    programId: TOKEN_PROGRAM_ID,
  });
  ix.push(ix1);

  const ix2 = createInitializeMintInstruction(
    mintKeypair.publicKey, //Mint Address
    6, //Number of Decimals of New mint
    mintAuthority, //Mint Authority
    freezeAuthority, //Freeze Authority
    TOKEN_PROGRAM_ID
  );
  ix.push(ix2);

  const ix3 = createAssociatedTokenAccountInstruction(
    payer.publicKey, //Payer
    tokenATA, //Associated token account
    payer.publicKey, //token owner
    mintKeypair.publicKey //Mint
  );
  ix.push(ix3);

  const ix4 = createMintToInstruction(
    mintKeypair.publicKey, //Mint
    tokenATA, //Destination Token Account
    mintAuthority, //Authority
    100000 * Math.pow(10, 6) //number of tokens
  );
  ix.push(ix4);

  const ix5 = createCreateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      mint: mintKeypair.publicKey,
      mintAuthority: mintAuthority,
      payer: payer.publicKey,
      updateAuthority: mintAuthority,
    },
  );
  ix.push(ix5);

  return ix;
};
