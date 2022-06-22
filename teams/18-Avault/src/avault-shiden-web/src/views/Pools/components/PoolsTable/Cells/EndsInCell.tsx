import React from 'react';
import { Flex, Link, Skeleton, Text, TimerIcon } from '@my/ui';
import { getBscScanLink } from 'utils';
import { Pool } from 'state/types';
import { useBlock } from 'state/block/hooks';
import Balance from 'components/Balance';
import { useTranslation } from 'contexts/Localization';
import { getPoolBlockInfo } from 'views/Pools/helpers';
import CellLayout from './CellLayout';

interface FinishCellProps {
  pool: Pool;
}

const EndsInCell: React.FC<FinishCellProps> = ({ pool }) => {
  const { sousId, totalStaked, startBlock, endBlock, isFinished } = pool;
  const { currentBlock } = useBlock();
  const { t } = useTranslation();

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock);

  const isCakePool = sousId === 0 || sousId === 1;

  const renderBlocks = shouldShowBlockCountdown ? (
    <Flex alignItems="center">
      <Flex flex="1.3">
        <Balance fontSize="16px" value={blocksToDisplay} decimals={0} />
        <Text ml="4px" textTransform="lowercase">
          {t('Blocks')}
        </Text>
      </Flex>
      <Flex flex="1">
        <Link
          external
          href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}
          onClick={(e) => e.stopPropagation()}
        >
          <TimerIcon ml="4px" />
        </Link>
      </Flex>
    </Flex>
  ) : (
    <Text>-</Text>
  );

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  const isLoadingPublicData = !totalStaked.gt(0) || !currentBlock || (!blocksRemaining && !blocksUntilStart);
  const showLoading = isLoadingPublicData && !isCakePool && !isFinished;
  return (
    <CellLayout label={hasPoolStarted || !shouldShowBlockCountdown ? t('Ends in') : t('Starts in')}>
      {showLoading ? <Skeleton width="80px" height="16px" /> : renderBlocks}
    </CellLayout>
  );
};

export default EndsInCell;
