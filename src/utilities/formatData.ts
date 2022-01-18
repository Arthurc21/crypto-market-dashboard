import { TickerData } from '../types/TickerData'
import _ from 'lodash'

export const formatData = (data: TickerData, conversionRate: number, prevData?: TickerData) => {
	const newData = _.cloneDeep(data)
	let date = new Date()
	let timestamp = date.getTime()
	newData.lastUpdate = timestamp
	if (data.price === undefined) {
		if (prevData && prevData.price) {
			newData.price = prevData.price
		} else newData.price = 0
	} else {
		newData.price = data.price * conversionRate
	}
	return newData
}
