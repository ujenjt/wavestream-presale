import BigNumber from 'bignumber.js'

import {
  assert,
  assertRevert,
  getAddresses,
  ether,
  getBalance,
  assertBignumEqual,
  assertTxSucceedsGeneratingEvents,
} from './helpers'

const TestToken = artifacts.require('./TestToken.sol')
const WavestreamPresale = artifacts.require('./WavestreamPresale.sol')

contract(`WavestreamPresale (presale deployment checks):`, accounts => {
  const addr = getAddresses(accounts)
  const rate = 100 // 100 tokens for 1 Ether, assuming token.digits is 18
  let presale
  let token
  let priorityBalance
  let mainBalance

  before(async () => {
    token = await TestToken.new(ether(100000), {from: addr.owner})
  })

  it('fails to deploy crowdsale with zero priority cap', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        addr.priorityWallet,
        0,
        addr.wallet,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })

  it('fails to deploy crowdsale with negative priority cap', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        addr.priorityWallet,
        -1,
        addr.wallet,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })

  it('fails to deploy crowdsale with priority cap equal to main cap', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        addr.priorityWallet,
        ether(400),
        addr.wallet,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })

  it('fails to deploy crowdsale with priority cap bigger than main cap', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        addr.priorityWallet,
        ether(401),
        addr.wallet,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })

  it('fails to deploy crowdsale with zero priority wallet', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        0,
        ether(7),
        addr.wallet,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })

  it('fails to deploy crowdsale with zero main wallet', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        addr.wallet,
        ether(7),
        0,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })

  it('fails to deploy crowdsale with priority wallet equal to main wallet', async () => {
    await assertRevert(
      WavestreamPresale.new(
        rate,
        addr.wallet,
        ether(7),
        addr.wallet,
        ether(400),
        token.address,
        {from: addr.owner},
      ),
    )
  })
})
