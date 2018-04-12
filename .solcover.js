module.exports = {
  copyPackages: ['zeppelin-solidity'],
  compileCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle compile',
  testCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/truffle test --network coverage',
}
