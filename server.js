const path = require('path')
const net = require('net')

const commonAbstractor = require(path.join(__dirname, 'commonAbstractor.js'))

const activeSockets = []

const server = net.createServer((socket) => {
	const abstractor = commonAbstractor()

	console.log('A client connected.')

	activeSockets.push(socket)

	socket.on('close', () => {
		console.log('A client disconnected.')

		activeSockets.splice(activeSockets.indexOf(socket), 1)
	})

	socket.abstractor = abstractor

	socket.pipe(abstractor)
	abstractor.pipe(socket)

	abstractor.on('login', (data) => {
		console.log('Got login request.')

		console.log(data)

		if (data.id !== 5135) {
			abstractor.send('rawMessage', {
				'content': '> Your ID was incorrect.'
			})

			return
		}

		socket.login = data

		abstractor.send('rawMessage', {
			'content': '> You have logged in. Welcome.'
		})
	})

	abstractor.on('message', (data) => {
		console.log('Got message from a client.')

		if (socket.hasOwnProperty('login')) {
			activeSockets.forEach((client) => {
				client.abstractor.send('rawMessage', {
					'content': '> ' + socket.login.username + ': ' + data.content
				})
			})
		}
		else {
			abstractor.send('rawMessage', {
				'content': '> You haven\'t yet logged in.'
			})
		}
	})
})

server.listen(5135, () => {
	console.log('> Listening.')
})