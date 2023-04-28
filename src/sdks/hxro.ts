import { HXROTypes } from "@/types/protocols";
import { USDC_DECIMALS } from "@/util/constants";
import CustomWallet from "@/util/wallet";
import * as sdk from "@hxronetwork/parimutuelsdk";
import { PositionSideEnum, WalletSigner } from "@hxronetwork/parimutuelsdk";
import { Connection, PublicKey } from "@solana/web3.js";

// helpers
export const getMarketByPubkey = (
  marketPubkey: string,
  markets: sdk.ParimutuelMarket[],
): sdk.ParimutuelMarket | undefined => {
  return markets.find((market) => market.pubkey.toBase58() === marketPubkey);
};


export const parseMyPositions = (
  position: sdk.ParimutuelPosition,
  marketPair: sdk.MarketPairEnum,
  markets: sdk.ParimutuelMarket[],
  settlementTokenDecimals: number,
  settlementTokenContractSize: number,
): HXROTypes.PositionItem => {
  const { info } = position;
  const market = getMarketByPubkey(info.parimutuel.marketKey, markets);
  const duration = market?.info.market.duration.toNumber() ?? 0;

  const poolSize =
    (info.parimutuel.activeLongPositions.toNumber() +
      info.parimutuel.activeShortPositions.toNumber()) /
    settlementTokenDecimals /
    settlementTokenContractSize;

  const poolLong =
    info.parimutuel.activeLongPositions.toNumber() /
    (settlementTokenDecimals / settlementTokenContractSize);

  const poolShort =
    info.parimutuel.activeShortPositions.toNumber() /
    (settlementTokenDecimals / settlementTokenContractSize);

  const positionLong =
    info.position.longPosition.toNumber() /
    (settlementTokenDecimals / settlementTokenContractSize);

  const positionShort =
    info.position.shortPosition.toNumber() /
    (settlementTokenDecimals / settlementTokenContractSize);

  const lockedPrice = info.parimutuel.strike.toNumber() / 10 ** 8;
  const settledPrice = info.parimutuel.index.toNumber() / 10 ** 8;

  const marketStatus = sdk.getMarketStatus(
    info.parimutuel.marketClose.toString(),
    info.parimutuel.timeWindowStart.toString(),
    duration,
  );

  return {
    key: {
      parimutuelPubkey: info.parimutuelPubkey.toBase58(),
    },
    market: {
      marketPair,
      duration,
      status: marketStatus,
      isExpired: !!info.parimutuel.expired,
    },
    time: {
      startTime: info.parimutuel.marketClose.toNumber(),
    },
    pool: {
      poolSize,
      long: poolLong,
      short: poolShort,
    },
    position: {
      long: positionLong,
      short: positionShort,
    },
    locked: {
      price: lockedPrice,
    },
    settled: {
      price: settledPrice,
    },
  };
};

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
