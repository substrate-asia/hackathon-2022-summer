import { createGlobalStyle } from 'styled-components';
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@my/ui/dist/theme';
declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}
export const BgGlobalStyle = createGlobalStyle`
body {
  background-image: url('./images/stake/stake_bg_small.svg');
  background-size: 100%;
  background-position: center top;
  background-repeat: no-repeat;
  margin-bottom: -40px;
  @media screen and (max-width: 852px){
    div.inner{
      border-bottom: none!important;
    }
    .inner > .right{
      background-color: transparent!important;
    }
    .content{
      margin-bottom: 102px;
      min-height: 83vh;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    background-image: url('./images/stake/stake_bg.svg');
    background-position: center bottom;
  }
  &:before{
    content:"";
    width: 420px;
    height: 150px;
    background-image: url('./images/stake/bg_element.svg');
    background-size: 100%;
    position: absolute;
    background-repeat: no-repeat;
    
  }
  &:before{
    top: 80px;
    right: 40%;
    ${({ theme }) => theme.mediaQueries.md} {
      top: 160px;
      right: 50%;
    }
  }
}
#root{
  position: relative;
  z-index: 3;
}
`;
export const IDOGlobalStyle = createGlobalStyle`
body{
  padding: 0;
}
header{
  padding: 0;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 20px;
  }
}
.bg-holder{
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('/images/ido/h5_bg.png');
  background-position: 0 110vh;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-position: 0 660px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    background-position: 0 400px;
    background-image: url('/images/ido/pc_bg.png');
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    background-position: 0 230px;
  }
  ${({ theme }) => theme.mediaQueries.nav} {
  }
}
`;
const GlobalStyle = createGlobalStyle`
  
  body {
    background-color: ${({ theme }) => theme.colors.background02};
  }

`;

export default GlobalStyle;
