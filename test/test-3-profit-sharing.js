import BigNumber from 'bignumber.js'

import {
  assert,
  assertRevert,
  getAddresses,
  ether,
  getBalance,
  assertTxSucceedsGeneratingEvents,
} from './helpers'

const TestToken = artifacts.require('./TestToken.sol')
const WavestreamPresale = artifacts.require('./WavestreamPresale.sol')

contract(
  `WavestreamPresale (profit sharing with one divided payment):`,
  accounts => {
    const addr = getAddresses(accounts)
    const rate = 100 // 100 tokens for 1 Ether, assuming token.digits is 18
    let presale
    let token
    let priorityBalance
    let mainBalance

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
      await token.transfer(presale.address, ether(10000), {from: addr.owner})
      priorityBalance = await getBalance(addr.priorityWallet)
      mainBalance = await getBalance(addr.wallet)
    })

    it('forwards first payment to priorityWallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      })

      const updatedBalance = await getBalance(addr.priorityWallet)
      assert.bignumEqual(updatedBalance, priorityBalance.plus(ether(1)))
      priorityBalance = updatedBalance
    })

    it('divides payment between priority and main wallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(10),
        from: addr.investor,
      })

      const updatedPriorityBalance = await getBalance(addr.priorityWallet)
      assert.bignumEqual(updatedPriorityBalance, priorityBalance.plus(ether(6)))
      priorityBalance = updatedPriorityBalance

      const updatedMainBalance = await getBalance(addr.wallet)
      assert.bignumEqual(updatedMainBalance, mainBalance.plus(ether(4)))
      mainBalance = updatedMainBalance
    })

    it('after priority cap is reached, forwards all payments to main wallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      })

      const updatedPriorityBalance = await getBalance(addr.priorityWallet)
      assert.bignumEqual(updatedPriorityBalance, priorityBalance)

      const updatedMainBalance = await getBalance(addr.wallet)
      assert.bignumEqual(updatedMainBalance, mainBalance.plus(ether(1)))
      mainBalance = updatedMainBalance
    })
  },
)

contract(
  `WavestreamPresale (profit sharing with no divided payments):`,
  accounts => {
    const addr = getAddresses(accounts)
    const rate = 100 // 100 tokens for 1 Ether, assuming token.digits is 18
    let presale
    let token
    let priorityBalance
    let mainBalance

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
      await token.transfer(presale.address, ether(10000), {from: addr.owner})
      priorityBalance = await getBalance(addr.priorityWallet)
      mainBalance = await getBalance(addr.wallet)
    })

    it('forwards first payment to priorityWallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(7),
        from: addr.investor,
      })

      const updatedBalance = await getBalance(addr.priorityWallet)
      assert.bignumEqual(updatedBalance, priorityBalance.plus(ether(7)))
      priorityBalance = updatedBalance
    })

    it('after priority cap is reached, forwards all payments to main wallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      })

      const updatedPriorityBalance = await getBalance(addr.priorityWallet)
      assert.bignumEqual(updatedPriorityBalance, priorityBalance)

      const updatedMainBalance = await getBalance(addr.wallet)
      assert.bignumEqual(updatedMainBalance, mainBalance.plus(ether(1)))
      mainBalance = updatedMainBalance
    })
  },
)
