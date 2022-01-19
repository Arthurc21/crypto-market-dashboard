export const getConversionRate = async (from: string, to: string) => {
	const apiKey = process.env.REACT_APP_API_KEY
	const apiUrl = process.env.REACT_APP_API_URL
	const fullUrl = `${apiUrl}?access_key=${apiKey}&from=${from}&to=${to}&amount=1`

	const value = await fetch(fullUrl, { method: 'GET' })
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
