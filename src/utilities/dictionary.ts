import { Trade } from "../types/Trade"

interface Dictionary {
    [Key: string]: string
}

interface T {
    [key: string]: any
}

export const dictionary = () => {
    let item: Dictionary = {
        M: 'market',
        FSYM: 'baseCoin',
        TSYM: 'counterCoin',
        TS: 'timestamp',
        Q: 'baseCoinVolume',
        P: 'counterCoinVolume',
        TOTAL: 'total'

    }
    return item
}

// export const convert = (trade: T) => {
//     const dict = dictionary()
//     const map = new Map
//     Object.entries(trade).map((key) => {
//         map.set(key[0], dict[key[0]])
//     })
//     console.log('map', map)
//     console.log(map.entries)
//     for (let entries of map.entries()) {
//         console.log(entries);
//     }
//     return {}
// }

// export const convert = (trade: T) => {
//     const dict = dictionary()
//     let item: Trade
//     Object.entries(trade).map((entrie) => {
//         const key = entrie[0] as keyof Trade
//         const value = entrie[1]
//         item[key] = trade[value]
//     })
//     return item
// }

// export const convert = (trade: T) => {
//     let output: Trade = {
//         market: '',
//         baseCoin: '',
//         counterCoin: '',
//         timestamp: 0,
//         baseCoinVolume: 0,
//         counterCoinVolume: 0,
//         total: 0
//     }
//     const item = dictionary()
//     for (let entries of Object.entries(item)) {
//         const k: string = entries[0]
//         if (k in item) {
//             const j: string = item[k]
//             if (j !== undefined) {
//                 output[j] = item[k]
//             }
//         }
//     }
// }

export const convert = (trade: T) => {
    console.log('input', trade)
    let output: Trade = {
        market: trade.M,
        baseCoin: trade.FSYM,
        counterCoin: trade.TSYM,
        timestamp: trade.TS,
        baseCoinVolume: trade.Q,
        counterCoinVolume: trade.P,
        total: trade.TOTAL
    }
    return output
}