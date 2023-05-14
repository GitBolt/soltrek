import { Metaplex, PublicKey, keypairIdentity, toBigNumber } from "@metaplex-foundation/js";
import { addConfigLines, fetchCandyMachine, mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { BN } from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { createSignerFromKeypair } from "@metaplex-foundation/umi";
import { CandyMachineTypes } from "@/types/protocols";

export namespace CandyMachine {


  export const createCandyMachine = async (
    network: string,
    authority_pk: Uint8Array,
    configs: CandyMachineTypes.ConfigBuilder) => {

    const connection = new Connection(network);
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(Keypair.fromSecretKey(authority_pk)))

    try {
      const { nft: collectionNft } = await metaplex.nfts().create({
        name: "My Collection NFT",
        uri: "https://bafkreic6e7wwviz7acm37qwlgspfgq7jgoowt2iy7l3jspkwln3ra37w3e.ipfs.nftstorage.link/",
        sellerFeeBasisPoints: configs.sellerFeeBasisPoints * 100,
      }, { commitment: "finalized" });

      console.log("Collection Created: ", collectionNft)

      const { candyMachine } = await metaplex.candyMachines().create({
        itemSettings: {
          type: "configLines",
          prefixName: configs.itemSettings.prefixName,
          nameLength: configs.itemSettings.nameLength,
          prefixUri: configs.itemSettings.prefixUri,
          uriLength: configs.itemSettings.uriLength,
          isSequential: false,
        },
        itemsAvailable: toBigNumber(configs.itemsAvailable),
        sellerFeeBasisPoints: configs.sellerFeeBasisPoints * 100, // percentage to number
        collection: {
          address: collectionNft.address,
          updateAuthority: metaplex.identity(),
        },

      }, { commitment: "finalized" });

      console.log("CandyMachine Created: ", candyMachine)
      return { error: false, cm: candyMachine, collection: collectionNft }
    }
    catch (e: any) {
      console.log("Error created CM: ", e.toString())
      return { error: e.toString(), cm: undefined, collection: undefined }
    }
  }

  export const getCandyMachine = async (network: string, cmAddress: PublicKey) => {
    const connection = new Connection(network);
    const metaplex = new Metaplex(connection);

    try {
      const res = await metaplex.candyMachines().findByAddress({
        address: cmAddress,
      });
      return {
        error: false, data: {
          address: res.address,
          authorityAddress: res.authorityAddress,
          collectionMintAddress: res.collectionMintAddress,
          symbol: res.symbol,
          sellerFeeBasisPoints: res.sellerFeeBasisPoints,
          creators: res.creators,
          candyGuard: res.candyGuard,

          isFullyLoaded: res.isFullyLoaded,
          isMutable: res.isMutable,
          itemsAvailable: res.itemsAvailable,
          itemsLoaded: res.itemsLoaded,
          itemsMinted: res.itemsMinted,
          maxEditionSupply: res.maxEditionSupply,
          itemSettings: res.itemSettings
        }
      }
    }
    catch (e: any) {
      console.log("Error getting CM: ", e.toString())
      return { error: e.toString(), res: '' }
    }
  }


  export const deleteCandyMachine = async (network: string, authority_pk: Uint8Array, cmAddress: PublicKey, guardAddress: PublicKey) => {
    const connection = new Connection(network);
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(Keypair.fromSecretKey(authority_pk)))

    try {
      const res = await metaplex.candyMachines().delete({
        candyMachine: cmAddress,
        candyGuard: guardAddress,
        authority: metaplex.identity(),
      });


      return { error: false, res: res.response.signature }
    }
    catch (e: any) {
      console.log("Error deleting CM: ", e.toString())
      return { error: e.toString(), res: '' }
    }
  }


  export const insertNFT = async (network: string, authority_pk: Uint8Array, cmAddress: PublicKey, name: string, uri: string) => {
    const connection = new Connection(network);
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(Keypair.fromSecretKey(authority_pk)))

    try {
      const candyMachine = await metaplex.candyMachines().findByAddress({
        address: new PublicKey(cmAddress)
      })
      const res = await metaplex.candyMachines().insertItems({
        candyMachine,
        items: [
          { name, uri },
        ],
      });

      return { error: false, res: res.response.signature }
    }
    catch (e: any) {
      console.log("Error deleting CM: ", e.toString())
      return { error: e.toString(), res: '' }
    }
  }


  export const mintNFT = async (network: string, authority_pk: Uint8Array, cmAddress: PublicKey) => {
    const connection = new Connection(network);
    const metaplex = new Metaplex(connection);
    const kp = Keypair.fromSecretKey(authority_pk)
    metaplex.use(keypairIdentity(kp))

    try {
      const candyMachine = await metaplex.candyMachines().findByAddress({
        address: new PublicKey(cmAddress)
      })

      const res = await metaplex.candyMachines().mint({
        candyMachine,
        collectionUpdateAuthority: kp.publicKey,
      })

      return { error: false, res: res }
    }
    catch (e: any) {
      console.log("Error deleting CM: ", e.toString())
      return { error: e.toString(), res: '' }
    }
  }
}