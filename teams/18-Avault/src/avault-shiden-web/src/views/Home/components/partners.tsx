import { Flex } from '@my/ui';
import styled, { keyframes } from 'styled-components';

const partnersArr = [
  {
    icon: '/images/home/partner_on/Astar.svg',
    name: 'Astar',
    link: 'https://astar.network/',
  },
  {
    icon: '/images/home/partner_on/Next Web.svg',
    name: 'Next Web',
    link: 'https://nextweb.capital/',
  },

  {
    icon: '/images/home/partner_on/AU21.svg',
    name: 'AU21',
    link: 'https://au21.capital/',
  },

  {
    icon: '/images/home/partner_on/Cogitent.svg',
    name: 'Cogitent',
    link: 'https://cogitent.ventures/',
  },
  {
    icon: '/images/home/partner_on/Astriddao.svg',
    name: 'Astriddao',
    link: 'https://astriddao.xyz/',
  },
  {
    icon: '/images/home/partner_on/Sirius.svg',
    name: 'Sirius',
    link: 'https://www.sirius.finance/',
  },
];
const arr02 = [
  {
    icon: '/images/home/partner_on/Starbank.svg',
    name: 'Starbank',
    link: 'https://test.starbank.finance/#/',
  },
  {
    icon: '/images/home/partner_on/Libra.svg',
    name: 'Libra',
    link: 'https://drive.google.com/drive/folders/1Ydb2tV67qafHo3Er6fitaUmk9KihPg0v',
  },

  {
    icon: '/images/home/partner_on/Astar Sign Witch.svg',
    name: 'Astar Sign Witch',
    link: 'https://sign-witch.vercel.app/',
  },
  {
    icon: '/images/home/partner_on/Peckshield.svg',
    name: 'Peckshield',
    link: 'https://peckshield.com/',
  },
  {
    icon: '/images/home/partner_on/Astar Domain.svg',
    name: 'Astar Domain',
    link: 'https://astr.domains/',
  },
  {
    icon: '/images/home/partner_on/GTS VENTURES.svg',
    name: 'GTS VENTURES',
    link: 'https://gts.ventures/',
  },
];

