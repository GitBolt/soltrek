import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import {
  createCreateMetadataAccountV2Instruction,
  type DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { Metaplex } from "@metaplex-foundation/js";
import { Web3Storage } from "web3.storage";
import { SystemProgram } from "@solana/web3.js";
const METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

const metaplexTokenMetadataProgram = new web3.PublicKey(
  METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS
);

const createMetaData = async (
  name: string,
  symbol: string,
  description: string,
  image: string
) => {
  const MY_TOKEN_METADATA = {
    name: name,
    symbol: symbol,
    description: description,
    image: image,
  };
  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE as string;
  const client = new Web3Storage({ token });
  const blob = new Blob([JSON.stringify(MY_TOKEN_METADATA)], {
    type: "application/json",
  });
  const metadataFile = new File([blob], "metadata.json");
  const meta_cid = await client.put([metadataFile]);
  const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name,
    symbol: MY_TOKEN_METADATA.symbol,
    uri: `https://cloudflare-ipfs.com/ipfs/${meta_cid}/metadata.json`,
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
  mintKeypair: web3.Keypair,
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
  const payerWallet = new NodeWallet(payer);
  const metaplex = new Metaplex(connection);
  const ix: web3.TransactionInstruction[] = [];
  const data = await createMetaData(name, symbol, description, image);
  const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);
  const [metadataPDA] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      metaplexTokenMetadataProgram.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    metaplexTokenMetadataProgram
  );
  const tokenATA = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    destinationWallet
  );

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
    {
      createMetadataAccountArgsV2: {
        data: data,
        isMutable: true,
      },
    }
  );
  ix.push(ix5);

  return ix;
};

export const CreateMintCode = `
const createMetaData = async (
  name: string,
  symbol: string,
  description: string,
  image: string
) => {
  const MY_TOKEN_METADATA = {
    name: name,
    symbol: symbol,
    description: description,
    image: image,
  };
  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE as string;
  const client = new Web3Storage({ token });
  const blob = new Blob([JSON.stringify(MY_TOKEN_METADATA)], {
    type: "application/json",
  });
  const metadataFile = new File([blob], "metadata.json");
  const meta_cid = await client.put([metadataFile]);
  const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name,
    symbol: MY_TOKEN_METADATA.symbol,
    uri: 'https://cloudflare-ipfs.com/ipfs/meta_cid/metadata.json',
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
  mintKeypair: web3.Keypair,
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
  const payerWallet = new NodeWallet(payer);
  const metaplex = new Metaplex(connection);
  const ix: web3.TransactionInstruction[] = [];
  const data = await createMetaData(name, symbol, description, image);
  const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);
  const [metadataPDA] = await web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      metaplexTokenMetadataProgram.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    metaplexTokenMetadataProgram
  );
  const tokenATA = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    destinationWallet
  );

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
    {
      createMetadataAccountArgsV2: {
        data: data,
        isMutable: true,
      },
    }
  );
  ix.push(ix5);

  return ix;
};
`;
