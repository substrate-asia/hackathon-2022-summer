import { IVault } from 'state/vault/types';
import { TokenPairImage } from 'components/TokenImage';
import { Button } from '@my/ui';
import styled from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useVault, useVaultAllTotal } from 'state/vault/hooks';
import { useFarmsAllTotal } from 'state/farms/hooks';
import { useGovernanceAllTotal } from 'views/Governance/state/governance/hooks';
import { getDisplayApy } from 'views/Vault/Vault';

const HomeTvl = () => {
  const allVaultTotal = useVaultAllTotal();
  const allFarmsTotal = useFarmsAllTotal();
  const allGovernanceTotal = useGovernanceAllTotal();
  const { data: vaultsLP } = useVault();

  const [allTotal, setAllTotal] = useState('0');
  useEffect(() => {
    const _allVaultTotal = new BigNumber(allVaultTotal);
    if (_allVaultTotal.gt(0)) {
      const _allFarmsTotal = new BigNumber(allFarmsTotal);
      const _allGovernanceTotal = new BigNumber(allGovernanceTotal);
      setAllTotal(_allVaultTotal.plus(_allFarmsTotal).plus(_allGovernanceTotal).toFixed(8));
    }
    // setAllTotal(_allVaultTotal.toFixed(8));
  }, [allVaultTotal, allFarmsTotal, allGovernanceTotal]);
  return useMemo(
    () => (
      <HomeTvlStyled className="animate animate__animated" data-animate="animate__show">
        <div className="text">
          <h2>{Number(allTotal === 'NaN' ? '0' : allTotal).toFixed(2)}+</h2>
          <h3>AVAT TVL Amount</h3>
        </div>
        <div className="scroll">
          <ul>
            {vaultsLP.map((v: IVault, index: number) => {
              return (
                <li key={index} className="animate animate__animated" data-animate="animate__fadeInUp">
                  <TokenPairImage
                    variant="inverted"
                    primaryToken={v.vault.token0Address}
                    secondaryToken={v.vault.token1Address}
                    width={60}
                    height={60}
                  />
                  <div className="flex-middle">
                    <h3>{v.lpDetail.symbol}</h3>
                    <h4>{v.fromSource}</h4>
                  </div>
                  <ButtonStyled>
                    {getDisplayApy(Number(v.farm.apy))}%<i>APY</i>
                  </ButtonStyled>
                </li>
              );
            })}
          </ul>
        </div>
      </HomeTvlStyled>
    ),
    [allTotal, vaultsLP],
  );
};

const HomeTvlStyled = styled.div`
  padding: 60px 0 0;
  max-width: 1208px;
  margin: 0 auto;
  border-bottom: 1px solid #2e2d5b;
  ${({ theme }) => theme.mediaQueries.md} {
    border-bottom: none;
    padding: 200px 20px 0;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 200px 0 0;
  }
  &.animate__show {
    ul {
      li {
        &:nth-child(1) {
          animation: slide-up 1s ease-in-out;
          animation-fill-mode: forwards;
        }
        &:nth-child(2) {
          animation: slide-up 0.4s ease-in-out;
          animation-fill-mode: forwards;
          animation-delay: 0.4s;
        }
        &:nth-child(3) {
          animation: slide-up 0.4s ease-in-out;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
      }
    }
  }
  //
  .text {
    padding: 0 40px;
    h2 {
      font-size: 48px;
      padding-bottom: 12px;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 80px;
        padding-bottom: 8px;
      }
    }
    h3 {
      font-size: 16px;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 20px;
      }
    }
  }
  .scroll {
    overflow-x: auto;
    padding-left: 20px;
    ${({ theme }) => theme.mediaQueries.md} {
      overflow-x: inherit;
      padding-left: 0;
    }
  }
  ul {
    height: 180px;
    margin-top: 40px;
    margin-bottom: 60px;
    width: 770px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 100%;
      height: 108px;
      margin-top: 110px;
      margin-bottom: 200px;
    }
    li {
      opacity: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      width: 240px;
      height: 180px;
      background: #030222;
      border: 1px solid #2e2d5b;
      box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
      border-radius: 20px;
      transition: all 0.2s ease;
      background-repeat: no-repeat;
      float: left;
      background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #181733 100%);
      background-position: 0 0;
      margin-right: 12px;
      flex-wrap: wrap;
      ${({ theme }) => theme.mediaQueries.md} {
        float: right;
        width: 480px;
        height: 108px;
        background-image: radial-gradient(circle at 50% 0%, #040222 0%, #040222 100%);
        background-position: 0 -120px;
        padding: 0 30px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        &:hover {
          background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #040222 100%);
          background-position: 0 0;
        }
        &:nth-child(1) {
          margin-top: -160px;
          margin-right: 160px;
        }
        &:nth-child(2) {
          margin-right: 0;
        }
        &:nth-child(3) {
          margin-right: 60px;
        }
      }
      .flex-middle {
        width: 60%;
        display: line-block;
        ${({ theme }) => theme.mediaQueries.md} {
          margin-left: 12px;
          flex: 2;
        }
        h3 {
          font-size: 16px;
          ${({ theme }) => theme.mediaQueries.md} {
            font-size: 20px;
          }
        }
        h4 {
          font-size: 14px;
          color: #6a6991;
          line-height: 28px;
          font-weight: 600;
        }
      }
    }
  }
`;
const ButtonStyled = styled(Button)`
  font-size: 20px;
  background-image: linear-gradient(90deg, #a428d0 0%, #20d4a9 100%);
  margin-top: -40px;
  font-family: 'Poppins-SemiBold';

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
  i {
    font-size: 12px;
    font-style: normal;
    padding-top: 2px;
    padding-left: 6px;
  }
`;
export default HomeTvl;
