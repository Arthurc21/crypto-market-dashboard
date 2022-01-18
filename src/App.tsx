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
import { getUsdMxnConversionRate } from './connectivity/getUsdMxnConversionRate'
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
	const websocketUrl = 'wss://streamer.cryptocompare.com/v2'
	const websocketKey = '21fc60de5f7a3b58fb608eac70d189cb4fd958e8041c017d6c9524f4eccd6db4'
	const websocketFullUrl = `${websocketUrl}?api_key=${websocketKey}`
	const websocket = useWebSocket(websocketFullUrl)
	const [coinsData, setCoinsData] = useState<CoinData>({})
	const [historicals, setHistoricals] = useState<CoinDataHistorical>({})
	const [userData, setUserData] = useState<UserData>(defaultUserData)
	const [dataEmpty, setDataEmpty] = useState<boolean>(true)
	const [usdMxnConversionRate, setUsdMxnConversionRate] = useState<number>(1)
	const dataRef = useRef({})
	const historicalRef = useRef({})
	const conversionRateRef = useRef(1)
	let updateTime = 15000

	const sendMessage = () => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			websocket.send(JSON.stringify(subscribeAll))
		}
	}

	const updateHistoricalValues = (data: CoinData, coinDataHistorical: CoinDataHistorical, conversionRate: number) => {
		console.log('%cupdateHistoricalValues', 'color: orange')
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
		const rate = await getUsdMxnConversionRate()
		setUsdMxnConversionRate(rate)
	}

	useEffect(() => {
		dataRef.current = coinsData
		historicalRef.current = historicals
		conversionRateRef.current = usdMxnConversionRate
	})

	useEffect(() => {
		setRate()
		const interval = setInterval(() => {
			updateHistoricalValues(dataRef.current, historicalRef.current, conversionRateRef.current)
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
	}, [websocket])

	useEffect(() => {
		setDataEmpty(!!checkDataAvailability(historicals))
	}, [coinsData])

	return (
		<StoreContext.Provider value={{ userData: userData, currentUsdMxnRateConversion: usdMxnConversionRate }}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/" element={<Navigate to={'/login'} />} />
						<Route path="/login" element={<Login onSubmit={(userData) => setUserData(userData)} />} />
						<Route
							path="/dashboard"
							element={<Dashboard historicalData={historicals} displayData={dataEmpty} />}
						/>
					</Routes>
				</Router>
			</div>
		</StoreContext.Provider>
	)
}
