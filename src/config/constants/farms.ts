import { serializeTokens } from 'utils/serializeTokens'
import { bscTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens(bscTokens)
// const { chainId } = useActiveWeb3React()`
export const CAKE_BNB_LP_MAINNET = '0x626BB5e02694372b5A919A5981659595C2FD3788'

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'STEALTH',
    lpAddresses: {
      8453: '',
      1: '0xB18F98822C22492Bd6b77D19cae9367f3D60fcBf',
      5: '',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
    isTokenOnly: true,
    decimals: 8,
  },
  {
    pid: 1,
    lpSymbol: 'STEALTH-ETH LP',
    lpAddresses: {
      8453: '',
      1: CAKE_BNB_LP_MAINNET,
      5: '',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'STEALTH-USDC LP',
    lpAddresses: {
      8453: '',
      1: '0x9Fe9fC20895f92bC541a082dAa17929791bf8b54',
      5: '',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdc,
  },
  {
    pid: 3,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
      8453: '',
      1: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      5: '',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'WETH',
    lpAddresses: {
      8453: '',
      1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      5: '',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.usdc,
    isTokenOnly: true,
  },
  {
    pid: 5,
    lpSymbol: 'USDC',
    lpAddresses: {
      8453: '',
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      5: '',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wbnb,
    isTokenOnly: true,
    decimals: 8,
  },
]

export default farms
