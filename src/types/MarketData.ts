import { TickerData } from "./TickerData";

export interface MarketData {
	[key: string]: TickerData
}

export interface MarketDataHistorical {
	[key: string]: Array<TickerData>
}