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

contract(`WavestreamPresale (happy path, sale closed):`, accounts => {
  const addr = getAddresses(accounts)
  const rate = 100 // 100 tokens for 1 Ether, assuming token.digits is 18
  let presale
  let token

  before(async () => {
    token = await TestToken.new(ether(5000), {from: addr.owner})
    presale = await WavestreamPresale.new(
      rate,
      addr.priorityWallet,
      ether(7),
      addr.wallet,
      ether(50),
      token.address,
      {from: addr.owner},
    )
    await token.transfer(presale.address, ether(5000), {from: addr.owner})
  })

  it(`sets owner to the address which created the contract`, async () => {
    const owner = await presale.owner()
    assert.equal(owner, addr.owner)
  })

  it('accepts payment', async () => {
    await presale.buyTokens(addr.investor, {
      value: ether(10),
      from: addr.investor,
    })
  })

  it(`doesn't allow non-owner to close the crowdsale`, async () => {
    await assertRevert(presale.closeCrowdsale({from: addr.anonymous}))
  })

  it(`owner has no tokens before sale is closed`, async () => {
    const tokenBalance = await token.balanceOf(addr.owner)
    assert.bignumEqual(tokenBalance, '0')
  })

  it(`crowdsale has tokens on its balance before sale is closed`, async () => {
    const presaleBalance = await token.balanceOf(presale.address)
    assert.bignumEqual(presaleBalance, ether(4000))
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

  // prettier-ignore

  it(`after closing the crowdsale, owner gets all tokens that were on crowdsale's balance`,
    async () =>
  {
    const ownerTokenBalance = await token.balanceOf(addr.owner)
    assert.bignumEqual(ownerTokenBalance, ether(4000), `owner's balance`)

    const presaleTokenBalance = await token.balanceOf(presale.address)
    assert.bignumEqual(presaleTokenBalance, 0, `crowdsale's balance`)
  })

  it(`isClosed equals true after crowdsale is closed`, async () => {
    const isClosed = await presale.isClosed()
    assert.equal(isClosed, true)
  })

  it(`doesn't allow owner to close the crowdsale when it's already closed`, async () => {
    await assertRevert(presale.closeCrowdsale({from: addr.owner}))
  })

  it(`doesn't accept payments after the crowdsale is closed`, async () => {
    await assertRevert(
      presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      }),
    )
  })
})
