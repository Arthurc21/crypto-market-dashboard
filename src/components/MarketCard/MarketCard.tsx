import React, { useEffect } from 'react'
import { TickerData } from '../../types/TickerData'
import './MarketCard.scss'
import { TriangleUpIcon, TriangleDownIcon, DashIcon } from '@primer/octicons-react'

interface MarketCardProps {
	market: string
	lastPrices?: Array<TickerData>
}

export const MarketCard = ({ market, lastPrices }: MarketCardProps): React.ReactElement => {
	const historicalPrices = lastPrices !== undefined ? lastPrices.slice(1, lastPrices.length) : []
	const redColor = '#B80000'
	const greenColor = '#8BC34A'
	const yellowColor = '#FFD54F'

	const formattPrice = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	})

	const formatDate = (timestamp: number) => {
		const fullDate = new Date(timestamp).toISOString()
		const date = fullDate.slice(0, 10)
		const time = fullDate.slice(11, 19)
		return `${date} ${time}`
	}

	const formatPriceValue = (): string => {
		let coinValue
		if (lastPrices && lastPrices[0].price !== undefined) {
			coinValue = lastPrices[0].price
			return formattPrice.format(coinValue)
		} else return '0'
	}

	const getStatusIcon = () => {
		if (lastPrices) {
			const currentPrice = lastPrices[0].price
			const prevPrice = lastPrices[1] ? lastPrices[1].price : 0
			if (currentPrice && prevPrice) {
				if (currentPrice > prevPrice) {
					return <TriangleUpIcon fill={greenColor} size="medium" />
				} else if (currentPrice < prevPrice) {
					return <TriangleDownIcon fill={redColor} size="medium" />
				} else if (currentPrice === prevPrice) {
					return <DashIcon fill={yellowColor} size="medium" />
				}
			}
		}
	}

	return (
		<div className="market-card-contianer">
			<div className="card-header">
				<div className="current-price-container">
					{getStatusIcon()}
					<span>{(lastPrices && lastPrices[0].price !== undefined) ? formatPriceValue() : 'Loading'}</span>
				</div>
				<span className="market-span">{market ? market.toUpperCase() : ''}</span>
			</div>
			<div className="price-list">
				{historicalPrices.map((element, index) => {
					//console.log('element', element)
					return (
						<div key={`price-${index}`} className="element-list">
							<span>{element.lastUpdate ? formatDate(element.lastUpdate) : ''}</span>
							<span>{element.price ? formattPrice.format(element.price) : ''}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
