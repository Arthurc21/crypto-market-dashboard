import { create } from 'react-test-renderer'
import { Tab } from './Tab'

describe('Tab Testing', () => {
	const onClickFunc = jest.fn()
	test('tab snapshot', () => {
		let tab = create(
			<Tab
				text={'tabText'}
                value={'tabTestValue'}
                onClick={onClickFunc}
                selected={true}
			/>
		)
		expect(tab.toJSON()).toMatchSnapshot()
	})
})