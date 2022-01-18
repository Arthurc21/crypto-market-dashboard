import _ from 'lodash'
import { CoinDataHistorical } from '../types/CoinData'

export const checkDataAvailability = (historicals: CoinDataHistorical) => {
    return _.find(historicals, (coin) => {
        const emptyMarket = _.find(coin, (market) => {
            return market.length === 0
        })
        return !!emptyMarket
    })
}