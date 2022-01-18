import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './components/Dashboard/Dashboard'
import { Login } from './components/Login/Login'
import { useWebSocket } from './utilities/useWebSocket'
import { subscribeAll } from './utilities/messages'
import { MessageResponse } from './types/MessageResponse'
import { populateQueue } from './utilities/populateQueue'
import { cleanData } from './utilities/cleanArray'
import _ from 'lodash'
import { CoinData, CoinDataHistorical } from './types/CoinData'
import { MarketData } from './types/MarketData'
import { UserData } from './types/UserData'
import { TickerData } from './types/TickerData'

export interface Store {
	userData: UserData
}

const defaultUserData: UserData = {
	firstName: '',
	lastName: '',
	email: '',
	phone: ''
}

const defaultStore: Store = {
	userData: defaultUserData
}

export const StoreContext = React.createContext<Store>(defaultStore)

export default function App(): React.ReactElement {
	const websocketUrl = 'wss://streamer.cryptocompare.com/v2'
	const websocketKey = '21fc60de5f7a3b58fb608eac70d189cb4fd958e8041c017d6c9524f4eccd6db4'
	const websocketFullUrl = `${websocketUrl}?api_key=${websocketKey}`
	const websocket = useWebSocket(websocketFullUrl)
	const updateTime = 15000

	const [coinsData, setCoinsData] = useState<CoinData>({})
	const [historicals, setHistoricals] = useState<CoinDataHistorical>({})
	const [userData, setUserData] = useState<UserData>(defaultUserData)
	const [dataEmpty, setDataEmpty] = useState<boolean>(true)
	const dataRef = useRef({})
	const historicalRef = useRef({})

	const sendMessage = () => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			websocket.send(JSON.stringify(subscribeAll))
		}
	}

	const checkDataAvailability = () => {
		const historicalsMap = _.find(historicals, (coin) => {
			const emptyMarket = _.find(coin, (market) => {
				return market.length === 0
			})
			return !!emptyMarket
		})
		setDataEmpty(!!historicalsMap)
	}

	const updateHistoricalValues = (data: CoinData, coinDataHistorical: CoinDataHistorical) => {
		console.log('%cupdateHistoricalValues', 'color: orange')
		_.forEach(data, (market) => {
			_.forEach(market, (ticker) => {
				const currentCoin = ticker.baseSymbol
				const currentMarket = ticker.market
				if (coinDataHistorical && currentCoin && currentMarket) {
					let currentMarketHistorical = _.cloneDeep(coinDataHistorical)
					let tickerList: Array<TickerData> = []
					if (currentMarketHistorical[currentCoin] === undefined) {
						const tickerClean = cleanData(ticker)
						setHistoricals((prevState) => {
							return {
								...prevState,
								[currentCoin]: {
									...prevState[currentCoin],
									[currentMarket]: [tickerClean]
								}
							}
						})
					} else {
						const tickerArrayRef = currentMarketHistorical[currentCoin][currentMarket]
						console.log('ticker before', ticker)
						const tickerClean = cleanData(ticker, tickerArrayRef[0])
						console.log('ticker after', tickerClean)
						tickerList = populateQueue(tickerClean, tickerArrayRef)
						setHistoricals((prevState) => {
							return {
								...prevState,
								[currentCoin]: {
									...prevState[currentCoin],
									[currentMarket]: tickerList
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
		historicalRef.current = historicals
	})

	useEffect(() => {
		const interval = setInterval(() => {
			updateHistoricalValues(dataRef.current, historicalRef.current)
		}, updateTime)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		if (websocket) {
			const handleSocketMessage = (event: MessageEvent) => {
				const message: MessageResponse = JSON.parse(event.data)
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

	useEffect(() => {
		if (dataEmpty) {
			checkDataAvailability()
		}
	}, [coinsData])

	return (
		<StoreContext.Provider value={{ userData }}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/" element={<Navigate to={'/login'} />} />
						<Route path="/login" element={<Login onSubmit={(userData) => setUserData(userData)} />} />
						<Route
							path="/dashboard"
							element={<Dashboard historicalData={historicals} displayData={!dataEmpty} />}
						/>
					</Routes>
				</Router>
			</div>
		</StoreContext.Provider>
	)
}
