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

  it(`sets owner to the address which created the contract`, async () => {
    const owner = await presale.owner()
    assert.equal(owner, addr.owner)
  })

  it('accepts payments', async function() {
    await presale.buyTokens(addr.investor, {
      value: ether(1),
      from: addr.investor,
    })
  })

  it(`it doesnt allow anonymous to close the crowdsale`, async () => {
    await assertRevert(presale.closeCrowdsale({from: addr.anonymous}))
  })

  it(`allows owner to close the crowdsale, generating event`, async () => {
    const expectedEvent = {
      name: 'Closed',
    }

    await assertTxSucceedsGeneratingEvents(
      await presale.closeCrowdsale({from: addr.owner}),
      [expectedEvent],
    )
  })

  it(`sets isClosed equals true after crowdsale has been closed`, async () => {
    const isClosed = await presale.isClosed()
    assert.equal(isClosed, true)
  })

  it(`it doesnt allow owner to close the crowdsale second time`, async () => {
    await assertRevert(presale.closeCrowdsale({from: addr.owner}))
  })

  it('it doesnt accepts payments after sale is closed', async function() {
    await assertRevert(
      presale.buyTokens(addr.investor, {
        value: '10e18',
        from: addr.investor,
      }),
    )
  })
})
