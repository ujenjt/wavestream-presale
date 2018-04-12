require('babel-register')

const GWEI = 1000000000

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 9545,
      network_id: 1337,
      gas: 4712388,
      gasPrice: 1 * GWEI,
    },
    coverage: {
      host: 'localhost',
      port: 8555,
      network_id: '*',
      gas: 0xfffffffffff,
      gasPrice: 1,
    },
  },
  mocha: {
    enableTimeouts: false,
  },
}
