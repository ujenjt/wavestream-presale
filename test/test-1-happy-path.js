import BigNumber from 'bignumber.js'

import {
  assert,
  assertRevert,
  getAddresses,
  ether,
} from './helpers'

const TestToken = artifacts.require('./TestToken.sol')
const WavestreamPresale = artifacts.require('./WavestreamPresale.sol')

contract(`WavestreamPresale (happy path):`, accounts => {
  const addr = getAddresses(accounts)

  const rate = 100 // 100 tokens for 1 Ether, assuming token.digits is 18

  let presale
  let token

  before(async () => {
    token = await TestToken.new({from: addr.owner})

    presale = await WavestreamPresale.new(
      rate,
      addr.priorityWallet,
      '10e18',
      addr.wallet,
      ether(400),
      token.address,
      {from: addr.owner}
    )

    await token.transfer(presale.address, '100000e18', {
      from: addr.owner,
    })
  })

  it(`sets owner to the address which created the contract`, async () => {
    const owner = await presale.owner()
    assert.equal(owner, addr.owner)
  })

  it('accepts payments', async function () {
    await presale.buyTokens(addr.investor, {
      value: '10e18',
      from: addr.investor,
    })
  })

  it(`allows owner to close the crowdsale`, async () => {
    await presale.closeCrowdsale(
      {from: addr.owner},
    )
  })

  it('it doesnt accepts payments after sale is closed', async function () {
    await assertRevert(
      presale.buyTokens(addr.investor, {
        value: '10e18',
        from: addr.investor,
      })
    )
  })
})
