import { serializeTokens } from 'utils/serializeTokens'
import { bscTestnetTokens, bscTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

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
      8453: '0xC419328A3A5b7b4E2312946F90cd034Cf7abf0Cc',
      1: '0x30885515b9AeCc599Dc6D48106B471EAd26dEBB0',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true,
  },
  {
    pid: 1,
    lpSymbol: 'STEALTH-USDT LP',
    lpAddresses: {
      8453: '0x8bfD8Fd94342ABDc404c3b780AbAf8bcF74f9E51',
      1: '0x30885515b9AeCc599Dc6D48106B471EAd26dEBB0',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 2,
    lpSymbol: 'STEALTH-ETH LP',
    lpAddresses: {
      8453: '0xF7a7326F25Afb7da7b84D426B2e7824D326CDa2C',
      1: CAKE_BNB_LP_MAINNET,
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'USDT-ETH LP',
    lpAddresses: {
      8453: '0xa605851B07a2bb1883687fD2805b46fc218d7D92',
      1: '0xA8f8B7C0a4ec1ca9fA115dAe915e33AEDdf2526B',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 5,
    lpSymbol: 'WETH',
    lpAddresses: {
      8453: '0x5fe8bBD2fD4Ee98b45a996DA2fd22263baD7A597',
      1: '0xA8f8B7C0a4ec1ca9fA115dAe915e33AEDdf2526B',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.usdt,
    isTokenOnly: true,
  },
]

export default farms
