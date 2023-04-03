import { getProgram } from "@/util/helper";
import {
    getMarketPrices,
    ClientResponse,
    MarketPricesAndPendingOrders,
    MarketAccounts,
    getMarketAccountsByStatusAndMintAccount,
    MarketStatusFilter,
} from "@monaco-protocol/client";
import { Program, Wallet } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";


export const getMarkets = async (token: string, wallet: Wallet) => {
    const program = await getProgram(new PublicKey('monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih'), wallet);
    
    const marketsResponse: ClientResponse<MarketAccounts> =
        await getMarketAccountsByStatusAndMintAccount(
            program,
            MarketStatusFilter.Open,
            new PublicKey(token)
        );
    if (marketsResponse.success && marketsResponse.data?.markets?.length) {

        const currentTime = +new Date() / 1000

        const marketsWithOutcomes = marketsResponse.data.markets.filter(
            (market) => market.account.marketOutcomesCount > 0
        ).filter((market) => market.account.marketLockTimestamp.toNumber() > currentTime)

        for (let i = 0; i < marketsWithOutcomes.length; i++) {
            let marketPk = marketsWithOutcomes[i].publicKey;
            let marketPricesData = await getMarketOutcomePriceData(program, marketPk);
            if (!marketPricesData) {
                console.log("No data: ", marketPk.toBase58())
                continue;
            }
            const marketData = {
                pk: marketPk.toString(),
                market: marketsWithOutcomes[i],
                prices: marketPricesData,
            };
            const formattedString = `For Outcome Price: \`${marketData.prices.forOutcomePrice}\`\nTo Outcome Price: \`${marketData.prices.againstOutcomePrice}\`\nAddress: \`${marketData.pk}\`\n[View on Solscan](https://solscan.io/account/${marketData.pk})`;
            return formattedString
        }
    } else {
        return "None"
    }
};


export const getMarketOutcomePriceData = async (
    program: Program,
    marketPk: PublicKey
) => {
    let marketPricesResponse: ClientResponse<MarketPricesAndPendingOrders> =
        await getMarketPrices(program, marketPk);

    if (marketPricesResponse.success && marketPricesResponse.data) {
        const moreData = getBestMarketOutcomeWithOdd(marketPricesResponse.data);
        return moreData
    }
    return null;
};

const getBestMarketOutcomeWithOdd = (
    marketPricesAndPendingOrders: MarketPricesAndPendingOrders
) => {
    const { marketPrices } = marketPricesAndPendingOrders;

    let marketOutcomes: any = {};
    for (let i = 0; i < marketPrices.length; i++) {
        let marketPrice = marketPrices[i];
        // skip Draw market outcome
        if (marketPrice.marketOutcome === "Draw") {
            continue;
        }
        if (!marketOutcomes[marketPrice.marketOutcome]) {
            marketOutcomes[marketPrice.marketOutcome] = {
                marketOutcomeIndex: marketPrice.marketOutcomeIndex,
                forOutcomePrice: 0,
                againstOutcomePrice: 0,
            };
        }
        if (
            marketPrice.forOutcome &&
            marketPrice.price >
            marketOutcomes[marketPrice.marketOutcome].forOutcomePrice
        ) {
            marketOutcomes[marketPrice.marketOutcome].forOutcomePrice =
                marketPrice.price;
        } else if (
            !marketPrice.forOutcome &&
            marketPrice.price >
            marketOutcomes[marketPrice.marketOutcome].againstOutcomePrice
        ) {
            marketOutcomes[marketPrice.marketOutcome].againstOutcomePrice =
                marketPrice.price;
        }
    }
    if (Object.keys(marketOutcomes).length !== 2) {
        return null;
    }
    let marketOutcomeA = Object.keys(marketOutcomes)[0];
    let marketOutcomeB = Object.keys(marketOutcomes)[1];
    for (let marketOutcome in marketOutcomes) {
        let forOutcomePrice = marketOutcomes[marketOutcome].forOutcomePrice;
        let againstOutcomePrice = marketOutcomes[marketOutcome].againstOutcomePrice;
        if (forOutcomePrice > 0 && againstOutcomePrice > 0) {
            return {
                marketOutcome: marketOutcome,
                marketOutcomeAgainst:
                    marketOutcome === marketOutcomeA ? marketOutcomeB : marketOutcomeA,
                marketOutcomeIndex: marketOutcomes[marketOutcome].marketOutcomeIndex,
                forOutcomePrice: forOutcomePrice,
                againstOutcomePrice: againstOutcomePrice,
            };
        }
    }
    return null;
};

