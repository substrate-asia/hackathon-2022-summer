import styled from 'styled-components';
import { Heading, Text } from '@my/ui';

const StakeFr = () => {
  return (
    <UnbindListStyled>
      <TextStyle>Staked</TextStyle>
      <HeadingStyled>68379.182</HeadingStyled>

      <TextStyle>APR</TextStyle>
      <HeadingStyled>89%</HeadingStyled>
      <TextBgStyled>1 AVAT=1.001256 aAVAT</TextBgStyled>
    </UnbindListStyled>
  );
};
const UnbindListStyled = styled.div`
  background-image: url('./images/StakeFr_bg.png');
  background-color: ${({ theme }) => theme.colors.cardBackground};

  background-repeat: no-repeat;

  background-size: 150%;
  background-position: -70px -130px;

  border-radius: 23px;
  box-shadow: 2px 4px 7px 1px rgba(9, 2, 18, 0.3);
  margin-top: 12px;
  border: 1px solid #2e2d5b;
  overflow: hidden;
  width: 600px;
  padding: 30px 30px 80px;
  background-size: 150% 200%;
  position: relative;
  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 150%;
    margin-left: 12px;
    margin-top: 0;
    width: 240px;
    background-size: 160%;
    background-position: -51px 173px;
    padding: 30px;
  }
`;
const TextBgStyled = styled(Text)`
  font-weight: 600;
  font-size: 12px;
  color: #cc64f2;
  background: #25234c;
  border-radius: 12px;
  padding: 0 24px;
  height: 36px;
  line-height: 36px;
  // margin-top: 120px;
  white-space: nowrap;
  position: absolute;
  bottom: 35px;
`;
const TextStyle = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  font-weight: 600;
  padding-bottom: 10px;
`;
const HeadingStyled = styled(Heading)`
  font-size: 24px;
  padding-bottom: 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 30px;
  }
`;
export default StakeFr;
