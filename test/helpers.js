import chai from 'chai'
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
