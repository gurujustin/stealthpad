import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | number | string

export enum ChainId {
  // ETHEREUM = 1,
  // RINKEBY = 4,
  // GOERLI = 5,
  BSC = 1,
  BSC_TESTNET = 8453,
  // STEALTH_TESTNT = 44474478
  STEALTH_TESTNT = 5  // goerli
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const FACTORY_ADDRESS = '0x4af4346224464b58C5E25069734E0024C9941744'

export const FACTORY_ADDRESS_MAP = {
  [ChainId.BSC]: FACTORY_ADDRESS,
  [ChainId.BSC_TESTNET]: '0x36F5f98fA5d70BfFe5D847aFdb5a779Eb8aa35E8',
  [ChainId.STEALTH_TESTNT]: '0x146B07Ad3cF07FC96d01EAD8E4b388E0c4BD3518'
}

export const INIT_CODE_HASH = '0x2bbd7558cce4e3e5f13b6e9975dd8c5f658e463e8dd824f47cab380798fcd134'

export const INIT_CODE_HASH_MAP = {
  [ChainId.BSC]: INIT_CODE_HASH,
  [ChainId.BSC_TESTNET]: '0x2bbd7558cce4e3e5f13b6e9975dd8c5f658e463e8dd824f47cab380798fcd134',
  [ChainId.STEALTH_TESTNT]: '0xd8f2610c08abfab7bf42ae9021bb9de38e3092496017bb1a0660ce3b1571eac5'
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const FEES_NUMERATOR = JSBI.BigInt(9975)
export const FEES_DENOMINATOR = JSBI.BigInt(10000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
}
