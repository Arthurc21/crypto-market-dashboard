export const getConversionRate = async (from: string, to: string) => {
	const fixerApikey = 'c126a853865e3acfc3efb776474b538a'
	const fixerApiUrl = 'https://data.fixer.io/api/convert'
	const fixerFullUrl = `${fixerApiUrl}?access_key=${fixerApikey}&from=${from}&to=${to}&amount=1`

	const value = await fetch(fixerFullUrl, { method: 'GET' })
		.then(async (response: Response) => {
			if (response.ok) {
				return await response.json().then((responseJson) => {
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
	return value
}
