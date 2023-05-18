import { MarketStatusEnum } from "@hxronetwork/parimutuelsdk";
import { BigNumber } from "@metaplex-foundation/js";

export namespace MonacoTypes {
  export type MonacoBet = {
    forOutcome: boolean;
    marketOutcome: string;
    marketOutcomeIndex: number;
    odds: number;
    stake: number;
  };
}

export namespace HXROTypes {
  export type FilteredContest = {
    pubkey: string,
    longs: number,
    shorts: number,
    expired: boolean,
    slot: number,
    strike: number
  }

  export type PositionItem = {
    key: {
      parimutuelPubkey: string;
    };
    market: { marketPair: string; status: MarketStatusEnum; duration: number; isExpired: boolean };
    time: { startTime: number };
    pool: { poolSize: number; long: number; short: number };
    position: { long: number; short: number };
    locked: { price: number };
    settled: { price: number };
  };


  export type Cumilitive = {
    price: number;
    ordersSize: number;
  }
}

export namespace CandyMachineTypes {
  export type ConfigBuilder = {
    sellerFeeBasisPoints: number,
    symbol: string,
    collectionName: string,
    collectionMetadata: string,
    maxEditionSupply: BigNumber,
    isMutable: boolean,
    itemsAvailable: BigNumber,
    creators: [
      {
        address: string, share: number
      },
    ],
    itemSettings: {
      type: string,
      prefixName: string,
      nameLength: number,
      prefixUri: string,
      uriLength: number,
      isSequential: boolean,
    }

  }
}