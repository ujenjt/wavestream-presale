import chai from 'chai'
import traverse from 'traverse'
import BigNumber from 'bignumber.js'
export const assert = chai.assert

export async function assertRevert(promise, message) {
  try {
    await promise
    assert.fail('Expected revert not received')
  } catch (error) {
    const revertFound = error.message.search('revert') >= 0
    assert(revertFound, `Expected "revert", got ${error} instead ${message}`)
  }
}

export function getAddresses(accounts) {
  const [
    owner,
    investor,
    priorityWallet,
    wallet,
    purchaser,
    anonymous,
  ] = accounts
  return {
    owner,
    investor,
    priorityWallet,
    wallet,
    purchaser,
    anonymous,
  }
}

export function ether(n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'))
}

export async function assertTxSucceedsGeneratingEvents(
  txResultPromise,
  expectedEvents,
  message,
) {
  const txProps = await assertTxSucceeds(txResultPromise, message)

  const stringifiedExpectedEvents = recursivelyStringifyBigNumbers(
    expectedEvents,
  )

  const stringifiedTxEvents = recursivelyStringifyBigNumbers(txProps.events)

  assert.deepEqual(
    stringifiedTxEvents,
    stringifiedExpectedEvents,
    message ? `${message}, tx events` : `tx events`,
  )

  return txProps
}

export async function inspectTransaction(txResultPromise) {
  const txResult = await txResultPromise
  const tx = await promisifyCall(web3.eth.getTransaction, web3.eth, [
    txResult.tx,
  ])
  const {receipt} = txResult
  const success =
    receipt.status !== undefined
      ? +toBigNumber(receipt.status, 0) === 1 // Since Byzantium fork
      : receipt.gasUsed < tx.gas // Before Byzantium fork (current version of TestRPC)
  const txPriceWei = new BigNumber(tx.gasPrice).times(receipt.gasUsed)
  const events = txResult.logs
    .map(log => (log.event ? {name: log.event, args: log.args} : null))
    .filter(x => !!x)
  return {result: txResult, success, txPriceWei, events}
}

function toBigNumber(val, defaultVal) {
  try {
    return new BigNumber(val)
  } catch (err) {
    return new BigNumber(defaultVal)
  }
}

export async function assertTxSucceeds(txResultPromise, message) {
  let txProps
  try {
    txProps = await inspectTransaction(txResultPromise)
  } catch (err) {
    assert(
      false,
      `${message ? message + ': ' : ''}transaction was expected to ` +
        `succeed but failed: ${err.message}`,
    )
  }
  if (!txProps.success) {
    assert(
      false,
      `${
        message ? message + ': ' : ''
      }transaction was expected to succeed but failed`,
    )
  }
  return txProps
}

function recursivelyStringifyBigNumbers(obj) {
  traverse(obj).forEach(function(x) {
    if (x instanceof BigNumber) {
      this.update(x.toString())
    }
  })
}

function promisifyCall(fn, ctx, args = []) {
  return new Promise((resolve, reject) => {
    args.push((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
    fn.apply(ctx, args)
  })
}
