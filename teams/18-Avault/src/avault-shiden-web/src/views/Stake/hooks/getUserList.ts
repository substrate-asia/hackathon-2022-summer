import { useEffect, useState } from 'react';
import { IDappStakingInterface, IWithdrawRecordItem } from 'utils/types';
interface pageInterface {
  pageSize: number;
  pageNum: number;
}
const arr: IWithdrawRecordItem[] = [
  {
    era: 0, //the era started unbonding.
    address: '0x2E1C9Adc548963273d9e767413403719019bd639',
    amount: 10,
  },
  {
    era: 1111111, //the era started unbonding.
    address: '0x2E1C9Adc548963273d9e767413403719019bd639',
    amount: 120,
  },
];
const pageSize = 20;
export const GetUserList = (
  contract: IDappStakingInterface,
  recordsIndex: number,
  account: string,
): IWithdrawRecordItem[] => {
  // 当前处理到的数据   recordsIndex-500  最多
  const [list, setList] = useState<IWithdrawRecordItem[]>([]);
  useEffect(() => {
    if (contract && recordsIndex && account) {
      try {
        const getList = async () => {
          //  dapptodo
          // const records = await contract.records();
          const records = arr;
          const unbondingPeriod = await contract.unbondingPeriod();
          // console.log({ unbondingPeriod });
          if (records.length) {
            let len: number = 0;
            if (recordsIndex > 500 && records.length > 500) {
              len = Math.ceil((records.length - recordsIndex + 500) / pageSize);
            } else {
              len = Math.ceil(records.length / pageSize);
            }
            const pageList: pageInterface[] = [];
            for (let i = 0; i < len; i++) {
              const _pageSize = i === len - 1 ? len % pageSize : pageSize;
              pageList.push({
                pageNum: i,
                pageSize: _pageSize,
              });
            }
            const _list: IWithdrawRecordItem[] = [];
            const promiseArr = pageList.map(async (item: pageInterface) => {
              //  dapptodo
              // const getListApi = await contract.getWithdrawRecords(item.pageNum, item.pageSize);
              const getListApi = arr;
              _list.push(...getListApi);
              // console.log(222, _list, getListApi);
            });
            await Promise.all(promiseArr);
            // console.log(4444, _list);

            const __list = _list.length ? _list.filter((v: IWithdrawRecordItem) => v.address === account) : [];
            // console.log({ __list, _list });
            if (__list.length) {
              const ___list = __list.map((v) => ({
                ...v,
                status: Number(v.era.toString()) <= recordsIndex ? 0 : 1,
                unbonding: Number(v.era.toString()) + Number(unbondingPeriod.toString()),
              }));
              setList(___list);
            }
          }
        };
        getList();
      } catch (e) {
        // console.log('GetUserList err', e);
      }
    }
  }, [contract, recordsIndex, account]);
  // console.log({ list });
  return list;
};
