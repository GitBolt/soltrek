import {
    getMarketPrices,
    ClientResponse,
    MarketPricesAndPendingOrders,
} from "@monaco-protocol/client";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";


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

