import styled from 'styled-components';

const modulesArr = [
  {
    logo: './images/home/icon_vault.webp',
    title: 'Vault',
    content:
      'Providing the aLP/aToken to the users by deposited their LP or token from other dapp. Then, the vault will automation to continually reinvest deposited funds',
  },
  {
    logo: './images/home/icon_farm.webp',
    title: 'Farm',
    content: 'Providing higher revenue in $AVAT to the users by staked their aLP/aToken that received from vault',
  },
  {
    logo: './images/home/icon_zap.webp',
    title: 'Zap',
    content:
      'Allows you to directly switch from single asset to an LP token with just a click of a button without having to go other dex to switch out different asset',
  },
  {
    logo: './images/home/icon_governance.webp',
    title: 'Governance',
    content:
      'You can stake your $AVAT to get veAVAT. The number of veAVAT you get will depend on how long you choose to lock. Longer will be more. veAVAT will represent your share in the governance reward pool and your voting rights on upcoming governance features.',
  },
];
const HomeModules = () => {
  return (
    <HomeModulesStyled>
      <HomeModulesStyledInner>
        <h2>Main Modules</h2>
        <ul className="animate animate__animated" data-animate="animate__show">
          {modulesArr.map((v) => {
            return (
              <li key={v.logo} className="animate animate__animated" data-animate="animate__fadeInUp">
                <img src={v.logo} alt={v.title} />
                <h4>{v.title}</h4>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </HomeModulesStyledInner>
    </HomeModulesStyled>
  );
};
const HomeModulesStyledInner = styled.div`
  max-width: 1208px;
  background-image: url('/images/stake/bg_element.svg');
  background-repeat: no-repeat;
  background-size: 220px;
  background-position: right 60px;
  margin: 0 auto;
  padding: 0 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 420px;
    background-position: right 120px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 0;
  }
`;
const HomeModulesStyled = styled.div`
  background-image: url('/images/home/modules_bg.webp');
  background-size: 100% 120%;
  background-position: top center;
  background-repeat: no-repeat;
  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 100% 138%;
  }
  .animate__show {
    li {
      &:nth-child(1) {
        animation: slide-left 1s ease-in-out;
        animation-fill-mode: forwards;
      }
      &:nth-child(2) {
        animation: slide-right 0.4s ease-in-out;
        animation-fill-mode: forwards;
        animation-delay: 0.5s;
      }
      &:nth-child(3) {
        animation: slide-left 0.4s ease-in-out;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &:nth-child(4) {
        animation: slide-right 0.4s ease-in-out;
        animation-fill-mode: forwards;
        animation-delay: 1.5s;
      }
    }
  }
  h2 {
    font-size: 48px;
    text-align: center;
    padding: 60px 0 25px;
    position: relative;
    z-index: 2;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 80px;
      padding: 200px 0 120px;
    }
  }
  ul {
    padding-bottom: 80px;
    clear: both;
    max-width: 1200px;
    ${({ theme }) => theme.mediaQueries.md} {
      height: 760px;
      padding-bottom: 200px;
    }
    li {
      opacity: 0;
      display: flex;
      justify-content: start;
      align-items: center;
      flex-wrap: wrap;
      background: #030222;
      border: 1px solid #2e2d5b;
      border-radius: 20px;
      width: 100%;
      margin-top: 16px;
      padding: 40px 30px;
      background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #050222 100%);
      background-position: 0 0;
      background-repeat: no-repeat;
      color: #fff;
      ${({ theme }) => theme.mediaQueries.md} {
        margin-top: 40px;
        padding: 30px;
        justify-content: space-between;
        width: 48.3%;
        // background-image: radial-gradient(circle at 50% 0%, #181733 0%, #181733 100%);
        background-color: #181733;
        background-position: 0 -240px;
        transition: all 0.5s ease;
        height: 240px;
        color: #6a6991;
      }
      ${({ theme }) => theme.mediaQueries.lg} {
        padding: 40px 50px 40px 60px;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        &:nth-child(1),
        &:nth-child(3) {
          float: left;
        }
        &:nth-child(2),
        &:nth-child(4) {
          float: right;
        }
        &:hover {
          background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #050222 100%);
          // box-shadow: 0 10px 20px 5px rgb(0 0 0 / 3%);
          background-position: 0 0;
          // border-color: #050222;
          h3,
          p {
            color: #fff;
          }
        }
      }
      img {
        width: 68px;
        margin-left: -10px;
        margin-bottom: 32px;
        ${({ theme }) => theme.mediaQueries.md} {
          margin-bottom: 0;
          margin-left: 0;
        }
        ${({ theme }) => theme.mediaQueries.lg} {
          width: 96px;
        }
      }
      div {
        margin-left: 0;
        width: 100%;
        ${({ theme }) => theme.mediaQueries.md} {
          width: 70%;
        }
        ${({ theme }) => theme.mediaQueries.lg} {
          width: 66%;
        }
      }
      h4 {
        display: block;
        font-size: 30px;
        margin-bottom: 32px;
        ${({ theme }) => theme.mediaQueries.md} {
          display: none;
        }
      }
      h3 {
        transition: all 0.2s ease;
        font-size: 24px;
        margin-bottom: 20px;
        display: none;
        ${({ theme }) => theme.mediaQueries.md} {
          display: block;
          margin-bottom: 10px;
        }
        ${({ theme }) => theme.mediaQueries.lg} {
          font-size: 30px;
          margin-bottom: 20px;
        }
      }
      p {
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
`;
export default HomeModules;
