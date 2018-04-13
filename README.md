# Wavestream (WAV) Token Distribution

Ethereum contracts for [Wavestream](https://wavestream.io/) (WAV) token
distribution. Check out [off-whitepaper](https://wavestream.io/whitepaper/) for details on how WAV is used to create a zero-cost, adfree music listening experience built on interactive features, fair, transparent artist compensation, and community-driven development.

![wavestream](wavestream.png)

[OpenZeppelin contracts](https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts) are used as base for sale contract.

Wavestream presale contract forwards collected ether to two wallets: main wallet and priority wallet. At first, until total amount of ether raised is less than or equal to priority cap (`_priorityCap` constructor argument, `priorityCap` public variable), ether gets forwarded to priority wallet (`_priorityWallet` constructor argument, `priorityWallet` public variable). All ether in excess of priority cap is forwarded to main wallet (`_wallet` constructor argument, `wallet` public variable).


# Live on Ethereum

The contracts are currently available on both Ethereum mainnet and testnet (rinkeby).

#### Rinkeby Testnet (coming soon)

#### mainnet (coming soon)

## Deployment to the testnet

Use https://etherconverter.online/ to convert big numbers.

0. Get the code of token [TestToken.sol](flat/TestToken.sol)
1. Get the code of sale contract [WavestreamPresale.sol](flat/WavestreamPresale.sol)
2. Unlock metamask
3. Paste the code to https://remix.ethereum.org
4. Deploy TestToken
```
constructorArgs:
"40000000000000000000000"
// 40000 tokens assuming token.digits is 18
```
5. Deploy WavestreamPresale
```
constructorArgs:

uint256 _rate,
address _priorityWallet,
uint256 _priorityCap,
address _wallet,
uint256 _cap,
ERC20 _token

"100","<priorityWalletAddr>","7000000000000000000","<mainWalletAddr>","20000000000000000000","<testTokenAddr>"
```
6. Transfer tokens to smart contract address
7. Sale is ready to go!


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


## TODO

1. ~~Use OpenZeppelin contracts as dependencies~~
2. ~~Add linters for solidity and js~~
3. ~~Add coverage tool for solidity code~~
4. ~~Add dev documentation~~
5. ~~Add crowdsale description~~
6. ~~Comprehensive tests~~
7. ~~Code Review~~
8. Webservice to track sale progress
9. ~~Add deploy notes~~