const marquee = keyframes`
0% {
  transform: translateY(0);
}
100% {
  transform: translateY(-100%);
}
`;
const HomePartners = () => {
  return (
    <HomePartnersStyled>
      <h3>Partners</h3>
      <div className="ul_wrap_wrap">
        <div className="ul_wrap">
          {/* <div className="ul_wrap animate animate__animated" data-animate="animate__show"> */}
          <ul>
            {partnersArr.map((v, index) => {
              return (
                <li key={index}>
                  <a href={v.link} target="_blank" rel="noreferrer" title={v.name}>
                    <img src={v.icon} alt={v.name} />
                  </a>
                </li>
              );
            })}
            {partnersArr.length % 2 !== 0 ? <li className="null"></li> : null}
          </ul>
          <ul>
            {partnersArr.map((v, index) => {
              return (
                <li key={index}>
                  <a href={v.link} target="_blank" rel="noreferrer" title={v.name}>
                    <img src={v.icon} alt={v.name} />
                  </a>
                  {/* <IconBg name={v.name} href={v.link} target="_blank" rel="noreferrer" title={v.name} /> */}
                </li>
              );
            })}
            {partnersArr.length % 2 !== 0 ? <li className="null"></li> : null}
          </ul>
        </div>
        <div className="ul_wrap two">
          {/* <div className="ul_wrap animate animate__animated" data-animate="animate__show"> */}
          <ul>
            {arr02.map((v, index) => {
              return (
                <li key={index}>
                  <a href={v.link} target="_blank" rel="noreferrer" title={v.name}>
                    <img src={v.icon} alt={v.name} />
                  </a>
                </li>
              );
            })}
            {partnersArr.length % 2 !== 0 ? <li className="null"></li> : null}
          </ul>
          <ul>
            {arr02.map((v, index) => {
              return (
                <li key={index}>
                  <a href={v.link} target="_blank" rel="noreferrer" title={v.name}>
                    <img src={v.icon} alt={v.name} />
                  </a>
                  {/* <IconBg name={v.name} href={v.link} target="_blank" rel="noreferrer" title={v.name} /> */}
                </li>
              );
            })}
            {partnersArr.length % 2 !== 0 ? <li className="null"></li> : null}
          </ul>
        </div>
      </div>
      <h2>Partners</h2>
    </HomePartnersStyled>
  );
};
const HomePartnersStyled = styled(Flex)`
  display: block;
  padding: 0 20px;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: flex;
    max-width: 1208px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 0;
  }
  .animate__show {
    li {
      animation: slide-up 1s ease-in-out;
      animation-fill-mode: forwards;
    }
  }
  h3 {
    font-size: 48px;
    text-align: center;
    padding-top: 60px;
    display: block;
    background: linear-gradient(90deg, #ffd8fe 0%, #c5fff1 100%);
    -webkit-background-clip: text;
    color: transparent;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: none;
    }
  }
  h2 {
    font-size: 80px;
    display: none;
    background: linear-gradient(90deg, #ffd8fe 0%, #c5fff1 100%);
    -webkit-background-clip: text;
    color: transparent;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: block;
    }
  }
  .ul_wrap_wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.xl} {
      width: 700px;
      margin: 200px 0 170px;
    }
    &:hover {
      ul {
        animation-play-state: paused;
      }
    }
  }
  .ul_wrap {
    margin: 60px 0;
    height: 302px;
    overflow: hidden;
    width: 50%;
    ${({ theme }) => theme.mediaQueries.sm} {
      height: 482px;
    }
    &.two {
      ul {
        // animation-delay: 0.3s;
      }
    }
  }
  ul {
    animation: ${marquee} 15s linear infinite;

    // backface-visibility: hidden;
    // -webkit-transform: translate3d(0, 0, 0);
    // -webkit-backface-visibility: hidden;
    // -webkit-transform-style: preserve-3d;
    a {
      diplay: block;
      opacity: 0.7;
      transition: opacity 0.3s ease;
      &:hover {
        opacity: 1;
      }
    }
  }
  // ul {
  //   clear: both;
  //   overflow: hidden;
  //   text-align: center;
  //   transform-origin: 0% 0%;

  //   animation: ${marquee} 20s linear infinite;
  //   animation-fill-mode: forwards;
  //   backface-visibility: hidden;
  //   -webkit-transform: translate3d(0, 0, 0);
  //   -webkit-backface-visibility: hidden;
  //   -webkit-transform-style: preserve-3d;
  //   animation-delay: 0s;
  //   ${({ theme }) => theme.mediaQueries.sm} {
  //   }

  //   li {
  //     // opacity: 0;
  //     width: 200px;
  //     height: 60px;
  //     border: 1px solid #2e2d5b;
  //     border-radius: 12px;
  //     display: inline-block;
  //     margin-bottom: 15px;
  //     // background-image: radial-gradient(circle at 50% 0%, #181733 0%, #181733 100%);
  //     background-position: 0 -60px;
  //     background-color: #181733;
  //     background-image: radial-gradient(circle at 50% 0%, #3e255b 0%, #040222 100%);
  //     transition: background-position 0.5s ease;
  //     background-repeat: no-repeat;
  //     &.null {
  //       background: none;
  //       border: none;
  //       &:hover {
  //         background: none;
  //         border: none;
  //       }
  //     }
  //     &:nth-child(2n + 1) {
  //       margin-right: 15px;
  //     }
  //     ${({ theme }) => theme.mediaQueries.sm} {
  //       margin-right: 15px;
  //       background-position: 0 -80px;
  //       height: 80px;
  //     }
  //     ${({ theme }) => theme.mediaQueries.md} {
  //       background-position: 0 -100px;
  //       height: 100px;
  //     }
  //     ${({ theme }) => theme.mediaQueries.xl} {
  //       float: left;
  //       width: 320px;
  //       height: 120px;
  //       margin-right: 30px;
  //       margin-bottom: 30px;
  //       border-radius: 20px;
  //       background-position: 0 -120px;
  //       &:nth-child(2n + 1) {
  //         margin-right: 30px;
  //       }
  //     }

  //     &:hover {
  //       background-position: 0 0;
  //     }
  //     // a {
  //     //   display: block;
  //     //   width: 100%;
  //     //   height: 100%;
  //     //   background-repeat: no-repeat;
  //     //   background-size: 80%;
  //     //   background-position: center;
  //     // }
  //     img {
  //       height: 100%;
  //       margin: 0 auto;
  //       display: block;
  //     }
  //   }
  // }
`;
export default HomePartners;
