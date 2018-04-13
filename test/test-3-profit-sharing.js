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

contract(
  `WavestreamPresale (profit sharing with divided payment):`,
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

    it('sends first payment to priorityWallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      })

      const updatedBalance = await getBalance(addr.priorityWallet)
      assertBignumEqual(updatedBalance, priorityBalance.plus(ether(1)))
      priorityBalance = updatedBalance
    })

    it('divides payment between priority and main wallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(10),
        from: addr.investor,
      })

      const updatedPriorityBalance = await getBalance(addr.priorityWallet)
      assertBignumEqual(updatedPriorityBalance, priorityBalance.plus(ether(6)))
      priorityBalance = updatedPriorityBalance

      const updatedMainBalance = await getBalance(addr.wallet)
      assertBignumEqual(updatedMainBalance, mainBalance.plus(ether(4)))
      mainBalance = updatedMainBalance
    })

    it('sends payments after fulfilling priority only to mainWallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      })

      const updatedPriorityBalance = await getBalance(addr.priorityWallet)
      assertBignumEqual(updatedPriorityBalance, priorityBalance)

      const updatedMainBalance = await getBalance(addr.wallet)
      assertBignumEqual(updatedMainBalance, mainBalance.plus(ether(1)))
      mainBalance = updatedMainBalance
    })
  },
)

contract(
  `WavestreamPresale (profit sharing with clear payment division):`,
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

    it('sends first payment to priorityWallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(7),
        from: addr.investor,
      })

      const updatedBalance = await getBalance(addr.priorityWallet)
      assertBignumEqual(updatedBalance, priorityBalance.plus(ether(7)))
      priorityBalance = updatedBalance
    })

    it('sends payments after fulfilling priority only to mainWallet', async () => {
      await presale.buyTokens(addr.investor, {
        value: ether(1),
        from: addr.investor,
      })

      const updatedPriorityBalance = await getBalance(addr.priorityWallet)
      assertBignumEqual(updatedPriorityBalance, priorityBalance)

      const updatedMainBalance = await getBalance(addr.wallet)
      assertBignumEqual(updatedMainBalance, mainBalance.plus(ether(1)))
      mainBalance = updatedMainBalance
    })
  },
)
