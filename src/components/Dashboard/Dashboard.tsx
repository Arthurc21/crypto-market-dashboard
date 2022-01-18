import React, { useEffect, useState } from 'react'
import { MarketCard } from '../MarketCard/MarketCard'
import './Dashboard.scss'
import _ from 'lodash'
import { CoinDataHistorical } from '../../types/CoinData'
import { MarketDataHistorical } from '../../types/MarketData'
import { DashboardHeader } from '../DashboardHeader/DashboardHeader'

interface DashboardProps {
	historicalData: CoinDataHistorical
	displayData: boolean
}

export const Dashboard = ({ historicalData, displayData = false }: DashboardProps): React.ReactElement => {
	const [currentCoin, setCurrentCoin] = useState('BTC')
	const [marketData, setMarketData] = useState<MarketDataHistorical>({})
	const [availableMarkets, setAvailableMarkets] = useState<Array<string>>([])

	useEffect(() => {
		let markets: Array<string> = []
		_.forEach(historicalData[currentCoin], (key, value) => {
			markets.push(value)
		})
		setAvailableMarkets(markets)
		if (historicalData && displayData) {
			setMarketData(historicalData[currentCoin])
		}
	}, [historicalData])

	return (
		<div className="dashboard">
			<DashboardHeader />
			<h2>Dashboard</h2>
			<div className="buttons">
				<button onClick={() => setCurrentCoin('BTC')}>BTC</button>
				<button onClick={() => setCurrentCoin('ETH')}>ETH</button>
				<button onClick={() => setCurrentCoin('XRP')}>XRP</button>
			</div>
			<h2>{currentCoin}</h2>
			{displayData && (
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
			)}
		</div>
	)
}
