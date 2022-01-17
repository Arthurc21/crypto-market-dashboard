import { strictEqual } from "assert"
import { Trade } from "../types/Trade"

export const queue = (newElement: any, currentQueue: Array<any>) => {
    //console.log('%c================================================', 'color: yellow')
    //console.log('queue')
    //console.log('newElement', newElement)
    //console.log('currentQueue', currentQueue)
    const store = currentQueue
    if (currentQueue.length < 6) {
        store.unshift(newElement)
    } else {
        store.unshift(newElement)
        store.pop()
    }
    //console.log('%c================================================', 'color: yellow')
    return store
}