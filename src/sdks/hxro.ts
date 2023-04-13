import { SDKResponse } from "@/types/response";
import CustomWallet from "@/util/wallet";
import * as sdk from "@hxronetwork/parimutuelsdk";
import { DEVNET_CONFIG, ParimutuelWeb3, PositionSideEnum, WalletSigner } from "@hxronetwork/parimutuelsdk";
import { Connection, PublicKey } from "@solana/web3.js";


export namespace HXRO {

  const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN")

  export const getMarkets = async (marketPair: sdk.MarketPairEnum, amount: number = 5, duration: number = 60) => {
    const config = sdk.DEVNET_CONFIG
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)
    const markets = sdk.getMarketPubkeys(config, marketPair);
    const parimutuels = await parimutuelWeb3.getParimutuels(
      markets.filter((market) => market.duration == duration)
      , amount);
    return parimutuels
  }


  export const placePosition = async (
    priv_key: Uint8Array,
    pubKey: string,
    amount: number,
    sideArg: string,
  ) => {

    const side = sideArg.toUpperCase()
    if (side != "LONG" && side != "SHORT") {
      return { error: true, message: "Enter 'Long' or 'Short'" }
    }

    const parimutuelWeb3 = new ParimutuelWeb3(
      DEVNET_CONFIG,
      connection
    );
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
}
