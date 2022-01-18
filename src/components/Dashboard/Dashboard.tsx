import React, { useEffect, useState } from 'react'
import { MarketCard } from '../MarketCard/MarketCard'
import './Dashboard.scss'
import _ from 'lodash'
import { CoinDataHistorical } from '../../types/CoinData'
import { MarketDataHistorical } from '../../types/MarketData'
import { DashboardHeader } from '../DashboardHeader/DashboardHeader'
import { Tab } from '../Tab/Tab'

interface DashboardProps {
	historicalData: CoinDataHistorical
	displayData: boolean
}

export const Dashboard = ({ historicalData, displayData = false }: DashboardProps): React.ReactElement => {
	const [currentCoin, setCurrentCoin] = useState('BTC')
	const [marketData, setMarketData] = useState<MarketDataHistorical>({})
	const [availableMarkets, setAvailableMarkets] = useState<Array<string>>([])
	const [availableCoins, setAvailableCoins] = useState<Array<string>>([])

	useEffect(() => {
		if (historicalData) {
			setMarketData(historicalData[currentCoin])
		}
		setAvailableCoins(_.keys(historicalData))
		setAvailableMarkets(_.keys(historicalData[currentCoin]))
	}, [historicalData, currentCoin])

	return (
		<div className="dashboard">
			<DashboardHeader />
			<div className="graphs-container">
				<div className="tabs-container">
					{availableCoins.map((coin) => {
						return (
							<Tab
								key={`tab-${coin}`}
								text={coin}
								value={coin}
								onClick={(value) => setCurrentCoin(value)}
							/>
						)
					})}
				</div>
				<div className="card-list">
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
			</div>
		</div>
	)
}
