const apiKey = process.env.NODE_ENV === 'testing' ? 'test' : process.env.REACT_APP_API_KEY
module.exports = apiKey
