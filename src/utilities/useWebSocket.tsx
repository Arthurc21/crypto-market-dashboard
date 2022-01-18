import { useEffect, useState } from 'react'

export const useWebSocket = (url: string): WebSocket | undefined => {
	const [socket, setSocket] = useState<WebSocket | undefined>()

	useEffect(() => {
		if (socket === undefined) {
			setSocket(new WebSocket(url))
		}

		const handleSocketOpen = (event: Event) => {
			console.info('Connected to the server', event)
		}

		const handleSocketClose = (event: CloseEvent) => {
			const abnormalClose = 1006 // 1006 Abnormal Close
			if (socket && event.code === abnormalClose) {
				console.error('Server Error', event)
				setSocket(undefined)
			}
		}

		const handleSocketError = (event: Event) => {
			//console.log('--------------Error on the server--------------')
			if (socket?.readyState === WebSocket.CLOSED) {
				//console.log('Could not connect to the server')
			}
		}

		if (socket) {
			socket.addEventListener('open', handleSocketOpen)
			socket.addEventListener('close', handleSocketClose)
			socket.addEventListener('error', handleSocketError)
		}

		return () => {
			if (socket) {
				socket.removeEventListener('open', handleSocketOpen)
				socket.removeEventListener('close', handleSocketClose)
				if (socket.readyState === WebSocket.OPEN) {
					const normalClose = 1000 // 1000 Normal Close
					console.info('Disconected from server')
					socket.send('UNMOUNT')
					socket.close(normalClose, 'Unmounting compo')
				}
			}
		}
	}, [url, socket])

	return socket
}
