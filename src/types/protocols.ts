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
}