export const decimalAdjust = (value: number, e: number): string => {
    return value.toString().slice(0, e)
}