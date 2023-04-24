import { SDKResponse } from "@/types/response";
import CustomWallet from "@/util/wallet";
import * as sdk from "@hxronetwork/parimutuelsdk";
import { ParimutuelWeb3, PositionSideEnum, WalletSigner } from "@hxronetwork/parimutuelsdk";
import { Connection, PublicKey } from "@solana/web3.js";


export namespace HXRO {

  export const getMarkets = async (
    selectedNetwork: string,
    marketPair: sdk.MarketPairEnum,
    amount: number = 5,
    duration: number = 60
  ) => {

    const connection = new Connection(selectedNetwork)
    const config = selectedNetwork.includes("devnet") ? sdk.DEVNET_CONFIG : sdk.MAINNET_CONFIG
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)

    const markets = sdk.getMarketPubkeys(config, marketPair);

    const parimutuels = await parimutuelWeb3.getParimutuels(
      markets.filter((market) =>
        market.duration == duration
      )
      , amount);

    // Only get about to start parimutuels
    const pari_markets = parimutuels.filter(
      (account) =>
        account.info.parimutuel.timeWindowStart.toNumber() > Date.now()
    );
    return pari_markets
  }


  export const placePosition = async (
    selectedNetwork: string,
    priv_key: Uint8Array,
    pubKey: string,
    amount: number,
    sideArg: string,
  ) => {

    const side = sideArg.toUpperCase()
    if (side != "LONG" && side != "SHORT") {
      return { error: true, message: "Enter 'Long' or 'Short'" }
    }

    const connection = new Connection(selectedNetwork)
    const config = selectedNetwork.includes("devnet") ? sdk.DEVNET_CONFIG : sdk.MAINNET_CONFIG
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)

    let txId = ''
    try {
      txId = await parimutuelWeb3.placePosition(
        CustomWallet.with_private_key(priv_key) as WalletSigner,
        new PublicKey(pubKey),
        amount * (10 ** 9 / 1),
        PositionSideEnum[side],
        Date.now()
      )
      return { txId }
    }
    catch (err: any) {
      console.log(err)
      return { error: true, message: err.message || JSON.stringify(err) || '' }
    }
  }


  export const destroyPosition = async (
    selectedNetwork: string,
    private_key: Uint8Array,
    traderWalletPubKey: string,
    parimutuelPubKey: string,
  ) => {

    const connection = new Connection(selectedNetwork)
    const config = selectedNetwork.includes("devnet") ? sdk.DEVNET_CONFIG : sdk.MAINNET_CONFIG
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)

    let txId = ''
    try {
      txId = await parimutuelWeb3.destroyPosition(
        CustomWallet.with_private_key(private_key) as WalletSigner,
        new PublicKey(traderWalletPubKey),
        new PublicKey(parimutuelPubKey)
      )
      return { txId }
    }
    catch (err: any) {
      console.log(err)
      return { error: true, message: err.message || JSON.stringify(err) || '' }
    }
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
}
