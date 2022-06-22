import { Link } from '..';
import styled from 'styled-components';
import { Flex } from '@my/ui';
import HomeLogo from './HomeLogo';
interface IProps {
  collapsed: boolean;
}
const HomeFooter = ({ collapsed }: IProps) => {
  return (
    <HomeFooterStyled>
      <UlStyled>
        {Link.map((v, index) => (
          <li key={index}>
            <a href={v.link} target="_blank" rel="noreferrer">
              <img src={`/images/${v.name.toLowerCase()}.svg`} alt={v.name} />
            </a>
          </li>
        ))}
      </UlStyled>
      <p className="footer-text">C 2022 AVAULT Fin Corporation</p>
      <div className="footer-logo">
        <HomeLogo collapsed={collapsed} />
      </div>
    </HomeFooterStyled>
  );
};
const HomeFooterStyled = styled(Flex)`
  display: block;
  padding: 40px 0 60px;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 1208px;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding: 85px 0 65px;
  }
  .footer-logo {
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: block;
    }
  }
  .footer-text {
    display: block;
    font-size: 14px;
    color: #6a6991;
    font-weight: 500;
    padding-top: 20px;
    text-align: center;
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }
`;
const UlStyled = styled.ul`
  list-style: none;
  text-align: center;
  li {
    margin: 0 10px;
    display: inline-block;
    vertical-align: middle;
    &:last-child {
      img {
        width: 25px;
      }
    }
    a {
      display: block;
      cursor: pointer;
      opacity: 1;
      transition: all 0.3s ease;
      &:hover {
        opacity: 0.6;
      }
    }
    img {
      display: block;
      width: 32px;
    }
  }
`;
export default HomeFooter;
