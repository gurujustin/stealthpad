import { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import { FarmWithStakedValue } from '../types'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import getTimePeriods from 'utils/getTimePeriods'

const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  displayApr: string
  removed: boolean
  cakePrice?: BigNumber
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account }) => {
  const { t } = useTranslation()

  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const [hour, setHours] = useState('00')
  const [min, setMins] = useState('00')
  const [second, setSeconds] = useState('00')
  const [day, setDay] = useState('00')

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : ''

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const earnLabel = farm.dual ? farm.dual.earnLabel : t('STEALTH + Fees')

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const lpAddress = farm.isTokenOnly ? farm.token.address : getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'STEALTH'

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  const withdrawTime = parseInt(farm.userData.lockedUntil.toString()) + parseInt(farm.lockTime.toString())
  function format2Digit(x: string) {
    return parseInt(x) > 9 ? x : "0" + x;
  }
  useEffect(() => {
    const getRemainTime = () => {
      currentSeconds = Math.floor(Date.now() / 1000)
      const { days, hours, seconds, minutes } = getTimePeriods(withdrawTime - currentSeconds)
      if (withdrawTime < currentSeconds) {
        setHours('00')
        setMins('00')
        setDay('00')
        setSeconds('00')
        clearInterval(this)

      } else {
        setHours(format2Digit(hours.toString()))
        setMins(format2Digit(minutes.toString()))
        setSeconds(format2Digit(seconds.toString()))
        setDay(format2Digit(days.toString()))
      }
    }
    let currentSeconds = Math.floor(Date.now() / 1000)
    if (withdrawTime && withdrawTime > currentSeconds) {
      setInterval(()=> getRemainTime(), 1000)
    }

  }, [withdrawTime])

  return (
    <StyledCard isActive={isPromotedFarm}>
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
          isTokenOnly={farm.isTokenOnly}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
              {farm.apr ? (
                <ApyButton
                  variant="text-and-button"
                  pid={farm.pid}
                  lpSymbol={farm.lpSymbol}
                  multiplier={farm.multiplier}
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  cakePrice={cakePrice}
                  apr={farm.apr}
                  displayApr={displayApr}
                  isTokenOnly={farm.isTokenOnly}
                />
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text>{t('Earn')}:</Text>
          <Text bold>{earnLabel}</Text>
        </Flex>
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase">{t('Lock Period')}:</Text>
          {farm.lockTime ? (
            <Text>{Number(farm.lockTime)/86400} {t('(days)')}</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase">{t('Deposit Fee')}:</Text>
          {farm.depositFee ? (
            <Text>{Number(farm.depositFee) / 100}%</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text textTransform="uppercase">{t('Withdraw Fee')}:</Text>
          {farm.withdrawFee ? (
            <Text>{Number(farm.withdrawFee) / 100}%</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <Flex justifyContent="space-between" padding="12px 0px">
          <Text>{t('Locked Until')}:</Text>
          {farm.userData.lockedUntil ? (
            <Text>{day} : {hour} : {min} : {second}</Text>
          ) : (
            <Skeleton ml="4px" width={60} height={24} />
          )}
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          addLiquidityUrl={addLiquidityUrl}
          displayApr={displayApr}
        />
      </FarmCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            bscScanAddress={getBscScanLink(lpAddress, 'address')}
            infoAddress={`/info/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={farm.isTokenOnly ? `/swap?outputCurrency=${farm.token.address}` : addLiquidityUrl}
            isCommunity={farm.isCommunity}
            auctionHostingEndDate={farm.auctionHostingEndDate}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  )
}

export default FarmCard
