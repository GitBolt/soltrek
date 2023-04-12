import * as sdk from "@hxronetwork/parimutuelsdk";
import { Connection } from "@solana/web3.js";

export const getMarkets = async (marketPair: sdk.MarketPairEnum, amount: number = 5) => {
    const config = sdk.DEVNET_CONFIG
    const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/uUAHkqkfrVERwRHXnj8PEixT8792zETN")
    const parimutuelWeb3 = new sdk.ParimutuelWeb3(config, connection)
    const markets = sdk.getMarketPubkeys(config, marketPair);
    const parimutuels = await parimutuelWeb3.getParimutuels(markets, amount);
    return parimutuels
}

getMarkets(sdk.MarketPairEnum.BTCUSD)