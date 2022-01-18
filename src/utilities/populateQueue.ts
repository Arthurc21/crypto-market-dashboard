export const populateQueue = (newElement: any, currentQueue?: Array<any>) => {
	let store = []
	if (currentQueue) {
		store = currentQueue
		if (currentQueue.length < 6) {
			store.unshift(newElement)
		} else {
			store.unshift(newElement)
			store.pop()
		}
	} else {
		store.unshift(newElement)
	}
	return store
}
