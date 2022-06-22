import { Text, Flex } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import React from 'react';
import styled from 'styled-components';
import LogoPng from './PoolHeader.svg';
import Toggle from 'components/Menu/GlobalSettings/Toggle';
import Search from 'components/Search';

const PoolHeader: React.FC<{
  className?: string;
  filter: string;
  stakedOnly: boolean;
  onStakedOnlyChange: (now: boolean) => void;
  onFilterChange: (now: string) => void;
  placeholder: string;
}> = ({ className, onStakedOnlyChange, filter, onFilterChange, stakedOnly, placeholder }) => {
  const { t } = useTranslation();

  return (
    <Flex className={className} justifyContent="space-between ">
      <div className="left">
        <img src={LogoPng} alt="LogoPng" />
        <Text color="#1476FF" fontSize="20px">
          {t('Just stake some tokens to earn.')}
        </Text>
        <Text color="#1476FF" fontSize="20px">
          {t('High APR, low risk')}
        </Text>
      </div>
      <div className="right">
        <Flex alignItems="center" mb="16px" justifyContent="flex-end">
          <Text color="textSubtle" mr="12px" bold>
            {t('Staked only')}
          </Text>
          <Toggle checked={stakedOnly} onChange={() => onStakedOnlyChange(!stakedOnly)} />
        </Flex>
        <Search value={filter} onChange={onFilterChange} placeholder={placeholder} />
      </div>
    </Flex>
  );
};

export default styled(PoolHeader)`
  padding-top: 11px;
  margin-bottom: 44px;
  flex-wrap: wrap;
  > .left {
    max-width: 404px;
    > div {
      font-size: 20px;
      line-height: 40px;
      font-family: Microsoft YaHei;
      font-weight: 900;
      color: #1476ff;
    }
    > img {
      height: 55px;
      margin-bottom: 20px;
    }
    margin-bottom: 25px;
    ${({ theme }) => theme.mediaQueries.sm} {
      margin-bottom: 0px;
    }
  }
  > .right {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    flex: 1;
    max-width: 360px;
  }
`;
