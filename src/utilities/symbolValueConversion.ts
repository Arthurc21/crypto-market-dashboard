import { decimalAdjust } from "./decimalAdjust"

export const symbolValueConversion = (baseSymbolValue: number, convertionValue: number): string => {
    if (convertionValue > 0 && baseSymbolValue > 0) {
        let conv = convertionValue / baseSymbolValue
        let e = Math.round(baseSymbolValue).toString().length + 4
        return decimalAdjust(conv, e)
    } else return '0.0'
}