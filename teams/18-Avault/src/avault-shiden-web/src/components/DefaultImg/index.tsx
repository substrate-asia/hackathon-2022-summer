import styled from 'styled-components';

const DefaultImg: React.FC = (props) => {
  // return <img src="./images/icon-img.svg" alt="" {...props} />;
  return (
    <FlexStyled>
      <div></div>
      <div></div>
    </FlexStyled>
  );
};
const FlexStyled = styled.div`
  // justify-content: space-between;
  // align-content: center;
  position: relative;
  width: 60px;
  height: 60px;
  div {
    width: 62%;
    height: 62%;
    border-radius: 50%;
    position: absolute;
    top: 18%;
    &:nth-child(1) {
      left: 0;
      background-color: #f4b088;
    }
    &:nth-child(2) {
      right: 0;
      background-color: #6fabdc;
    }
  }
`;
export default DefaultImg;
