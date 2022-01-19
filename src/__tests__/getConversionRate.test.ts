import { getConversionRate } from '../connectivity/getConversionRate'

describe ('Test getConversionRate', () => {
    test('should get conversion rate defined and greater than cero', () => {
        return getConversionRate('USD', 'MXN')
        .then(response => {
            expect(response).toBeDefined
            expect(response).not.toBe(0)
        })
    })
})