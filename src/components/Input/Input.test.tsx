import { create } from 'react-test-renderer'
import { Input } from './Input'

describe('Input Testing', () => {
	const onCheckFunc = jest.fn()
	test('input snapshot', () => {
		let input = create(
			<Input
				id={'inputTest'}
				label={'inputTest'}
				value={'inputTest'}
				required={true}
				placeholder={'test'}
				onChange={onCheckFunc}
			/>
		)
		expect(input.toJSON()).toMatchSnapshot()
	})
})
