import { consumers } from "stream"

const fixerApikey = 'c126a853865e3acfc3efb776474b538a'
const fixerApiUrl = 'https://data.fixer.io/api/convert'
const fixerFullUrl = `${fixerApiUrl}?access_key=${fixerApikey}&from=USD&to=MXN&amount=1`

export const getUsdMxnConversionRate = async () => {
    const value = await fetch(fixerFullUrl, { method: 'GET' })
		.then(async (response: Response) => {
			if (response.ok) {
                console.log('response OK')
                return await response.json()
                .then(responseJson => {
                    console.log('responseJson', responseJson)
                    return responseJson.result
                })
            } else {
                let error: Error = await response.json()
                throw error
            }
		})
		.catch((error) => {
			console.error("Couldn't connect to BMX server", error)
		})
        console.log('value', value)
        return value
}
