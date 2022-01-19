import { create } from 'react-test-renderer'
import { MarketCard } from './MarketCard'

describe('Input Testing', () => {
	test('input snapshot', () => {
		let market = create(
			<MarketCard
				market={'marketText'}
			/>
		)
		expect(market.toJSON()).toMatchSnapshot()
	})
})