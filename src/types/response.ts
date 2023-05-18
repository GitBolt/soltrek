export type SDKResponse = {
    error?: boolean,
    message?: string,
    txId?: string
}

export type DexGetAccount = {
    netCash: number,
    pnl: number,
    totalWithdrawn: number,
    totalDeposited: number,
    openOrders? : any[]
}
