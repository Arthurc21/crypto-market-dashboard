import React, { useEffect } from 'react'
import { TickerData } from '../../App'
import { Trade } from '../../types/Trade'
import './MarketCard.scss'

interface MarketCardProps {
	market: string
	lastPrices?: Array<TickerData>
}

export const MarketCard = ({ market, lastPrices }: MarketCardProps): React.ReactElement => {
	const currentPrice = lastPrices ? `$${lastPrices[0].price}` : ''
	const historicalPrices = lastPrices !== undefined ? lastPrices.slice(1, lastPrices.length) : []

    const formatDate = (timestamp: number) => {
        const fullDate = new Date(timestamp*1000).toISOString()
        const date = fullDate.slice(0, 10)
        const time = fullDate.slice(11, 19)
        return `${date} ${time}`
    }

	return (
		<div className="market-card-contianer">
			<div className="card-header">
				<div className="current-price-container">
					<span>{currentPrice}</span>
				</div>
				<span className='market-span'>{market.toUpperCase()}</span>
			</div>
			<div className="price-list">
				{historicalPrices.map((element, index) => {
					console.log('element', element)
					return (
						<div key={`price-${index}`} className="element-list">
							<span>{element.lastUpdate ? formatDate(element.lastUpdate) : ''}</span>
							<span>{element.price}</span>
						</div>
					)
				})}
			</div>
		</div>
	)
}
