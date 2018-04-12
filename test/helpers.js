export function getAddresses(accounts) {
  const [
    deployer,
    investor,
    priorityWallet,
    wallet,
    purchaser,
    anonymous,
  ] = accounts
  return {
    deployer,
    investor,
    priorityWallet,
    wallet,
    purchaser,
    anonymous,
  }
}
