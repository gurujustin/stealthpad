import { serializeTokens } from 'utils/serializeTokens'
import { bscTestnetTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens(bscTestnetTokens)
// const { chainId } = useActiveWeb3React()`
export const CAKE_BNB_LP_MAINNET = '0x717Ef9CF2cB13e414Fa567e6070a7737E0CF7C17'

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'STEALTH',
    lpAddresses: {
      8453: '0xC16f056D4eBb5246CfB3a1D128A1974fC2cec6Aa',
      1: '',
      5: '',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true,
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
      8453: '0x8c5905c63d94f4d841d4f1d400422deac7678fc7',
      1: '',
      5: '',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 3,
    lpSymbol: 'USDC-ETH LP',
    lpAddresses: {
      8453: '0x1D3Dd7fCB2eC13a639E6B5265e63D9120e639444',
      1: '',
      5: '',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'WETH',
    lpAddresses: {
      8453: '0x4200000000000000000000000000000000000006',
      1: '',
      5: '',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true,
  },
  {
    pid: 5,
    lpSymbol: 'USDBC',
    lpAddresses: {
      8453: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      1: '',
      5: '',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true,
  },
]

export default farms
