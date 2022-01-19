import React, { useEffect, useRef, useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useWebSocket } from './hooks/useWebSocket'
import { MessageResponse } from './types/MessageResponse'
import { MarketData } from './types/MarketData'
import { UserData } from './types/UserData'
import { TickerData } from './types/TickerData'
import { CoinData, CoinDataHistorical } from './types/CoinData'
import { Store } from './types/Store'
import { subscribeAll } from './utilities/messages'
import { populateQueue } from './utilities/populateQueue'
import { formatData } from './utilities/formatData'
import { checkDataAvailability } from './utilities/checkDataAvailability'
import { Dashboard } from './components/Dashboard/Dashboard'
import { Login } from './components/Login/Login'
import { getConversionRate } from './connectivity/getConversionRate'
import _ from 'lodash'

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
	const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL
	const websocketKey = process.env.REACT_APP_WEBSOCKET_KEY
	const websocketFullUrl = `${websocketUrl}?api_key=${websocketKey}`
	const websocket = useWebSocket(websocketFullUrl)
	const [coinsData, setCoinsData] = useState<CoinData>({})
	const [historicals, setHistoricals] = useState<CoinDataHistorical>({})
	const [userData, setUserData] = useState<UserData>(defaultUserData)
	const [usdMxnConversionRate, setUsdMxnConversionRate] = useState<number>(1)
	const [updateTime, setUpdateTime] = useState<number>(1000)
	const dataRef = useRef({})
	const historicalRef = useRef({})
	const conversionRateRef = useRef(1)
	const counter = useRef(0)
	
	const sendMessage = () => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			websocket.send(JSON.stringify(subscribeAll))
		}
	}

	const updateHistoricalValues = (data: CoinData, coinDataHistorical: CoinDataHistorical, conversionRate: number) => {
		_.forEach(data, (market) => {
			_.forEach(market, (ticker) => {
				const currentCoin = ticker.baseSymbol
				const currentMarket = ticker.market
				if (coinDataHistorical && currentCoin && currentMarket) {
					let currentMarketHistorical = _.cloneDeep(coinDataHistorical)
					let tickerList: Array<TickerData> = []
					if (currentMarketHistorical[currentCoin] === undefined) {
						const tickerClean = formatData(ticker, conversionRate)
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
						const tickerClean = formatData(ticker, conversionRate, tickerArrayRef[0])
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

	const setRate = async () => {
		const rate = await getConversionRate('USD', 'MXN')
		setUsdMxnConversionRate(rate)
	}

	useEffect(() => {
		dataRef.current = coinsData
		historicalRef.current = historicals
		conversionRateRef.current = usdMxnConversionRate
		if (counter.current > 8) {
			setUpdateTime(15000)
		}
	})

	useEffect(() => {
		setRate()
		const interval = setInterval(() => {
			updateHistoricalValues(dataRef.current, historicalRef.current, conversionRateRef.current)
			counter.current = counter.current + 1
		}, updateTime)
		return () => clearInterval(interval) 
	}, [updateTime])

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
										baseSymbol: message.FROMSYMBOL ? message.FROMSYMBOL : '',
										targetSymbol: message.TOSYMBOL ? message.TOSYMBOL : '',
										market: message.MARKET ? message.MARKET : '',
										price: message.PRICE ? message.PRICE : 0,
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
	}, [websocket, coinsData, sendMessage, historicals])

	return (
		<StoreContext.Provider value={{ userData: userData, currentUsdMxnRateConversion: usdMxnConversionRate }}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/" element={<Navigate to={'/login'} />} />
						<Route path="/login" element={<Login onSubmit={(userData) => setUserData(userData)} />} />
						<Route
							path="/dashboard"
							element={<Dashboard historicalData={historicals}/>}
						/>
					</Routes>
				</Router>
			</div>
		</StoreContext.Provider>
	)
}
