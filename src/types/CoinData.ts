import { MarketData } from "./MarketData";
import { MarketDataHistorical } from "./MarketData";

export interface CoinData {
	[key: string]: MarketData
}

export interface CoinDataHistorical {
	[key: string]: MarketDataHistorical
}