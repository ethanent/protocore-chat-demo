const {Schema, StreamingAbstractor} = require('protocore')

module.exports = () => {
	const commonAbstractor = new StreamingAbstractor()

	commonAbstractor.register('login', new Schema([
		{
			'name': 'username',
			'type': 'string',
			'encoding': 'ascii'
		},
		{
			'name': 'id',
			'type': 'uint',
			'size': 24
		}
	]))

	commonAbstractor.register('message', new Schema([
		{
			'name': 'content',
			'type': 'string'
		}
	]))

	commonAbstractor.register('rawMessage', new Schema([
		{
			'name': 'content',
			'type': 'string'
		}
	]))

	return commonAbstractor
}