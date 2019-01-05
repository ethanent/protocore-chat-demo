const path = require('path')
const net = require('net')

const commonAbstractor = require(path.join(__dirname, 'commonAbstractor.js'))

const clientAbstractor = commonAbstractor()

const client = net.createConnection(5135, () => {
	console.log('Connected.')

	clientAbstractor.pipe(client)
	client.pipe(clientAbstractor)
})

clientAbstractor.on('rawMessage', (data) => {
	console.log(data.content)
})

process.stdin.on('data', (data) => {
	const text = data.toString().replace('\n', '')

	const segments = text.split(' ')

	const command = segments[0]

	if (command === 'login') {
		clientAbstractor.send('login', {
			'username': segments[1],
			'id': Number(segments[2])
		})

		console.log('> Logging in.')
	}

	if (command === 'chat') {
		clientAbstractor.send('message', {
			'content': text.split('chat ')[1]
		})
	}
})