import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const FarmBanner = () => {
  return useMemo(() => {
    return (
      <FarmBannerStyled>
        <h2 className="farmBanner_title">Farm</h2>
        <p className="farmBanner_subtext">
          Providing higher revenue in $AVAT to the users by staked their aLP/aToken that received from vault{' '}
        </p>
        <div className="bg_image">
          <img className="one" src="/images/farm/bg_image_01.svg" alt="Vault" />
          <img className="two" src="/images/farm/bg_image_01.svg" alt="Vault" />
        </div>
      </FarmBannerStyled>
    );
  }, []);
};
const floatingAnim = (x: string, y: string) => keyframes`
from {
  transform: translate(0,  0px) rotate(0) scale(1);
}
50% {
  transform: translate(${x}, ${y}) rotate(360deg) scale(0.8);
}
to {
  transform: translate(0, 0px) rotate(0) scale(1);
}
`;

const FarmBannerStyled = styled.div`
  position: relative;
  background-image: linear-gradient(90deg, rgb(32 212 169 / 30%) 0%, rgb(164 40 208 / 30%) 100%);
  // background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #030222 100%);
  border: 1px solid #2e2d5b;
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  padding: 18px;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
    padding: 40px;
  }
  .farmBanner_title {
    display: inline-block;
    font-size: 48px;
    background: linear-gradient(90deg, #ffd8fe 0%, #c5fff1 100%);
    -webkit-background-clip: text;
    color: transparent;
    padding-bottom: 20px;
    font-weight: 800;

    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 58px;
    }
    ${({ theme }) => theme.mediaQueries.xl} {
      font-size: 68px;
    }
  }
  .farmBanner_subtext {
    font-size: 15px;
    line-height: 22px;
    width: 90%;
    position: relative;
    z-index: 3;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 15px;
      width: 50%;
    }
  }
  .bg_image {
    position: absolute;
    top: 0;
    right: 2%;
    width: 32%;
    height: 70%;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 22%;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      width: 18%;
      top: 18%;
      right: 40px;
    }
    .one,
    .two {
      position: absolute;
    }
    .one {
      width: 50%;
      top: 10%;
      right: 10%;
      animation: ${floatingAnim('3px', '15px')} 16s linear infinite;
    }
    .two {
      width: 24%;
      top: 30%;
      right: 80%;
      animation: ${floatingAnim('3px', '15px')} 13s linear infinite;
      animation-delay: 0.3s;
      opacity: 0.4;
    }
  }
`;

export default FarmBanner;
