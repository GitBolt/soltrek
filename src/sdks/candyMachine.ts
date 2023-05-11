import { Metaplex, PublicKey, keypairIdentity, toBigNumber } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";

export namespace CandyMachine {


  export const createCandyMachine = async (
    network: string,
    authority_pk: Uint8Array,
    configs: any) => {

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
      // Create the Candy Machine.
      const { candyMachine } = await metaplex.candyMachines().create({
        itemsAvailable: toBigNumber(configs.itemsAvailable),
        sellerFeeBasisPoints: configs.sellerFeeBasisPoints * 100, // percetange to number
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
      return { error: e.toString(), cm: undefined, collection: undefined}
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
}