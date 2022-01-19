import React, { useEffect, useState } from 'react'
import './Dashboard.scss'
import { MarketCard } from '../MarketCard/MarketCard'
import { DashboardHeader } from '../DashboardHeader/DashboardHeader'
import { Tab } from '../Tab/Tab'
import { Input } from '../Input/Input'
import { CoinDataHistorical } from '../../types/CoinData'
import { MarketDataHistorical } from '../../types/MarketData'
import { symbolValueConversion } from '../../utilities/symbolValueConversion'
import _ from 'lodash'

interface DashboardProps {
	historicalData: CoinDataHistorical
}

export const Dashboard = ({ historicalData }: DashboardProps): React.ReactElement => {
	const [currentCoin, setCurrentCoin] = useState('BTC')
	const [marketData, setMarketData] = useState<MarketDataHistorical>({})
	const [availableMarkets, setAvailableMarkets] = useState<Array<string>>([])
	const [availableCoins, setAvailableCoins] = useState<Array<string>>([])
	const [inputValue, setInputValue] = useState<number>(0)

	useEffect(() => {
		if (historicalData) {
			setMarketData(historicalData[currentCoin])
		}
		setAvailableCoins(_.keys(historicalData))
		setAvailableMarkets(_.keys(historicalData[currentCoin]))
	}, [historicalData, currentCoin])

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<DashboardHeader />
			</div>
			<div className="dashboard-main">
				<div className="graphs-container">
					<div className="tabs-container">
						{availableCoins.map((coin) => {
							return (
								<Tab
									key={`tab-${coin}`}
									text={coin}
									value={coin}
									onClick={(value) => setCurrentCoin(value)}
									selected={currentCoin === coin}
								/>
							)
						})}
					</div>
					<div className="card-list">
						<div className="market-card-container">
							{availableMarkets.map((market) => {
								return (
									<MarketCard
										key={`market-card-${currentCoin}-${market}`}
										market={market}
										lastPrices={marketData[market]}
									/>
								)
							})}
						</div>
					</div>
				</div>
				<div className="convert-section-container">
					<div className="input-convert-container">
						<span>CONVERT</span>
						<Input
							id="input-convert-coin"
							label="MXN $"
							labelPosition="left"
							value={inputValue > 0 ? inputValue.toString() : ''}
							short={true}
							onChange={(value) => setInputValue(parseInt(value))}
						/>
					</div>
					<div className="conversion-list-container">
						{availableMarkets.map((market) => {
							let conversion
							if (marketData[market][0].price !== undefined) {
								conversion = symbolValueConversion(marketData[market][0].price, inputValue)
							} else {
								conversion = symbolValueConversion(marketData[market][1].price, inputValue)
							}
							return (
								<div key={`conversion-span-${currentCoin}-${market}`} className="market-conversion">
									<span>{market.toUpperCase()}</span>
									<span>{conversion}</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
