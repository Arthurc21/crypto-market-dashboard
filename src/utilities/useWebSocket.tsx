import { useEffect, useState } from "react"

export const useWebSocket = (url: string): WebSocket | undefined => {
    const [socket, setSocket] = useState<WebSocket | undefined>()

    useEffect(() => {
        if (socket === undefined) {
			console.log('%c--------------Connecting to new socket--------------', 'color: red')
			setSocket(new WebSocket(url))
		}

        const handleSocketOpen = (event: Event) => {
			console.log('Connected to the server!', event)
			/* If an authentication is needed, its a good practice to send on the first message the auth token and if the token is valid the connection is established if not the connection is closed */
			// socket?.send(
			// 	JSON.stringify({
			// 		token: ''
			// 	})
			// )
		}

        const handleSocketClose = (event: CloseEvent) => {
			console.log('--------------Socket Closed--------------')
			// 1006 Abnormal Close, it indicates that the connection was closed in an abnormal way (https://developer.mozilla.org/es/docs/Web/API/CloseEvent)
			const abnormalClose = 1006
			if (socket && event.code === abnormalClose) {
				console.log('Abnormal Close, trying to reconnect')
				setSocket(undefined)
			}
		}

		const handleSocketError = (event: Event) => {
			console.log('--------------Error on the server--------------')
			if (socket?.readyState === WebSocket.CLOSED) {
				console.log('Could not connect to the server')
			}
		}

        if (socket) {
			socket.addEventListener('open', handleSocketOpen) // Connection opened
			socket.addEventListener('close', handleSocketClose) // Connection closed
			socket.addEventListener('error', handleSocketError) // Handle error
		}

        return () => {
            console.log('useWebSocket Return')
            if (socket) {
                socket.removeEventListener('open', handleSocketOpen)
				socket.removeEventListener('close', handleSocketClose)
                if (socket.readyState === WebSocket.OPEN) {
					// 1000 Normal Close, the connexion was completed successfully wh!!ichever was its purpose creation (https://developer.mozilla.org/es/docs/Web/API/CloseEvent)
					const normalClose = 1000
                    console.log('%cwebsocket Disconected', 'color: yellow')
					socket.send('UNMOUNT')
					socket.close(normalClose, 'Unmounting compo')
				}
            }
        }
    }, [url, socket])

    return socket
}