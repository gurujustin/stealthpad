import { ChainId } from '@pancakeswap/sdk'
import { Box, Text, UserMenu, UserMenuDivider, UserMenuItem } from '@pancakeswap/uikit'
import { bsc, bscTest, stealthTest } from '@pancakeswap/wagmi'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { setupNetwork } from 'utils/wallet'

const chains = [bsc, bscTest, stealthTest]
export const NetworkSelect = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box px="16px" py="8px">
        <Text>{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains.map((chain) => (
        <UserMenuItem key={chain.id} style={{ justifyContent: 'flex-start' }} onClick={() => setupNetwork(chain.id)}>
          <Image width={24} height={24} src="/images/tokens/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png" unoptimized />
          <Text pl="12px">{chain.name}</Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { chainId } = useActiveWeb3React()
  let networkName
  if (chainId === bsc.id) {
    networkName = bsc.name
  } else if ( chainId === bscTest.id) {
    networkName = bscTest.name
  } else {
    networkName = stealthTest.name
  }

  return (
    <UserMenu
      mr="8px"
      avatarSrc="/images/tokens/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png"
      account={networkName}
      ellipsis={false}
    >
      {() => <NetworkSelect />}
    </UserMenu>
  )

  return null
}
