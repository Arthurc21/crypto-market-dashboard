import { TickerData } from '../types/TickerData'
import _ from 'lodash'

export const cleanData = (data: TickerData, prevData?: TickerData) => {
	const newData = { ...data }
	let date = new Date()
	let timestamp = date.getTime()
	newData.lastUpdate = timestamp
	if (data.price === undefined) {
		if (prevData) {
			newData.price = prevData.price
		} else newData.price = 0
	}
	return newData
}
