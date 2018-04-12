import BigNumber from 'bignumber.js'

import {
  getAddresses,
} from './helpers'

const TestToken = artifacts.require('./TestToken.sol')
const WavestreamPresale = artifacts.require('./WavestreamPresale.sol')

contract(`WavestreamPresale (happy path):`, accounts => {
  const addr = getAddresses(accounts)

  const rate = 1 // 1 tokens for 1 Ether, assuming token.digits is 18

  let presale
  let token

  before(async () => {
    token = await TestToken.new({from: addr.deployer})

    presale = await WavestreamPresale.new(rate, addr.wallet_1, '10e20', token.address, {
      from: addr.deployer,
    })

    await token.transfer(presale.address, '100000e18', {
      from: addr.deployer,
    })
  })

  it('accepts payments', async function () {
    await presale.buyTokens(addr.investor, {
      value: '10e18',
      from: addr.investor,
    })
  })
})
