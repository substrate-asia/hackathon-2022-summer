import React, { useState } from 'react';
import { JSBI, Pair, Percent } from '@my/sdk';
import { Button, Text, Flex, CardProps } from '@my/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'contexts/Localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useTotalSupply from 'hooks/useTotalSupply';

import { useTokenBalance } from 'state/wallet/hooks';
import { currencyId } from 'utils/currencyId';
import { unwrappedToken } from 'utils/wrappedCurrency';

import { SolidCard } from '../Card';
import { AutoColumn } from '../Layout/Column';
import CurrencyLogo from '../Logo/CurrencyLogo';
import { DoubleCurrencyLogo } from '../Logo';
import { RowBetween, RowFixed } from '../Layout/Row';
import { BIG_INT_ZERO } from 'config/constants';
import Dots from '../Loader/Dots';
import DropdownSvg from './imgs/dropdown.png';
import AddIconWhite from 'components/svg/addIconWhite';
const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

interface PositionCardProps extends CardProps {
  pair: Pair;
  showUnwrapped?: boolean;
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const { t } = useTranslation();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <SolidCard>
          <AutoColumn gap="16px">
            <FixedHeightRow>
              <RowFixed>
                <Text color="#F1842C" bold>
                  {t('LP tokens in your wallet')}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                <Text fontSize="12px" small bold color="text">
                  {currency0.symbol}-{currency1.symbol} LP
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontSize="12px" color="primary">
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize="12px" color="textSubtle" small>
                  {t('Share of Pool')}:
                </Text>
                <Text fontSize="12px" color="text">
                  {poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize="12px" color="textSubtle" small>
                  {t('Pooled %asset%', { asset: currency0.symbol })}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize="12px" ml="6px" color="text">
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize="12px" color="textSubtle" small>
                  {t('Pooled %asset%', { asset: currency1.symbol })}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize="12px" ml="6px" color="text">
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </SolidCard>
      ) : (
        <SolidCard>
          <Text fontSize="12px" style={{ textAlign: 'center' }}>
            <span role="img" aria-label="pancake-icon">
              🙈
            </span>{' '}
            {t(
              "By adding liquidity you'll earn 0.1875% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </SolidCard>
      )}
    </>
  );
}
const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 12px;
  margin-bottom: 12px;

  > .main {
    padding: 0px 20px;
    height: 68px;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background02};
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    > .left,
    > .right {
      display: flex;
      align-items: center;
    }

    > .left {
      > span {
        font-size: 16px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.primary};
        margin-left: 14px;
      }
    }

    > .right {
      > span {
        font-weight: 500;
        margin-right: 12px;
        color: ${({ theme }) => theme.colors.text};
      }
    }
  }
`;

export default function FullPositionCard({ pair, ...props }: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);
  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <Wrapper style={{ borderRadius: '12px' }} {...props}>
      <div className="main" onClick={() => setShowMore(!showMore)}>
        <div className="left">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <span>{!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}</span>
        </div>
        <div className="right">
          <span>{userPoolBalance?.toSignificant(4)}</span>
          <img src={DropdownSvg} style={{ transform: showMore ? '' : 'scaleY(-1)' }} alt="" />
        </div>
      </div>

      {showMore && (
        <AutoColumn gap="8px" style={{ padding: '16px' }}>
          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency0} />
              <Text fontSize="12px" color="#9DA6A6" ml="14px">
                Pooled {currency0.symbol}
              </Text>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <Text fontSize="12px" color="#F1842C">
                  {token0Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency1} />
              <Text fontSize="12px" color="#9DA6A6" ml="14px">
                Pooled {currency1.symbol}
              </Text>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <Text fontSize="12px" color="#F1842C">
                  {token1Deposited?.toSignificant(6)}
                </Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <Text fontSize="12px" color="#9DA6A6">
              Share of pool
            </Text>
            <Text fontSize="12px" color="#F1842C">
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
            <Flex flexDirection="column" pt="10px">
              <Button
                style={{
                  opacity: '0.4',
                }}
                as={Link}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
                mb="8px"
              >
                Remove
              </Button>
              <Button
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="tertiary"
                startIcon={<AddIconWhite />}
                width="100%"
                style={{ fontSize: '12px' }}
              >
                Add liquidity instead
              </Button>
            </Flex>
          )}
        </AutoColumn>
      )}
    </Wrapper>
  );
}
