import { MarketStatusEnum } from "@hxronetwork/parimutuelsdk";

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
}