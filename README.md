# Wavestream (WAV) Token Distribution

The Ethereum contracts for the [Wavestream](https://wavestream.io/) (WAV) token
distribution. Check out [off-whitepaper](https://wavestream.io/whitepaper/) for details on how WAV is used to create a zero-cost, adfree music listening experience built on interactive features, fair, transparent artist compensation, and community-driven development.

[OpenZeppelin contracts](https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts) are used as base for sale contract.


# Live on Ethereum

The contracts are currently available on both Ethereum mainnet and testnet (rinkeby).

#### Rinkeby Testnet (coming soon)

#### mainnet (coming soon)


## TODO

1. ~~Use OpenZeppelin contracts as dependencies~~
2. ~~Add linters for solidity and js~~
3. ~~Add coverage tool for solidity code~~
4. ~~Add dev documentation~~
5. ~~Add crowdsale description~~
6. Comprehensive tests
7. Code Review
8. Webservice to track sale progress
9. Add deploy notes


## Repository structure

Main contracts:

* [WavestreamPresale.sol](contracts/WavestreamPresale.sol): sale contract; allows to receive tokens in exchange to Ether.

Contracts used for tests (do not deploy):

* [TestToken.sol](contracts/TestToken.sol): token contract; manages token balances.

Tests/specification:

* [test-1-happy-path.js](test/test-1-happy-path.js): specification/documentation covering basic usage of sale contract.


## Development

To deploy contracts, run tests and generate coverage report, you need to install dependencies first. Node.js v8.3.0 or later is required (v9.8.0 or later is recommended). After making sure Node.js is installed, install NPM dependencies:

```
npm install
```


## Dev utilities

#### Running tests

```
npm run test
```

#### Generating test coverage report

```
npm run coverage
```

Coverage report will be located at `coverage.json` and `coverage/index.html`. It is generated with [solidity-coverage](https://github.com/sc-forks/solidity-coverage).

#### Linting Solidity code

```
npm run lint
```

Linting is done using [Solium](https://github.com/duaraghav8/Solium), with additional rules from [security plugin](https://github.com/duaraghav8/solium-plugin-security) and [OpenZeppelin plugin](https://github.com/OpenZeppelin/solium-plugin-zeppelin).

#### Auto-formatting code

```sh
# Fixes Solidity code
npm run tix-sol

# Fixes JavaScript code
npm run fix-js

# Fixes Solidity and JavaScript code
npm run fix
```

#### Generate flatten contracts

```
npm run flatten
```


## Pre-commit hooks

This project has pre-commit hooks configured. Each time you attempt to commit some code, Solium linter will be ran on all staged Solidity contracts, and Prettier will be ran on all staged JavaScript files in linter mode.

If there are any linter errors or any changes Prettier would make, committing will fail. In this case, inspect commit command output, fix all errors, stage the changes and commit again. Running `npm run fix` will probably fix most of the stuff, but some errors will require manual fixing, e.g. shadowing contract state variable by function-local variable.
