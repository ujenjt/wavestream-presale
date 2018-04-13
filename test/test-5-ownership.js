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

contract(`WavestreamPresale (ownership):`, accounts => {
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

  it(`sets owner properly`, async () => {
    const owner = await presale.owner()
    assert.equal(addr.owner, owner)
  })

  it(`anonymous address can't transfer ownership to anonymous`, async () => {
    await assertRevert(
      presale.transferOwnership(addr.anonymous, {
        from: addr.anonymous,
      }),
    )
  })

  it(`owner can't transfer ownership to 0x0 address`, async () => {
    await assertRevert(presale.transferOwnership('0x0', {from: addr.owner}))
  })

  it(`owner can transfer ownership, generating event`, async () => {
    const expectedEvent = {
      name: 'OwnershipTransferred',
      args: {
        previousOwner: addr.owner,
        newOwner: addr.anonymous,
      },
    }

    await assertTxSucceedsGeneratingEvents(
      await presale.transferOwnership(addr.anonymous, {
        from: addr.owner,
      }),
      [expectedEvent],
    )
  })

  it(`new owner is set properly`, async () => {
    const newOwner = await presale.owner()
    assert.equal(addr.anonymous, newOwner)
  })
})
