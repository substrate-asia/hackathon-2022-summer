import { useMemo } from 'react';
import styled from 'styled-components';

const IdoBanner = () => {
  return useMemo(() => {
    return (
      <IdoBannerStyled>
        <h1>Avault Public Sale</h1>
        <h2>
          We will sell a total of 2,000,000 AVA. The price of AVA is determined by the user. We will form LP with half
          of the total amount of astar invested by the user and AVA, and release it to the user.The other half of the
          ASTR will be released within half a year by the LPs of participating IDO users.
        </h2>

        <img className="banner_bg_pc" src="/images/ido/pc_banner.webp" alt="Avault Public Sale" />
      </IdoBannerStyled>
    );
  }, []);
};
const IdoBannerStyled = styled.div`
  background-image: url('./images/stake/bg_element.svg');
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: right 47px;
  position: relative;
  padding-bottom: 100px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 180px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding-bottom: 240px;
    background-size: 420px;
    background-position: right 246px;
  }
  img {
    display: block;
    position: absolute;
    top: 0;
    ${({ theme }) => theme.mediaQueries.md} {
      top: -40px;
    }
  }
  .banner_bg_pc {
    width: 100%;
    right: -30%;
    ${({ theme }) => theme.mediaQueries.md} {
      right: -14%;
      width: 80%;
    }
  }

  h1 {
    padding-bottom: 40px;
    width: 60%;
    background: linear-gradient(90deg, #ffd8fe 0%, #c5fff1 100%);
    -webkit-background-clip: text;
    color: transparent;
    font-size: 48px;
    line-height: 52px;
    padding-top: 100px;
    ${({ theme }) => theme.mediaQueries.xs} {
      padding-top: 120px;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 50%;
      padding-top: 208px;
      padding-bottom: 36px;
    }

    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 96px;
      line-height: 100px;
      padding-top: 177px;
    }
  }
  h2 {
    width: 80%;
    font-size: 15px;
    line-height: 24px;
    position: relative;
    z-index: 8;
    ${({ theme }) => theme.mediaQueries.sm} {
      width: 60%;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      width: 417px;
    }
  }
`;
export default IdoBanner;
