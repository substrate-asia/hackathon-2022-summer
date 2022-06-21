import styled from 'styled-components';
import { Input } from '@my/ui';
import { useMemo } from 'react';
import { ILockAVATModalState } from 'views/Governance/state/governance/types';
interface IProps {
  val: string;
  handleChange: any;
  setWeekVal: any;
  weekLiVal: string;
  setWeekLiVal: any;
  withdrawalDate: string;
  lockAVATModalState: ILockAVATModalState;
}
// timestamp s
// block 6s
// 1day

const WeeksInput = ({ val, handleChange, setWeekVal, weekLiVal, setWeekLiVal }: IProps) => {
  return useMemo(() => {
    return (
      <WeeksInputStyled>
        <h2>How long would you like to lock for?</h2>
        <p className="grey">Select between 1 to 156 weeks</p>
        <ul>
          {weeksArrBig.map((v) => {
            // {(lockAVATModalState === ILockAVATModalState.INIT ? weeksArrBig : weeksArrSmall).map((v) => {
            const classname = weekLiVal === v.value && !val ? 'on' : '';
            // weekLiVal === v.value && !val
            //   ? 'on'
            //   : Number(withdrawalDate) > 24 * 60 * 60 * Number(v.value) * 7 + getTimeStamp()
            //   ? 'disable'
            //   : '';
            return (
              <li
                key={v.text}
                className={classname}
                onClick={() => {
                  // if (classname === 'disable') {
                  //   return;
                  // }
                  setWeekLiVal(v.value);
                  setWeekVal('');
                }}
              >
                {v.text}
              </li>
            );
          })}
        </ul>
        <InputStyled
          pattern={`^[0-9]*`}
          inputMode="decimal"
          value={val}
          step="any"
          min="0"
          onChange={handleChange}
          placeholder="Number OF WEEK"
        />
      </WeeksInputStyled>
    );
  }, [handleChange, setWeekLiVal, setWeekVal, val, weekLiVal]);
};

const weeksArrBig = [
  {
    text: '1week',
    value: '1',
  },
  {
    text: '4week',
    value: '4',
  },
  {
    text: '16week',
    value: '16',
  },
  {
    text: '1year',
    value: '52',
  },
  {
    text: '2year',
    value: '104',
  },
  {
    text: '3year',
    value: '156',
  },
];
// const weeksArrSmall = [
//   {
//     text: '1Week',
//     value: '1',
//   },
//   {
//     text: '2Week',
//     value: '2',
//   },
//   {
//     text: '4Week',
//     value: '4',
//   },
//   {
//     text: '8Week',
//     value: '8',
//   },
//   {
//     text: '20Week',
//     value: '20',
//   },
// ];
const WeeksInputStyled = styled.div`
  margin-top: 30px;
  h2 {
    font-size: 16px;
    margin-bottom: 12px;
  }
  .grey {
    font-size: 12px;
    color: #6a6991;
  }
  ul {
    padding-top: 16px;
    // display: flex;
    // justify-content: start;
    // align-items: center;
    li {
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      width: 108px;
      background-color: #25234c;
      border-radius: 8px;
      font-size: 15px;
      color: #6a6991;
      font-weight: 600;
      line-height: 36px;
      margin-right: 10px;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      cursor: pointer;
      &.on {
        color: #ffffff;
        background-color: #1476ff;
      }
      &.disable {
        color: #6a6991;
        background-color: #25234c;
        opacity: 0.4;
        cursor: not-allowed;
        &:hover {
          color: #6a6991;
          background-color: #25234c;
          opacity: 0.4;
        }
      }
      &:hover {
        color: #ffffff;
        background-color: #1476ff;
        opacity: 0.8;
      }
    }
  }
`;
const InputStyled = styled(Input)`
  margin-top: 6px;
  width: 180px;
`;
export default WeeksInput;
