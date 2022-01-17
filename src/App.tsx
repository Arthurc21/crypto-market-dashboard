import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/Dashboard/Dashboard'
import { Login } from './components/Login/Login'
import { useWebSocket } from './utilities/useWebSocket'
import { subAll, subBinance, subBitso } from './utilities/messages'
import { MessageResponse } from './types/MessageResponse'
import { queue } from './utilities/queue'
import { cleanData } from './utilities/cleanArray'
import _ from 'lodash'
import { CoinData, CoinDataHistorical } from './types/CoinData'
import { MarketData } from './types/MarketData'
require('dotenv').config()

export const StoreContext = React.createContext({})

export default function App(): React.ReactElement {
	const websocketUrl = process.env.WEBSOCKET_URL
	const websocketKey = process.env.WEBSOCKET_KEY
	const websocketFullUrl = `${websocketUrl}?api_key=${websocketKey}`
	const websocket = useWebSocket(websocketFullUrl)
	const updateTime = 15000

	const [coinsData, setCoinsData] = useState<CoinData>({})
	const [historicals, setHistoricals] = useState<CoinDataHistorical>({})
	const dataRef = useRef({})

	const sendMessage = () => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			websocket.send(JSON.stringify(subAll))
		}
	}

	const updateHistoricalValues = (data: CoinData) => {
		_.forEach(data, (coin) => {
			_.forEach(coin, (market) => {
				const currentCoin = market.baseSymbol
				const currentMarket = market.market
				if (historicals && currentCoin && currentMarket) {
					const currentMarketHistorical = _.cloneDeep(historicals[currentCoin])
					if (currentMarketHistorical) {
						const currentMarketArray = currentMarketHistorical[currentMarket]
						const newElement = cleanData(market, currentMarketArray[0])
						const newArray = queue(newElement, currentMarketArray)
						setHistoricals((prevState) => {
							return {
								...prevState,
								[currentCoin]: {
									...prevState[currentCoin],
									[currentMarket]: newArray
								}
							}
						})
					}
				}
			})
		})
	}

	useEffect(() => {
		dataRef.current = coinsData
	})

	useEffect(() => {
		const interval = setInterval(() => {
			updateHistoricalValues(dataRef.current)
		}, updateTime)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if (websocket) {
			const handleSocketMessage = (event: MessageEvent) => {
				const message: MessageResponse = JSON.parse(event.data)
				console.log('websocket message', message)
				if (message.TYPE === '20') {
					sendMessage()
				}
				if (message.TYPE === '2') {
					const coin = message.FROMSYMBOL as keyof MarketData
					const market = message.MARKET?.toLowerCase() as keyof CoinData
					if (coinsData) {
						setCoinsData((prevState) => {
							return {
								...prevState,
								[coin]: {
									...prevState[coin],
									[market]: {
										baseSymbol: message.FROMSYMBOL,
										targetSymbol: message.TOSYMBOL,
										market: message.MARKET,
										price: message.PRICE,
										lastUpdate: message.LASTUPDATE
									}
								}
							}
						})
					}
				}
			}
			websocket.addEventListener('message', handleSocketMessage)
			return () => {
				websocket.removeEventListener('message', handleSocketMessage)
			}
		}
	}, [websocket])

	return (
		<StoreContext.Provider value={{}}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/dashboard" element={<Dashboard store={historicals} displayData={false} />} />
					</Routes>
				</Router>
			</div>
		</StoreContext.Provider>
	)
}
