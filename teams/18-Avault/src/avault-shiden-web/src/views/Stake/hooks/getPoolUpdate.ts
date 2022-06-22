import { useEffect, useState } from 'react';
import { IDappStakingInterface } from 'utils/types';
import { RATIO_PRECISION } from 'config/constants/dAppStaking';
export interface IDappPoolDataInterface {
  totalSupply: number;
  ratio: number;
  recordsIndex: number;
}
export const GetPoolUpdate = (contract: IDappStakingInterface): IDappPoolDataInterface => {
  // 当前处理到的数据   recordsIndex-500  最多
  const [, setRecordsIndex] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [ratio, setRatio] = useState(1);
  useEffect(() => {
    if (contract) {
      const getPool = async (contract: IDappStakingInterface) => {
        try {
          const __recordsIndex = await contract.recordsIndex();
          const __totalSupply = await contract.totalSupply();
          const __ratio = await contract.ratio();
          // console.log(__recordsIndex, __totalSupply, __ratio);
          setTotalSupply(Number(__totalSupply.toString()));
          setRatio(Number(__ratio.toString()) / RATIO_PRECISION);
          setRecordsIndex(Number(__recordsIndex.toString()));
          contract.on('PoolUpdate', (_recordsIndex, _totalSupply, _ratio) => {
            setTotalSupply(Number(_totalSupply.toString()));
            setRatio(Number(_ratio.toString()) / RATIO_PRECISION);
            setRecordsIndex(Number(_recordsIndex.toString()));
          });
        } catch (e) {
          console.log('get GetPoolUpdate err', e);
        }
      };
      getPool(contract);
    }
  }, [contract]);
  return {
    totalSupply,
    ratio,
    //  dapptodo
    recordsIndex: 1,
  };
};
