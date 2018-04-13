import BigNumber from 'bignumber.js'

import {
  assert,
  assertRevert,
  getAddresses,
  ether,
  assertTxSucceedsGeneratingEvents,
} from './helpers'

const TestToken = artifacts.require('./TestToken.sol')
const WavestreamPresale = artifacts.require('./WavestreamPresale.sol')

contract(`WavestreamPresale (close crowdsale):`, accounts => {
  const addr = getAddresses(accounts)
  const rate = 100 // 100 tokens for 1 Ether, assuming token.digits is 18
  let presale
  let token

  before(async () => {
    token = await TestToken.new(ether(100000), {from: addr.owner})
    presale = await WavestreamPresale.new(
      rate,
      addr.priorityWallet,
      ether(7),
      addr.wallet,
      ether(400),
      token.address,
      {from: addr.owner},
    )
    await token.transfer(presale.address, ether(100), {from: addr.owner})
  })

  it('accepts payment', async function() {
    await presale.buyTokens(addr.investor, {
      value: ether(1),
      from: addr.investor,
    })
  })

  it('first payment goes to priorityWallet', async function() {
    //TODO: implement
  })
})
