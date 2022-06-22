import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const VaultBanner = () => {
  return useMemo(() => {
    return (
      <VaultBannerStyled>
        <h2 className="vaultBanner_title">Vault</h2>
        <p className="vaultBanner_subtext">
          Providing the aLP/aToken to the users by deposited their LP or token from other dapp. Then, the vault will
          automation to continually reinvest deposited funds
        </p>
        <div className="bg_image">
          <img className="one" src="/images/vault/bg_image_01.svg" alt="Vault" />
          <img className="two" src="/images/vault/bg_image_02.svg" alt="Vault" />
          <img className="three" src="/images/vault/bg_image_03.svg" alt="Vault" />
        </div>
      </VaultBannerStyled>
    );
  }, []);
};
const floatingAnim = (x: string, y: string) => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(${x}, ${y});
  }
  to {
    transform: translate(0, 0px);
  }
`;

const floatingAnimLeft = (x: string, y: string) => keyframes`
  from {
    transform: translate(0,  0px);
    left: 0px
  }
  50% {
    transform: translate(${x}, ${y});
    left: 10px
  }
  to {
    transform: translate(0, 0px);
    left: 0px
  }
`;

const VaultBannerStyled = styled.div`
  position: relative;
  background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #030222 100%);
  border: 1px solid #2e2d5b;
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 18px;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
    padding: 40px;
  }
  .vaultBanner_title {
    display: inline-block;
    font-size: 48px;
    background: linear-gradient(90deg, #ffd8fe 0%, #c5fff1 100%);
    -webkit-background-clip: text;
    color: transparent;
    padding-top: 20px;
    padding-bottom: 20px;
    ${({ theme }) => theme.mediaQueries.md} {
      padding-top: 0;
      font-size: 58px;
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      font-size: 68px;
    }
  }
  .vaultBanner_subtext {
    font-size: 15px;
    line-height: 22px;
    width: 100%;
    position: relative;
    z-index: 3;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 80%;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      width: 70%;
    }
  }
  .bg_image {
    position: absolute;
    top: 4%;
    right: 2%;
    width: 30%;
    height: 70%;
    ${({ theme }) => theme.mediaQueries.sm} {
      top: 10%;
      width: 22%;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      width: 18%;
      top: 18%;
      right: 40px;
    }
    .one,
    .two,
    .three {
      position: absolute;
    }
    .one {
      width: 60%;
      top: 0%;
      right: 10%;
      animation: ${floatingAnim('3px', '15px')} 3s linear infinite;
    }
    .two {
      width: 8%;
      top: 6%;
      // right: 80%;
      animation: ${floatingAnimLeft('3px', '15px')} 3s linear infinite;
      animation-delay: 0.66s;
    }
    .three {
      width: 18%;
      top: 28%;
      // right: 80%;
      animation: ${floatingAnimLeft('-20px', '10px')} 3s linear infinite;
      animation-delay: 0.33s;
      ${({ theme }) => theme.mediaQueries.md} {
        top: 48%;
      }
    }
  }
`;

export default VaultBanner;
