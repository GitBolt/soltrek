import { Keypair, PublicKey } from "@solana/web3.js";
import dexterity from "@hxronetwork/dexterity-ts";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

export namespace HXRODexterity {

  export const createTRG = async (
    selectedNetwork: string,
    kp: Uint8Array,
  ) => {
    const wallet = new NodeWallet(Keypair.fromSecretKey(kp));
    const manifest = await dexterity.getManifest(selectedNetwork, false, wallet);
    console.log(manifest)

    const mpgs = Array.from(manifest.fields.mpgs.values());
    const selectedMPG = mpgs.map(
      (value) => value.pubkey,
    );
    const trgPubkey = await manifest.createTrg(selectedMPG[0]);
    return trgPubkey.toBase58()
  }


  export const viewTRGAcount = async (
    selectedNetwork: string,
    kp: Uint8Array,
    trgPubkey: PublicKey,
  ) => {
    console.log("Values: ", trgPubkey)
    
    const wallet = new NodeWallet(Keypair.fromSecretKey(kp));
    const manifest = await dexterity.getManifest(selectedNetwork, false, wallet);
    const trader = new dexterity.Trader(manifest, trgPubkey);
    console.log("Trader: ", trader)
    const res = trader.getNetCash().toString()
    console.log("Net Cash: ", res)
  }

  export const depositAmount = async (
    selectedNetwork: string,
    kp: Uint8Array,
    trgPubkey: PublicKey,
    amount: number,
  ) => {
    const wallet = new NodeWallet(Keypair.fromSecretKey(kp));
    const manifest = await dexterity.getManifest(selectedNetwork, false, wallet);
    console.log(manifest, trgPubkey)
    const trader = new dexterity.Trader(manifest, trgPubkey);
    const res = await trader.deposit(dexterity.Fractional.New(amount, 0))
    console.log(res)
  }


  export const getStore = async (
    selectedNetwork: string,
    storePubKey: string,
  ) => {

    const connection = new Connection(selectedNetwork)
    const config = selectedNetwork.includes("devnet") ? sdk.DEVNET_CONFIG : sdk.MAINNET_CONFIG
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)

    let store
    try {
      store = await parimutuelWeb3.getStore(
        new PublicKey(storePubKey),
      )
      return { txId: '', store }
    }
    catch (err: any) {
      console.log(err)
      return { error: true, message: err.message || JSON.stringify(err) || '' }
    }
  }

  export const getUserPositions = async (
    selectedNetwork: string,
    marketPair: sdk.MarketPairEnum,
    userPublicKey: string,
  ) => {

    const connection = new Connection(selectedNetwork)
    const config = selectedNetwork.includes("devnet") ? sdk.DEVNET_CONFIG : sdk.MAINNET_CONFIG
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)

    const markets = await parimutuelWeb3.getMarkets(marketPair)
    const contractSize = markets[0]?.info.market.contractSize.toNumber()
    let positions
    try {
      positions = await parimutuelWeb3.getUserPositions(
        new PublicKey(userPublicKey),
        markets
      )
      const parsedPositions = positions
        .map((position) => parseMyPositions(position, marketPair, markets, USDC_DECIMALS, contractSize))
        .sort((a, b) => b.time.startTime - a.time.startTime)

      return { txId: '', positions: parsedPositions }
    }
    catch (err: any) {
      console.log(err)
      return { error: true, message: err.message || JSON.stringify(err) || '' }
    }
  }


}
