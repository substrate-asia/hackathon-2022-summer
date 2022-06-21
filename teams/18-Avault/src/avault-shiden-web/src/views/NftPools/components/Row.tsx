import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { Text, Flex } from '@my/ui';

// import LogoSvg from '../svg/demo.svg';
import { RowBetween } from '../../../components/Layout/Row';
import { NftPair } from '../hooks/useNftPools';

import { formatFloat } from 'views/NftPool/util/format';
import { NFT_PAIRS } from 'config/constants/nft';
import ArrowSvg from '../svg/arrow.svg';
import { usePollPrice, usePrice } from 'state/price/hooks';
const StyledTr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};

  td > .link {
    visibility: hidden;
    padding-right: 10px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    &:hover {
      background-color: ${({ theme }) => theme.colors.cardBackground};
      td > .link {
        color: ${({ theme }) => theme.colors.primary};
        visibility: visible;
        cursor: pointer;
      }
    }
  }

  &:last-child {
    border-bottom-width: 0px;
  }
  > td {
    vertical-align: middle;
  }
`;
const MoreTr = styled.tr`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  overflow: hidden;
`;

const PoolName_: FC<{ poolName: string; fragmentName: string; className?: string; logo?: string }> = ({
  poolName,
  fragmentName,
  className,
  logo,
}) => {
  return (
    <Flex alignItems="center" className={className}>
      <div>
        <img src={logo} alt="" />
      </div>
      <div>
        <Text bold fontSize="16px" mb={{ xs: '4px', md: '7px' }}>
          {poolName}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {fragmentName}
        </Text>
      </div>
    </Flex>
  );
};

const PoolName = styled(PoolName_)`
  padding: 12px 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 18px 0 18px 30px;
  }

  > div > img {
    height: 26px;
    width: 26px;
    margin-right: 12px;

    ${({ theme }) => theme.mediaQueries.md} {
      height: 52px;
      width: 52px;
      margin-right: 21px;
    }
  }
`;

const TitledItem_: FC<{ title: string; value: string | number }> = ({ title, value }) => {
  return (
    <div>
      <Text color="#9DA6A6" fontSize="12px" mb={{ md: '12px', xs: '6px' }}>
        {title}
      </Text>
      <Text bold fontSize="14px" color="btnTextColor">
        {value}
      </Text>
    </div>
  );
};
const TitledItem = styled(TitledItem_)``;

const Row: FC<{ pair: NftPair; simpleMode: boolean }> = ({ pair, simpleMode }) => {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  usePollPrice(pair.pairAddress, '100');
  const { priceVsBusdMap } = usePrice();
  return (
    <>
      <StyledTr
        onClick={() => setCollapsed((old) => !old)}
        onClickCapture={() => history.push(`/nft/pool/${pair.pairAddress}`)}
      >
        <td>
          <PoolName
            poolName={pair.name}
            fragmentName={pair.symbol}
            logo={NFT_PAIRS.find((p) => pair.pairAddress.toLowerCase() === p.address.toLowerCase())?.logo}
          />
        </td>
        {!simpleMode && (
          <>
            <td>
              <TitledItem title="NFT IN Pool" value={pair.supply.toLocaleString()} />
            </td>
            <td>
              <TitledItem title="Liquidity" value={pair.liquidity ? '$' + pair.liquidity.toLocaleString() : '-'} />
            </td>
          </>
        )}
        <td>
          <TitledItem
            title="Floor Price"
            value={'$' + formatFloat(Number(priceVsBusdMap[pair.pairAddress.toLowerCase()] || 0) * 100)}
          />
        </td>

        <td>
          <TitledItem
            title="Update NFT ID"
            value={NFT_PAIRS.find((p) => pair.pairAddress.toLowerCase() === p.address.toLowerCase())?.updateNFTID}
          />
        </td>
        {/* <td>
              <TitledItem title="7 Days Change" value={0} />
            </td> */}
        {!simpleMode && (
          <>
            <td>
              <div className="link">
                <img src={ArrowSvg} alt="" />
              </div>
            </td>
          </>
        )}
      </StyledTr>

      {
        <MoreTr>
          <td
            style={{
              overflow: 'hidden',
              transition: 'height 0.1s',
              height: simpleMode && !collapsed ? '100px' : '0px',
            }}
            colSpan={6}
          >
            <div
              style={{
                padding: simpleMode && !collapsed ? '10px 0px' : '0px',
                overflow: 'hidden',
                transition: 'height 0.1s',
                height: simpleMode && !collapsed ? '100px' : '0px',
              }}
            >
              <RowBetween padding="8px 12px">
                <Text fontSize="12px">NFT IN Pool</Text>
                <Text color="text">{pair.supply}</Text>
              </RowBetween>
              <RowBetween padding="8px 12px">
                <Text fontSize="12px">Liquidity</Text>
                <Text color="text">
                  {'$' + formatFloat(Number(priceVsBusdMap[pair.pairAddress.toLowerCase()] || 0) * pair.supply * 100)}
                </Text>
              </RowBetween>
              {/* <RowBetween padding="8px 12px">
                <Text fontSize="12px">7 Days Change</Text>
                <Text color="text">{0}</Text>
              </RowBetween> */}
            </div>
          </td>
        </MoreTr>
      }
    </>
  );
};

export default Row;
