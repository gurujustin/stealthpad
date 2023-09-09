import { serializeTokens } from 'utils/serializeTokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { bscTestnetTokens, bscTokens, stealthTestnetTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens(bscTokens)
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
      1: '0xB18F98822C22492Bd6b77D19cae9367f3D60fcBf',
      5: '0x1Cd327b11467dF6766cf6FeaD879A15D7F869247'
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true
  },
  {
    pid: 1,
    lpSymbol: 'STEALTH-ETH LP',
    lpAddresses: {
      8453: '0xf4929D6c5bBBC2f2ef8C32FAed7ddA80924E74de',
      1: CAKE_BNB_LP_MAINNET,
      5: ''
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'STEALTH-USDC LP',
    lpAddresses: {
      8453: '0x8c5905c63d94f4d841d4f1d400422deac7678fc7',
      1: '0x30885515b9AeCc599Dc6D48106B471EAd26dEBB0',
      5: ''
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 3,
    lpSymbol: 'USDC-ETH LP',
    lpAddresses: {
      8453: '0x1D3Dd7fCB2eC13a639E6B5265e63D9120e639444',
      1: '0xA8f8B7C0a4ec1ca9fA115dAe915e33AEDdf2526B',
      5: ''
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'WETH',
    lpAddresses: {
      8453: '0x4200000000000000000000000000000000000006',
      1: '0xA8f8B7C0a4ec1ca9fA115dAe915e33AEDdf2526B',
      5: ''
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true
  },
  {
    pid: 5,
    lpSymbol: 'USDC',
    lpAddresses: {
      8453: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
      1: '0xA8f8B7C0a4ec1ca9fA115dAe915e33AEDdf2526B',
      5: ''
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true
  },
]

export default farms
