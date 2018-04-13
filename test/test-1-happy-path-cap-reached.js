import BigNumber from 'bignumber.js'

import {assert, assertRevert, getAddresses, ether} from './helpers'

const TestToken = artifacts.require('./TestToken.sol')
const WavestreamPresale = artifacts.require('./WavestreamPresale.sol')

contract(`WavestreamPresale (happy path cap reached):`, accounts => {
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

  it('accepts payment', async function() {
    await presale.buyTokens(addr.investor, {
      value: ether(10),
      from: addr.investor,
    })
  })

  it(`credits investor address with tokens`, async () => {
    const tokenBalance = await token.balanceOf(addr.investor)
    const expectedTokenBalance = ether(10).times(rate)
    assert.bignumEqual(tokenBalance, expectedTokenBalance)
  })

  it('accepts payment to hit the cap', async function() {
    await presale.buyTokens(addr.investor, {
      value: ether(40),
      from: addr.investor,
    })
  })

  it(`capReached returns true`, async () => {
    const capReached = await presale.capReached()
    assert.equal(capReached, true)
  })

  it(`isClosed equals false even if the cap has been reached`, async () => {
    const isClosed = await presale.isClosed()
    assert.equal(isClosed, false)
  })

  it(`it doesnt allow investor to buy tokens`, async () => {
    await assertRevert(
      presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      }),
    )
  })

  it(`presale doesnt have tokens and ether on it's balance`, async () => {
    const presaleBalance = await token.balanceOf(presale.address)
    assert.bignumEqual(presaleBalance, '0')
  })

  it(`allows owner to close the crowdsale`, async () => {
    await presale.closeCrowdsale({from: addr.owner})
  })
})
