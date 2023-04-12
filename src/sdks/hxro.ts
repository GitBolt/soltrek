import * as sdk from "@hxronetwork/parimutuelsdk";
import { Connection } from "@solana/web3.js";


export namespace HXRO {
  export const getMarkets = async (marketPair: sdk.MarketPairEnum, amount: number = 5, duration: number = 60) => {
    const config = sdk.DEVNET_CONFIG
    const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN")
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)
    const markets = sdk.getMarketPubkeys(config, marketPair);
    const parimutuels = await parimutuelWeb3.getParimutuels(
      markets.filter((market) => market.duration == duration)
      , amount);
    return parimutuels
  }
}
