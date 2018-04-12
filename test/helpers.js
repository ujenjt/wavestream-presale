export function getAddresses(accounts) {
  const [
    deployer,
    investor,
    wallet_1,
    wallet_2,
    purchaser,
    anonymous,
  ] = accounts
  return {
    deployer,
    investor,
    wallet_1,
    wallet_2,
    purchaser,
    anonymous,
  }
}
